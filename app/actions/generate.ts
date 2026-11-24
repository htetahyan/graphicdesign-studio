"use server";

import crypto from "crypto";
import { analyzeBrandImages } from "@/lib/gemini";
import { logger } from "@/lib/logger";
import { eq, sql } from "drizzle-orm";
import { db, users } from "@/lib/db";

import {
  deductCreditsUpfront as originalDeductCreditsUpfront,
  requireAuthenticatedUser as originalRequireAuthenticatedUser,
  fetchValidatedBrand as originalFetchValidatedBrand,
  enqueueJob as originalEnqueueJob,
  checkJobStatus as originalCheckJobStatus,
  deductAndSave as originalDeductAndSave,
} from "./generate/db-ops";

import {
  fileToBase64 as originalFileToBase64,
  generateAndUploadImage as originalGenerateAndUploadImage,
} from "./generate/image-ops";

import { planCarouselSeries } from "@/lib/merge-prompt/carousel-planner";

// Re-export helpers for backward compatibility as explicit async functions to satisfy Turbopack server action rules
export async function deductCreditsUpfront(userId: string, cost: number = 10) {
  return originalDeductCreditsUpfront(userId, cost);
}

export async function requireAuthenticatedUser(minCredits: number = 10) {
  return originalRequireAuthenticatedUser(minCredits);
}

export async function fetchValidatedBrand(brandId: string) {
  return originalFetchValidatedBrand(brandId);
}

export async function enqueueJob(opts: {
  user: any;
  brandId: string;
  userPrompt: string;
  payload: any;
}) {
  return originalEnqueueJob(opts);
}

export async function checkJobStatus(jobId: string) {
  return originalCheckJobStatus(jobId);
}

export async function deductAndSave(opts: {
  user: any;
  brandId: string;
  userPrompt: string;
  finalImageUrl: string;
  params: any;
  campaignId?: string | null;
}) {
  return originalDeductAndSave(opts);
}

export async function fileToBase64(file: File) {
  return originalFileToBase64(file);
}

export async function generateAndUploadImage(opts: any) {
  return originalGenerateAndUploadImage(opts);
}

export async function generateAction(
  brandId: string,
  userPrompt: string,
  aspectRatio: string = "4:3",
  creativeMode: boolean = false,
  customHeadline?: string,
  ctaText?: string,
  speed: "slow" | "normal" = "normal",
  quality: "normal" | "hd" | "2k" | "4k" = "hd",
  visualStyle?: string,
  designType: string = "graphic_design",
  flyerStyle?: string,
  modelTier: "normal" | "pro" = "normal",
  editSourceUrl?: string,
  sessionId?: string,
) {
  const speedCost = speed === "slow" ? 7 : 10;
  const qualityCost = quality === "4k" ? 10 : quality === "2k" ? 5 : quality === "hd" ? 2 : 0;
  const modelCost = modelTier === "pro" ? 5 : 0;
  const rawCost = speedCost + qualityCost + modelCost;
  const minRequiredCredits = (quality === "2k" || quality === "4k") ? 7 : 4;
  const cost = Math.max(rawCost, minRequiredCredits);
  const user = await requireAuthenticatedUser(cost);
  await fetchValidatedBrand(brandId); // Validate first

  await deductCreditsUpfront(user.id, cost);

  try {
    const jobId = await enqueueJob({
      user, brandId, userPrompt,
      payload: {
        aspectRatio, creativeMode, customHeadline, ctaText, speed, quality, modelTier, visualStyle, designType, flyerStyle, cost,
        ...(editSourceUrl ? { isEdit: true, editSourceUrl } : {}),
        ...(sessionId ? { sessionId } : {}),
      }
    });
    return { status: "queued", jobId };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${cost}` }).where(eq(users.id, user.id));
    throw error;
  }
}

export async function generateActionWithRefs(
  formData: FormData,
  customHeadline?: string,
  ctaText?: string,
) {
  const speed = (formData.get("speed") as "slow" | "normal") || "normal";
  const quality = (formData.get("quality") as "normal" | "hd" | "2k" | "4k") || "hd";
  const modelTier = (formData.get("modelTier") as "normal" | "pro") || "normal";
  const visualStyle = String(formData.get("visualStyle") || "auto");
  const speedCost = speed === "slow" ? 7 : 10;
  const qualityCost = quality === "4k" ? 10 : quality === "2k" ? 5 : quality === "hd" ? 2 : 0;
  const modelCost = modelTier === "pro" ? 5 : 0;
  const rawCost = speedCost + qualityCost + modelCost;
  const minRequiredCredits = (quality === "2k" || quality === "4k") ? 7 : 4;
  const cost = Math.max(rawCost, minRequiredCredits);

  const user = await requireAuthenticatedUser(cost);

  const brandId = String(formData.get("brandId") || "");
  const userPrompt = String(formData.get("userPrompt") || "");
  const aspectRatio = String(formData.get("aspectRatio") || "4:3");
  const creativeMode = formData.get("creativeMode") === "true";
  const referenceInfluence = String(formData.get("referenceInfluence") || "normal") as "normal" | "high";

  const designType = (formData.get("designType") as string) || "graphic_design";
  const flyerStyle = (formData.get("flyerStyle") as string) || undefined;

  const finalHeadline = customHeadline || String(formData.get("customHeadline") || "");
  const finalCta = ctaText || String(formData.get("ctaText") || "");
  const editSourceUrl = String(formData.get("editSourceUrl") || "") || undefined;
  const sessionId = String(formData.get("sessionId") || "") || undefined;

  if (!brandId) throw new Error("Brand not found. Please select a valid brand.");
  if (!userPrompt) throw new Error("Please enter a prompt for your design.");

  await fetchValidatedBrand(brandId); // Validate first

  const referenceImages = formData.getAll("referenceImages").filter(Boolean) as File[];
  const characterImages = formData.getAll("characterImages").filter(Boolean) as File[];
  const characterBase64s = await Promise.all(characterImages.map(fileToBase64));
  const referenceBase64s = await Promise.all(referenceImages.map(fileToBase64));

  let referenceContext: string | null = null;
  let needsAnalysis = false;
  try {
    const analysisInputs = [...characterBase64s, ...referenceBase64s].filter(Boolean);
    if (analysisInputs.length > 0) {
      referenceContext = await analyzeBrandImages(analysisInputs);
    }
  } catch (error: any) {
    needsAnalysis = true;
    logger.info("Image analysis failed in server action, deferring to background job", { brandId });
  }

  await deductCreditsUpfront(user.id, cost);

  try {
    const jobId = await enqueueJob({
      user, brandId, userPrompt,
      payload: {
        aspectRatio, creativeMode, customHeadline: finalHeadline, ctaText: finalCta,
        referenceInfluence, characterBase64s, referenceBase64s, referenceContext, needsAnalysis,
        speed, quality, modelTier, visualStyle, designType, flyerStyle, cost,
        ...(editSourceUrl ? { isEdit: true, editSourceUrl } : {}),
        ...(sessionId ? { sessionId } : {}),
      }
    });
    return { status: "queued", jobId };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${cost}` }).where(eq(users.id, user.id));
    throw error;
  }
}

export async function generateCarouselAction(
  formData: FormData
) {
  const brandId = String(formData.get("brandId") || "");
  const userPrompt = String(formData.get("userPrompt") || "");
  const slideCount = Number(formData.get("slideCount") || 4);
  const aspectRatio = String(formData.get("aspectRatio") || "4:3");
  const creativeMode = formData.get("creativeMode") === "true";
  const visualStyle = String(formData.get("visualStyle") || "auto");
  const designType = (formData.get("designType") as string) || "graphic_design";
  const flyerStyle = (formData.get("flyerStyle") as string) || undefined;
  const speed = (formData.get("speed") as "slow" | "normal") || "normal";
  const quality = (formData.get("quality") as "normal" | "hd" | "2k" | "4k") || "hd";
  const modelTier = (formData.get("modelTier") as "normal" | "pro") || "normal";
  const sessionId = String(formData.get("sessionId") || "") || undefined;

  const speedCost = speed === "slow" ? 7 : 10;
  const qualityCost = quality === "4k" ? 10 : quality === "2k" ? 5 : quality === "hd" ? 2 : 0;
  const modelCost = modelTier === "pro" ? 5 : 0;
  const rawCost = speedCost + qualityCost + modelCost;
  const minRequiredCredits = (quality === "2k" || quality === "4k") ? 7 : 4;
  const costPerSlide = Math.max(rawCost, minRequiredCredits);
  const totalCost = costPerSlide * slideCount;

  const user = await requireAuthenticatedUser(totalCost);
  const brand = await fetchValidatedBrand(brandId); // Validate first

  const referenceImages = formData.getAll("referenceImages").filter(Boolean) as File[];
  const characterImages = formData.getAll("characterImages").filter(Boolean) as File[];
  const characterBase64s = await Promise.all(characterImages.map(fileToBase64));
  const referenceBase64s = await Promise.all(referenceImages.map(fileToBase64));

  await deductCreditsUpfront(user.id, totalCost);

  try {
    const plan = await planCarouselSeries(userPrompt, brand.style_context, slideCount, characterBase64s.length > 0);

    const jobIds: string[] = [];
    const seriesId = crypto.randomUUID();
    let previousJobId: string | null = null;

    for (let i = 0; i < slideCount; i++) {
      const slidePlan = plan.slides[i];
      const jobId = await enqueueJob({
        user,
        brandId,
        userPrompt,
        payload: {
          aspectRatio,
          creativeMode,
          speed,
          quality,
          modelTier,
          designType,
          flyerStyle,
          cost: costPerSlide,
          seriesId,
          slideIndex: i,
          totalSlides: slideCount,
          slidePlan,
          dependsOnJobId: previousJobId,
          characterBase64s: slidePlan.include_character ? characterBase64s : [],
          referenceBase64s,
          ...(sessionId ? { sessionId } : {}),
        },
      });
      jobIds.push(jobId);
      previousJobId = jobId; // Chain sequentially!
    }

    return { status: "queued", jobIds, seriesId };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${totalCost}` }).where(eq(users.id, user.id));
    throw error;
  }
}

export async function generateVideoAction(opts: {
  generationId: string;
  imageUrl: string;
  brandId: string;
  durationSeconds: 4 | 6;
}) {
  const { generationId, imageUrl, brandId, durationSeconds } = opts;
  const cost = durationSeconds === 4 ? 35 : 45; // Based on Fast Veo 3.1 ($0.08/s) ~ $0.32 or $0.48. 35/45 credits is good margin
  
  const user = await requireAuthenticatedUser(cost);
  await fetchValidatedBrand(brandId); 

  await deductCreditsUpfront(user.id, cost);

  const prompt = "Commercial motion-graphics ad reveal: start with a clean background with brand elements, then elements smoothly sliding and popping into place one by one, settling perfectly into the final poster. High quality, crisp, 4k commercial motion design.";

  try {
    const jobId = await enqueueJob({
      user,
      brandId,
      userPrompt: prompt,
      payload: {
        isVideo: true,
        imageUrl,
        durationSeconds,
        generationId,
        cost
      }
    });
    return { status: "queued", jobId };
  } catch (error) {
    await db.update(users).set({ credits: sql`COALESCE(credits, 0) + ${cost}` }).where(eq(users.id, user.id));
    throw error;
  }
}
