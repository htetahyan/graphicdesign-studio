import { NextRequest, NextResponse } from "next/server";
import { generateAndUploadImage, deductAndSave } from "@/app/actions/generate";
import { generateAndUploadVideo } from "@/app/actions/generate/video-ops";
import { analyzeBrandImages } from "@/lib/gemini";
import { logger } from "@/lib/logger";
import { eq, and, sql, lt } from "drizzle-orm";
import { db, generationJobs, users, brands } from "@/lib/db";
import { isRateLimitError, refundUserCredits } from "./utils/helpers";
import { refreshCampaignStatus } from "@/lib/campaign/status";
import type { DesignImageInput } from "@/lib/image-inputs";

export const maxDuration = 300;

// Vercel Serverless maximum execution limit on hobby is 10s, pro is 60s.
// We will attempt to process the job. If we hit a rate limit, we will wait 
// if we have time, otherwise we restore the job to pending so the client can re-ping.
const MAX_VERCEL_EXECUTION_TIME_MS = 290000; 

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  // Auto-fail stuck jobs older than 180 seconds (3 minutes) to keep the concurrent queue clear
  const threeMinutesAgo = new Date(Date.now() - 180 * 1000);
  await db
    .update(generationJobs)
    .set({ status: "failed", errorMessage: "Job timed out (stuck in processing)." })
    .where(and(
      eq(generationJobs.status, "processing"),
      lt(generationJobs.startedAt, threeMinutesAgo)
    ));

  // Check current active job count to prevent overload
  const [activeResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(generationJobs)
    .where(eq(generationJobs.status, "processing"));

  const activeJobsCount = activeResult?.count ?? 0;
  const MAX_CONCURRENT_JOBS = 5;

  if (activeJobsCount >= MAX_CONCURRENT_JOBS) {
    return NextResponse.json({
      status: "throttled",
      message: `Too many active jobs (${activeJobsCount}/${MAX_CONCURRENT_JOBS}). Please wait.`,
    }, { status: 429 });
  }

  // Attempt to claim the job — update status to processing only if currently pending
  const [claimedJob] = await db
    .update(generationJobs)
    .set({ status: "processing", startedAt: new Date() })
    .where(and(
      eq(generationJobs.id, jobId),
      eq(generationJobs.status, "pending")
    ))
    .returning();

  if (!claimedJob) {
    return NextResponse.json({ status: "skipped", message: "Job not found or already processing." });
  }

  // Fetch related user and brand data
  const jobUser = await db.query.users.findFirst({
    where: eq(users.id, claimedJob.userId),
    columns: {
      id: true,
      username: true,
      credits: true,
      isBlocked: true,
    },
  });
  const jobBrand = await db.query.brands.findFirst({
    where: eq(brands.id, claimedJob.brandId),
    columns: {
      id: true,
      userId: true,
      name: true,
      description: true,
      logoUrl: true,
      styleContext: true,
      createdAt: true,
    },
  });

  if (!jobUser || !jobBrand) {
    return NextResponse.json({ status: "failed", error: "User or brand not found." }, { status: 404 });
  }

  try {
    const payload = claimedJob.payload as any;
    const speed = payload.speed || "normal";
    const quality = payload.quality || "hd";
    const modelTier = payload.modelTier || "normal";
    const cost = typeof payload.cost === "number" ? payload.cost : 10;

    if (jobUser.isBlocked) {
      await db
        .update(generationJobs)
        .set({
          status: "failed",
          errorMessage: "Rate limit exceeded. Too many requests — please try again later.",
          completedAt: new Date(),
        })
        .where(eq(generationJobs.id, jobId));

      await refundUserCredits(db, claimedJob.userId, cost);
      await triggerNextJob(req.nextUrl.origin, jobId);

      return NextResponse.json({ status: "failed", error: "Rate limit exceeded. Too many requests — please try again later." }, { status: 429 });
    }

    // Check if this job depends on a parent job (for carousel sequential generation)
    const dependsOnJobId = payload.dependsOnJobId;
    if (dependsOnJobId) {
      const parentJob = await db.query.generationJobs.findFirst({
        where: eq(generationJobs.id, dependsOnJobId),
      });

      if (!parentJob) {
        await db.update(generationJobs)
          .set({ status: "failed", errorMessage: "Parent job not found." })
          .where(eq(generationJobs.id, jobId));
        await refundUserCredits(db, claimedJob.userId, cost);
        await triggerNextJob(req.nextUrl.origin, jobId);
        return NextResponse.json({ status: "failed", error: "Parent job not found" }, { status: 500 });
      }

      if (parentJob.status === "failed") {
        await db.update(generationJobs)
          .set({ status: "failed", errorMessage: "Parent job failed." })
          .where(eq(generationJobs.id, jobId));
        await refundUserCredits(db, claimedJob.userId, cost);
        await triggerNextJob(req.nextUrl.origin, jobId);
        return NextResponse.json({ status: "failed", error: "Parent job failed" }, { status: 500 });
      }

      if (parentJob.status !== "completed") {
        // Parent job is not done yet. Reset status to pending so it can be claimed again later.
        await db.update(generationJobs)
          .set({ status: "pending", startedAt: null })
          .where(eq(generationJobs.id, jobId));
        return NextResponse.json({ status: "waiting", message: "Waiting for parent job to complete." });
      }
    }

    const user = { 
        id: claimedJob.userId, 
        username: jobUser.username, 
        credits: (jobUser.credits ?? 0) + cost
    };
    const brand = {
      ...jobBrand,
      logo_url: jobBrand.logoUrl,
      style_context: jobBrand.styleContext,
    };

    if (payload.isVideo) {
      const { videoUrl } = await generateAndUploadVideo({
        imageUrl: payload.imageUrl,
        durationSeconds: payload.durationSeconds,
        prompt: claimedJob.prompt,
      });

      const generationParams = {
        type: "video",
        originalGenerationId: payload.generationId,
        cost,
      };

      await deductAndSave({
        user,
        brandId: brand.id,
        userPrompt: claimedJob.prompt,
        finalImageUrl: videoUrl,
        params: generationParams,
      });

      await db
        .update(generationJobs)
        .set({
          status: "completed",
          resultUrl: videoUrl,
          completedAt: new Date(),
        })
        .where(eq(generationJobs.id, jobId));

      await triggerNextJob(req.nextUrl.origin, jobId);
      return NextResponse.json({ status: "completed", resultUrl: videoUrl });
    }

    let referenceContext = payload.referenceContext || null;

    if (payload.needsAnalysis && payload.characterBase64s && payload.referenceBase64s) {
        const analysisInputs = [...payload.characterBase64s, ...payload.referenceBase64s].filter(Boolean);
        if (analysisInputs.length > 0) {
            referenceContext = await analyzeBrandImages(analysisInputs);
        }
    }

    const brandLogoUrl = brand.logo_url;
    let allImageUrls = [brandLogoUrl];
    let imageAssets = { logoUrl: brandLogoUrl } as any;
    const imageInputs: DesignImageInput[] = [];

    if (brandLogoUrl) {
      imageInputs.push({ url: brandLogoUrl, role: "logo" });
    }

    if (payload.characterBase64s || payload.referenceBase64s) {
        const charPrim = payload.characterBase64s?.[0] ?? null;
        imageAssets = {
            logoUrl: brandLogoUrl,
            characterUrl: charPrim,
            referenceUrls: [...(payload.characterBase64s?.slice(1) ?? []), ...(payload.referenceBase64s ?? [])]
        };
        allImageUrls = [brandLogoUrl, ...(payload.characterBase64s||[]), ...(payload.referenceBase64s||[])].filter(Boolean);
        
        if (payload.characterBase64s && payload.characterBase64s.length > 0) {
            payload.characterBase64s.forEach((base64: string, index: number) => {
                imageInputs.push({
                    url: base64,
                    role: index === 0 ? "primary_subject" : "secondary_subject"
                });
            });
        }
        if (payload.referenceBase64s && payload.referenceBase64s.length > 0) {
            payload.referenceBase64s.forEach((base64: string) => {
                imageInputs.push({
                    url: base64,
                    role: "style_reference"
                });
            });
        }
    }

    if (payload.isEdit && payload.editSourceUrl) {
      imageInputs.push({ url: payload.editSourceUrl, role: "existing_design" });
      allImageUrls = [...allImageUrls, payload.editSourceUrl].filter(Boolean);
      imageAssets = { ...imageAssets, existingDesignUrl: payload.editSourceUrl };
    }

    const lockColors = (jobBrand as { lockedColors?: string[] | null }).lockedColors;
    const lockFonts = (jobBrand as { lockedFonts?: string[] | null }).lockedFonts;
    const doNotUse = (jobBrand as { doNotUse?: string | null }).doNotUse;
    let lockSuffix = "";
    if (lockColors?.length) lockSuffix += `\nBRAND LOCK colors: ${lockColors.join(", ")}.`;
    if (lockFonts?.length) lockSuffix += `\nBRAND LOCK fonts: ${lockFonts.join(", ")}.`;
    if (doNotUse) lockSuffix += `\nDo not use: ${doNotUse}.`;

    // Build slide specific prompt if slidePlan is present
    let userPrompt = claimedJob.prompt + lockSuffix;
    if (payload.isEdit && payload.editSourceUrl) {
      userPrompt = `[EDIT THE ATTACHED FINISHED DESIGN]
Revise the attached image. Do not create a new design.
Change only the request below. Keep the same layout, subjects, logo, colors, and every line of text that was not asked to change.
Requested change:
${claimedJob.prompt}${lockSuffix}`;
    }
    if (payload.slidePlan) {
      const sp = payload.slidePlan;
      userPrompt = `[CAROUSEL SLIDE ${payload.slideIndex + 1}/${payload.totalSlides}]
Theme: ${claimedJob.prompt}
Slide Role: ${sp.role}
Headline: ${sp.headline}
Visual Focus: ${sp.content_focus}
Details: ${sp.subprompt}${lockSuffix}`;
    }

    const opts = {
      user,
      brand,
      userPrompt,
      aspectRatio: payload.aspectRatio || "4:3",
      creativeMode: payload.creativeMode || false,
      referenceInfluence: payload.referenceInfluence || "normal",
      customHeadline: payload.customHeadline,
      ctaText: payload.ctaText,
      visualStyle: payload.visualStyle,
      designType: payload.designType || "graphic_design",
      flyerStyle: payload.flyerStyle,
      referenceContext,
      imageAssets,
      allImageUrls: allImageUrls as string[],
      imageInputs,
      speed,
      quality,
      modelTier,
    };

    const { finalImageUrl, fullPromptJson } = await generateAndUploadImage(opts);

    // Save generation with carousel metadata embedded in params
    const generationParams = {
      ...fullPromptJson,
      _reference_context: referenceContext,
      speed,
      quality,
      modelTier,
      cost,
      ...(payload.seriesId ? {
        seriesId: payload.seriesId,
        slideIndex: payload.slideIndex,
        totalSlides: payload.totalSlides,
        slidePlan: payload.slidePlan,
      } : {}),
      ...(payload.sessionId ? { sessionId: payload.sessionId } : {}),
      ...(payload.campaignId ? {
        campaignId: payload.campaignId,
        formatKey: payload.formatKey || null,
      } : {}),
    };

    await deductAndSave({
      user,
      brandId: brand.id,
      userPrompt: claimedJob.prompt,
      finalImageUrl,
      params: generationParams,
      campaignId: payload.campaignId || null,
    });

    await db
      .update(generationJobs)
      .set({
        status: "completed",
        resultUrl: finalImageUrl,
        completedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId));

    if (payload.campaignId) {
      try {
        await refreshCampaignStatus(payload.campaignId);
      } catch (campaignErr) {
        logger.error("Failed to refresh campaign status", campaignErr as Error, { campaignId: payload.campaignId });
      }
    }

    // Async trigger of next job in sequence
    await triggerNextJob(req.nextUrl.origin, jobId);

    return NextResponse.json({ status: "completed", resultUrl: finalImageUrl });

  } catch (error: any) {
    logger.error("Job worker error", error as Error, { jobId });

    const payload = claimedJob.payload as any;
    const cost = typeof payload?.cost === "number" ? payload.cost : 10;

    if (isRateLimitError(error)) {
        const elapsed = Date.now() - startTime;
        await db.update(generationJobs).set({ status: "pending" }).where(eq(generationJobs.id, jobId));
        return NextResponse.json({
          status: elapsed < MAX_VERCEL_EXECUTION_TIME_MS - 10000 ? "rate_limited_retrying" : "rate_limited_timeout"
        }, { status: 429 });
    }

    await db
      .update(generationJobs)
      .set({
        status: "failed",
        errorMessage: String(error?.message || "Unknown error occurred"),
        completedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId));

    await refundUserCredits(db, claimedJob.userId, cost);

    if (payload?.campaignId) {
      try {
        await refreshCampaignStatus(payload.campaignId);
      } catch (campaignErr) {
        logger.error("Failed to refresh campaign status on failure", campaignErr as Error, { campaignId: payload.campaignId });
      }
    }

    // Cascade failure to downstream jobs
    await triggerNextJob(req.nextUrl.origin, jobId);

    return NextResponse.json({ status: "failed", error: String(error?.message) }, { status: 500 });
  }
}

async function triggerNextJob(origin: string, finishedJobId: string) {
  try {
    const nextJob = await db.query.generationJobs.findFirst({
      where: eq(sql`payload->>'dependsOnJobId'`, finishedJobId),
    });

    if (nextJob) {
      console.log(`[Carousel Sequence] Triggering next job: ${nextJob.id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Abort after 2 seconds

      try {
        await fetch(`${origin}/api/process-job?jobId=${nextJob.id}`, {
          method: "POST",
          signal: controller.signal,
        });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("[Carousel Sequence] Next job fetch aborted after timeout (expected, as it runs in background).");
        } else {
          console.error("[Carousel Sequence] Failed to POST next job:", err);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
  } catch (err) {
    console.error("[Carousel Sequence] triggerNextJob error:", err);
  }
}
