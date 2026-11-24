"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db, brands, campaigns, generations, users } from "@/lib/db";
import { getSessionUser } from "./user-auth";
import {
  deductCreditsUpfront,
  enqueueJob,
  fetchValidatedBrand,
  requireAuthenticatedUser,
} from "./generate";
import { planCarouselSeries } from "@/lib/merge-prompt/carousel-planner";
import {
  CAMPAIGN_FORMATS,
  buildPackPrompt,
  computePackCost,
  formatByKey,
} from "@/lib/campaign/pack";
import { latestAssetsForCampaign } from "@/lib/campaign/status";

const CreateCampaignSchema = z.object({
  brandId: z.string().uuid(),
  title: z.string().min(2).max(120),
  brief: z.string().min(8).max(2000),
  offer: z.string().max(300).optional(),
  headline: z.string().max(120).optional(),
  ctaText: z.string().max(80).optional(),
  formats: z.array(z.string()).min(1).max(4),
  includeCarousel: z.boolean().optional(),
  slideCount: z.number().int().min(2).max(6).optional(),
  contactName: z.string().max(120).optional(),
  industry: z.string().max(80).optional(),
  lockedColors: z.string().max(200).optional(),
  lockedFonts: z.string().max(200).optional(),
  doNotUse: z.string().max(400).optional(),
});

function parseColorList(raw?: string) {
  if (!raw?.trim()) return [] as string[];
  return raw
    .split(/[,|\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function requireOwner() {
  const user = (await getSessionUser()) as { id: string; username: string; credits: number } | null;
  if (!user) throw new Error("Please log in.");
  return user;
}

export async function listCampaigns() {
  const user = await requireOwner();
  const rows = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, user.id),
    orderBy: [desc(campaigns.createdAt)],
    with: {
      brand: { columns: { id: true, name: true, logoUrl: true } },
    },
    limit: 50,
  });
  return rows.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    formats: c.formats,
    expectedAssetCount: c.expectedAssetCount,
    createdAt: c.createdAt.toISOString(),
    brandName: c.brand?.name ?? "Brand",
    brandLogo: c.brand?.logoUrl ?? null,
  }));
}

export async function getCampaignDetail(campaignId: string) {
  const user = await requireOwner();
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)),
    with: {
      brand: {
        columns: {
          id: true,
          name: true,
          logoUrl: true,
          contactName: true,
          industry: true,
          lockedColors: true,
          lockedFonts: true,
          doNotUse: true,
        },
      },
    },
  });
  if (!campaign) throw new Error("Campaign not found.");

  const assets = await latestAssetsForCampaign(campaign.id);
  const origin = await getRequestOrigin();

  return {
    id: campaign.id,
    title: campaign.title,
    brief: campaign.brief,
    offer: campaign.offer,
    headline: campaign.headline,
    ctaText: campaign.ctaText,
    formats: campaign.formats,
    includeCarousel: campaign.includeCarousel,
    expectedAssetCount: campaign.expectedAssetCount,
    jobIds: campaign.jobIds,
    status: campaign.status,
    reviewToken: campaign.reviewToken,
    reviewUrl: `${origin}/r/${campaign.reviewToken}`,
    clientNote: campaign.clientNote,
    reviewedAt: campaign.reviewedAt?.toISOString() ?? null,
    createdAt: campaign.createdAt.toISOString(),
    brand: campaign.brand,
    assets: assets.map(({ formatKey, generation }) => ({
      formatKey,
      label: formatByKey(formatKey)?.label || formatKey,
      aspectRatio: formatByKey(formatKey)?.aspectRatio || null,
      id: generation.id,
      resultUrl: generation.resultUrl,
      createdAt: generation.createdAt.toISOString(),
    })),
  };
}

export async function getReviewCampaign(token: string) {
  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.reviewToken, token),
    with: {
      brand: { columns: { id: true, name: true, logoUrl: true } },
    },
  });
  if (!campaign) throw new Error("Review link is invalid.");
  if (campaign.status === "generating") {
    return {
      status: campaign.status as string,
      title: campaign.title,
      brandName: campaign.brand?.name ?? "Brand",
      brandLogo: campaign.brand?.logoUrl ?? null,
      assets: [] as { formatKey: string; label: string; resultUrl: string }[],
      clientNote: campaign.clientNote,
    };
  }

  const assets = await latestAssetsForCampaign(campaign.id);
  return {
    status: campaign.status,
    title: campaign.title,
    brief: campaign.brief,
    offer: campaign.offer,
    brandName: campaign.brand?.name ?? "Brand",
    brandLogo: campaign.brand?.logoUrl ?? null,
    clientNote: campaign.clientNote,
    assets: assets.map(({ formatKey, generation }) => ({
      formatKey,
      label: formatByKey(formatKey)?.label || formatKey,
      resultUrl: generation.resultUrl,
    })),
  };
}

export async function createCampaignPack(input: unknown) {
  const parsed = CreateCampaignSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid campaign.");

  const data = parsed.data;
  const formats = CAMPAIGN_FORMATS.filter((f) => data.formats.includes(f.key));
  if (formats.length === 0) throw new Error("Pick at least one format.");

  const includeCarousel = Boolean(data.includeCarousel);
  const slideCount = data.slideCount || 4;
  const { perAsset, assetCount, total } = computePackCost({
    formatCount: formats.length,
    includeCarousel,
    slideCount,
  });

  const user = await requireAuthenticatedUser(total);
  const brand = await fetchValidatedBrand(data.brandId);
  if (brand.userId !== user.id) throw new Error("You can only use your own brands.");

  const lockedColors = parseColorList(data.lockedColors);
  const lockedFonts = parseColorList(data.lockedFonts);

  await db
    .update(brands)
    .set({
      contactName: data.contactName || brand.contactName,
      industry: data.industry || brand.industry,
      lockedColors: lockedColors.length ? lockedColors : brand.lockedColors,
      lockedFonts: lockedFonts.length ? lockedFonts : brand.lockedFonts,
      doNotUse: data.doNotUse || brand.doNotUse,
    })
    .where(eq(brands.id, brand.id));

  const brandLocks = {
    lockedColors: lockedColors.length ? lockedColors : brand.lockedColors,
    lockedFonts: lockedFonts.length ? lockedFonts : brand.lockedFonts,
    doNotUse: data.doNotUse || brand.doNotUse,
  };

  await deductCreditsUpfront(user.id, total);

  const reviewToken = crypto.randomBytes(16).toString("hex");
  const jobIds: string[] = [];

  try {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        userId: user.id,
        brandId: brand.id,
        title: data.title,
        brief: data.brief,
        offer: data.offer || null,
        headline: data.headline || null,
        ctaText: data.ctaText || null,
        formats: formats.map((f) => f.key),
        includeCarousel,
        expectedAssetCount: assetCount,
        jobIds: [],
        status: "generating",
        reviewToken,
      })
      .returning({ id: campaigns.id });

    if (!campaign) throw new Error("Failed to create campaign.");

    for (const format of formats) {
      const userPrompt = buildPackPrompt({
        brief: data.brief,
        offer: data.offer,
        headline: data.headline,
        ctaText: data.ctaText,
        formatHint: format.promptHint,
        brandLocks,
      });
      const jobId = await enqueueJob({
        user,
        brandId: brand.id,
        userPrompt,
        payload: {
          aspectRatio: format.aspectRatio,
          creativeMode: false,
          customHeadline: data.headline,
          ctaText: data.ctaText,
          speed: "normal",
          quality: "hd",
          modelTier: "pro",
          cost: perAsset,
          campaignId: campaign.id,
          formatKey: format.key,
        },
      });
      jobIds.push(jobId);
    }

    if (includeCarousel) {
      const plan = await planCarouselSeries(
        buildPackPrompt({
          brief: data.brief,
          offer: data.offer,
          headline: data.headline,
          ctaText: data.ctaText,
          formatHint: "multi-slide social carousel",
          brandLocks,
        }),
        brand.style_context,
        slideCount,
        false,
      );
      const seriesId = crypto.randomUUID();
      let previousJobId: string | null = null;
      for (let i = 0; i < slideCount; i++) {
        const slidePlan = plan.slides[i];
        const jobId = await enqueueJob({
          user,
          brandId: brand.id,
          userPrompt: data.brief,
          payload: {
            aspectRatio: "4:5",
            creativeMode: false,
            speed: "normal",
            quality: "hd",
            modelTier: "pro",
            cost: perAsset,
            campaignId: campaign.id,
            formatKey: `carousel_${i + 1}`,
            seriesId,
            slideIndex: i,
            totalSlides: slideCount,
            slidePlan,
            dependsOnJobId: previousJobId,
          },
        });
        jobIds.push(jobId);
        previousJobId = jobId;
      }
    }

    await db.update(campaigns).set({ jobIds }).where(eq(campaigns.id, campaign.id));

    revalidatePath("/campaigns");
    return { campaignId: campaign.id, jobIds, cost: total };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${total}` }).where(eq(users.id, user.id));
    throw error;
  }
}

export async function requestCampaignRevision(opts: {
  campaignId: string;
  generationId: string;
  instruction: string;
}) {
  const instruction = opts.instruction.trim();
  if (instruction.length < 3) throw new Error("Describe the change.");
  if (instruction.length > 500) throw new Error("Keep the revision under 500 characters.");

  const user = await requireAuthenticatedUser(computePackCost({ formatCount: 1, includeCarousel: false }).perAsset);
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, opts.campaignId), eq(campaigns.userId, user.id)),
  });
  if (!campaign) throw new Error("Campaign not found.");

  const generation = await db.query.generations.findFirst({
    where: and(eq(generations.id, opts.generationId), eq(generations.userId, user.id)),
  });
  if (!generation?.resultUrl) throw new Error("Asset not found.");

  const params = (generation.params || {}) as Record<string, unknown>;
  const formatKey = typeof params.formatKey === "string" ? params.formatKey : "revision";
  const aspectRatio =
    formatByKey(formatKey)?.aspectRatio ||
    (typeof params.aspectRatio === "string" ? params.aspectRatio : "1:1");
  const cost = computePackCost({ formatCount: 1, includeCarousel: false }).perAsset;

  await deductCreditsUpfront(user.id, cost);

  try {
    const jobId = await enqueueJob({
      user,
      brandId: campaign.brandId,
      userPrompt: `[EDIT EXISTING DESIGN] ${instruction}\nKeep the rest of the design, brand, and layout. Original brief: ${campaign.brief}`,
      payload: {
        aspectRatio,
        creativeMode: false,
        customHeadline: campaign.headline,
        ctaText: campaign.ctaText,
        speed: "normal",
        quality: "hd",
        modelTier: "pro",
        cost,
        campaignId: campaign.id,
        formatKey,
        isEdit: true,
        editSourceUrl: generation.resultUrl,
      },
    });

    const nextIds = [...(campaign.jobIds || []), jobId];
    await db
      .update(campaigns)
      .set({
        jobIds: nextIds,
        expectedAssetCount: campaign.expectedAssetCount + 1,
        status: "generating",
        clientNote: instruction,
      })
      .where(eq(campaigns.id, campaign.id));

    revalidatePath(`/campaigns/${campaign.id}`);
    return { jobId };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${cost}` }).where(eq(users.id, user.id));
    throw error;
  }
}

export async function shareCampaignForReview(campaignId: string) {
  const user = await requireOwner();
  const [updated] = await db
    .update(campaigns)
    .set({ status: "in_review" })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)))
    .returning({ reviewToken: campaigns.reviewToken, status: campaigns.status });
  if (!updated) throw new Error("Campaign not found.");
  const origin = await getRequestOrigin();
  revalidatePath(`/campaigns/${campaignId}`);
  return { reviewUrl: `${origin}/r/${updated.reviewToken}` };
}

export async function submitReviewDecision(opts: {
  token: string;
  decision: "approved" | "changes_requested";
  note?: string;
}) {
  const note = opts.note?.trim() || null;
  if (opts.decision === "changes_requested" && (!note || note.length < 3)) {
    throw new Error("Please describe the changes you need.");
  }

  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.reviewToken, opts.token),
    columns: { id: true, status: true },
  });
  if (!campaign) throw new Error("Review link is invalid.");
  if (campaign.status === "generating") throw new Error("This pack is still generating.");

  await db
    .update(campaigns)
    .set({
      status: opts.decision,
      clientNote: note,
      reviewedAt: new Date(),
    })
    .where(eq(campaigns.id, campaign.id));

  revalidatePath(`/campaigns/${campaign.id}`);
  return { ok: true as const };
}

async function getRequestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
