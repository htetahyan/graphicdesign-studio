import "server-only";

import { getSessionUser } from "../user-auth";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { eq, and, gte, sql } from "drizzle-orm";
import { db, brands, generations, generationJobs, users } from "@/lib/db";

export type AuthenticatedUser = { id: string; username: string; credits: number };

export async function deductCreditsUpfront(userId: string, cost: number = 10) {
  const [updatedUser] = await db
    .update(users)
    .set({ credits: sql`COALESCE(credits, 0) - ${cost}` })
    .where(and(eq(users.id, userId), gte(users.credits, cost)))
    .returning({ id: users.id });

  if (!updatedUser) {
    throw new Error(`Insufficient credits. You need at least ${cost} credits to generate an image.`);
  }
}

export async function requireAuthenticatedUser(minCredits: number = 10): Promise<AuthenticatedUser> {
  const user = (await getSessionUser()) as (AuthenticatedUser & { isBlocked: boolean }) | null;
  if (!user) throw new Error("Please log in to generate images");
  if (user.isBlocked) {
    throw new Error("Rate limit exceeded. Too many requests — please try again later.");
  }
  if (user.credits < minCredits) {
    throw new Error(`Insufficient credits. You need at least ${minCredits} credits to generate an image.`);
  }
  return user;
}

export async function fetchValidatedBrand(brandId: string) {
  const brand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
    columns: {
      id: true,
      userId: true,
      name: true,
      description: true,
      logoUrl: true,
      styleContext: true,
      createdAt: true,
    },
    with: { brandImages: true },
  });

  if (!brand) throw new Error("Brand not found. Please select a valid brand.");
  if (!brand.logoUrl) {
    throw new Error("Brand logo is required. Please upload a logo for this brand before generating.");
  }
  if (!brand.styleContext) {
    throw new Error("Brand style context is missing. Please edit this brand and save its style context JSON before generating.");
  }
  return {
    ...brand,
    contactName: null as string | null,
    industry: null as string | null,
    lockedColors: null as string[] | null,
    lockedFonts: null as string[] | null,
    doNotUse: null as string | null,
    logo_url: brand.logoUrl,
    style_context: brand.styleContext,
    brand_images: brand.brandImages,
  };
}

export async function deductAndSave(opts: {
  user: AuthenticatedUser;
  brandId: string;
  userPrompt: string;
  finalImageUrl: string;
  params: any;
  campaignId?: string | null;
}) {
  const { user, brandId, userPrompt, finalImageUrl, params } = opts;

  try {
    const [generation] = await db
      .insert(generations)
      .values({
        userId: user.id,
        brandId: brandId,
        prompt: userPrompt,
        resultUrl: finalImageUrl,
        params,
      })
      .returning({
        id: generations.id,
        createdAt: generations.createdAt,
        resultUrl: generations.resultUrl,
        prompt: generations.prompt,
        brandId: generations.brandId,
      });

    revalidatePath("/profile");
    revalidatePath("/gallery");
    revalidatePath("/generate");

    return {
      id: generation.id,
      created_at: generation.createdAt,
      result_url: generation.resultUrl,
      prompt: generation.prompt,
      brand_id: generation.brandId,
    };
  } catch (saveError) {
    logger.error("Failed to save generation to DB", saveError as Error, { userId: user.id, brandId });
    return {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      brand_id: brandId,
      prompt: userPrompt,
      result_url: finalImageUrl,
      created_at: new Date().toISOString(),
    };
  }
}

export async function enqueueJob(opts: {
  user: AuthenticatedUser;
  brandId: string;
  userPrompt: string;
  payload: any;
}) {
  const { user, brandId, userPrompt, payload } = opts;

  const [job] = await db
    .insert(generationJobs)
    .values({
      userId: user.id,
      brandId: brandId,
      prompt: userPrompt,
      payload,
      status: "pending",
    })
    .returning({ id: generationJobs.id });

  if (!job) throw new Error("Failed to enqueue job");
  return job.id;
}

export async function checkJobStatus(jobId: string) {
  const job = await db.query.generationJobs.findFirst({
    where: eq(generationJobs.id, jobId),
    columns: { status: true, resultUrl: true, errorMessage: true, startedAt: true, createdAt: true },
  });

  if (!job) throw new Error("Job not found");

  const threeMinutesAgo = new Date(Date.now() - 180 * 1000);

  if (
    (job.status === "processing" && job.startedAt && job.startedAt < threeMinutesAgo)
  ) {
    await db.update(generationJobs)
      .set({ status: "failed", errorMessage: "Job timed out." })
      .where(eq(generationJobs.id, jobId));
    return { status: "failed", error: "Job timed out." };
  }

  if (job.status === "completed" && job.resultUrl) {
    const gen = await db.query.generations.findFirst({
      where: eq(generations.resultUrl, job.resultUrl),
      columns: { id: true, createdAt: true, resultUrl: true, prompt: true, brandId: true, params: true },
    });

    const rawParams = (gen?.params || {}) as Record<string, any>;
    const sanitizedParams = {
      seriesId: rawParams.seriesId || null,
      slideIndex: typeof rawParams.slideIndex === 'number' ? rawParams.slideIndex : null,
      totalSlides: typeof rawParams.totalSlides === 'number' ? rawParams.totalSlides : null,
      speed: rawParams.speed || null,
      quality: rawParams.quality || null,
      cost: typeof rawParams.cost === 'number' ? rawParams.cost : null,
      aspectRatio: rawParams.aspectRatio || rawParams.generation_settings?.aspect_ratio || rawParams.aspect_ratio || null,
    };

    const mapped = gen
      ? {
          id: gen.id,
          created_at: gen.createdAt,
          result_url: gen.resultUrl,
          prompt: gen.prompt,
          brand_id: gen.brandId,
          params: sanitizedParams,
        }
      : { result_url: job.resultUrl, params: sanitizedParams };
    return { status: "completed", generation: mapped };
  }

  return { status: job.status, error: job.errorMessage };
}
