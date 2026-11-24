import "server-only";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { mergePrompt } from "@/lib/merge-prompt";
import { generateGeminiImage } from "@/lib/gemini-image";
import { logger } from "@/lib/logger";
import { AuthenticatedUser } from "./db-ops";
import { withLockedPropsIfNeeded, type DesignImageInput } from "@/lib/image-inputs";

export async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function generateAndUploadImage(opts: {
  user: AuthenticatedUser;
  brand: any;
  userPrompt: string;
  aspectRatio: string;
  creativeMode: boolean;
  referenceInfluence: "normal" | "high";
  customHeadline?: string;
  ctaText?: string;
  referenceContext: string | null;
  imageAssets: {
    logoUrl: string;
    characterUrl?: string | null;
    referenceUrls?: string[];
    existingDesignUrl?: string | null;
  };
  allImageUrls: string[];
  imageInputs?: DesignImageInput[];
  visualStyle?: any;
  designType?: "graphic_design" | "flyer";
  flyerStyle?: string;
  speed?: "slow" | "normal";
  quality?: "normal" | "hd" | "2k" | "4k";
  modelTier?: "normal" | "pro";
}) {
  const {
    user, brand, userPrompt, aspectRatio, creativeMode,
    referenceInfluence, customHeadline, ctaText,
    referenceContext, imageAssets, allImageUrls,
    visualStyle,
    designType = "graphic_design",
    flyerStyle,
    imageInputs: rawImageInputs = [],
    speed = "normal", quality = "hd",
    modelTier = "normal",
  } = opts;

  const startTime = Date.now();

  const mergeStart = Date.now();
  const fullPromptJson = await mergePrompt(
    brand.style_context,
    userPrompt,
    referenceContext,
    imageAssets,
    creativeMode,
    referenceInfluence,
    aspectRatio,
    customHeadline,
    ctaText,
    visualStyle,
    designType,
    flyerStyle,
  );
  logger.info(`[TIMING] mergePrompt: ${Date.now() - mergeStart}ms`, { brandId: brand.id });

  const editingExisting = rawImageInputs.some((input) => input.role === "existing_design");
  const imagePrompt = editingExisting
    ? `EDIT THE ATTACHED FINISHED DESIGN. Do not create a new poster.\nKeep every part the user did not ask to change.\n\nREQUESTED CHANGE:\n${userPrompt}\n\nIf the execution plan conflicts with the attached design, the attached design wins. Apply only the requested change:\n${JSON.stringify(fullPromptJson)}`
    : `USER_REQUEST:\n${userPrompt}\n\nEXECUTION_PLAN_JSON (follow this plan exactly):\n${JSON.stringify(fullPromptJson)}`;

  let imageInputs = [...rawImageInputs];
  if (imageInputs.length === 0) {
    if (imageAssets?.logoUrl) {
      imageInputs.push({ url: imageAssets.logoUrl, role: "logo" });
    }
    if (imageAssets?.characterUrl) {
      imageInputs.push({ url: imageAssets.characterUrl, role: "primary_subject" });
    }
    if (imageAssets?.referenceUrls) {
      imageAssets.referenceUrls.forEach((url) => {
        imageInputs.push({ url, role: "style_reference" });
      });
    }
  }
  imageInputs = await withLockedPropsIfNeeded(userPrompt, imageInputs);

  const genStart = Date.now();
  const imageBuffer = await generateGeminiImage(
    imagePrompt,
    brand.style_context,
    imageInputs,
    aspectRatio,
    speed,
    quality,
    modelTier,
  );
  logger.info(`[TIMING] generateGeminiImage: ${Date.now() - genStart}ms`, { brandId: brand.id });

  const uploadStart = Date.now();
  
  let uploadBuffer = imageBuffer;
  let fileName = `${user.id}/gen-${Date.now()}.png`;
  let contentType = "image/png";

  // Compress if size is over 4MB, or for high-res qualities (2K/4K) to avoid Supabase storage size limit issues.
  if (quality === "4k" || quality === "2k" || imageBuffer.length > 4 * 1024 * 1024) {
    try {
      const sharpModule = await import("sharp");
      const sharpInstance = typeof sharpModule === "function" ? sharpModule : (sharpModule as any).default || sharpModule;
      uploadBuffer = await sharpInstance(imageBuffer)
        .jpeg({ quality: 90, chromaSubsampling: "4:4:4" }) // High quality JPEG (pristine visual clarity, small size)
        .toBuffer();
      fileName = `${user.id}/gen-${Date.now()}.jpg`;
      contentType = "image/jpeg";
      logger.info(`[COMPRESSION] Reduced image size from ${imageBuffer.length} bytes to ${uploadBuffer.length} bytes (JPEG 90)`);
    } catch (compressErr) {
      logger.error("[COMPRESSION] Failed to compress with sharp, uploading original PNG", compressErr as any);
    }
  }

  const { error: uploadError } = await supabaseAdmin.storage
    .from("brand-assets")
    .upload(fileName, uploadBuffer, { contentType, upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("brand-assets").getPublicUrl(fileName);
  const finalImageUrl = data.publicUrl;

  logger.info(`[TIMING] uploadToSupabase: ${Date.now() - uploadStart}ms`, { brandId: brand.id });
  logger.info(`[TIMING] Total Generation Pipeline: ${Date.now() - startTime}ms`, {
    userId: user.id,
    brandId: brand.id,
    imageUrl: finalImageUrl,
  });

  return { finalImageUrl, fullPromptJson };
}
