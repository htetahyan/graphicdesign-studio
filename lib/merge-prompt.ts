import "server-only";

import { cleanAndParseJson, generateContentWithModelFallback, prepareImageInput, getOrCreateContextCache } from "./gemini";
import { TEXT_FALLBACK_MODEL, TEXT_PRIMARY_MODEL } from "./gemini/models";
import type { NanobannaPrompt } from "./types";
import { validateNanobannaPrompt } from "./merge-prompt/schema";
import { promptCache, CACHE_TTL, getCacheKey, cleanExpiredCache } from "./merge-prompt/cache";
import { buildSystemInstruction } from "./merge-prompt/instructions";
import type { VisualStyleArchetype } from "./merge-prompt/instructions/archetypes";

async function repairGeminiJson(rawText: string): Promise<string> {
  const result = await generateContentWithModelFallback({
    primaryModel: TEXT_PRIMARY_MODEL,
    fallbackModel: TEXT_FALLBACK_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Fix this into valid JSON ONLY (no markdown, no explanation).\n\nRules:\n- Output must be a single JSON object.\n- Preserve all keys and values as much as possible.\n- Do not invent new facts.\n- Do not change language of any text fields.\n\nRAW_RESPONSE:\n${rawText}`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  return result.text ?? "";
}

export async function mergePrompt(
  brandContext: any,
  userPrompt: string,
  referenceContext: any | null = null,
  imageInputs: {
    logoUrl?: string | null;
    characterUrl?: string | null;
    referenceUrls?: string[];
    existingDesignUrl?: string | null;
  } = {},
  creativeMode: boolean = false,
  referenceInfluence: "normal" | "high" = "normal",
  aspectRatio: string = "4:3",
  customHeadline?: string,
  ctaText?: string,
  visualStyle?: VisualStyleArchetype,
  designType: "graphic_design" | "flyer" = "graphic_design",
  flyerStyle?: string,
): Promise<NanobannaPrompt> {
  // Pre-process: Strip hashtags from user prompt
  const cleanedUserPrompt = userPrompt
    .replace(/#[\w\u1000-\u109F\u1780-\u17FF]+/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  // Check cache first
  const cacheKey = getCacheKey(
    brandContext,
    cleanedUserPrompt,
    referenceContext,
    imageInputs,
    creativeMode,
    referenceInfluence,
    aspectRatio,
    customHeadline,
    ctaText,
    visualStyle,
    designType,
    flyerStyle,
  );
  cleanExpiredCache();
  const cached = promptCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.prompt;
  }

  const isCarousel = cleanedUserPrompt.includes("[CAROUSEL SLIDE");
  const hasCharacterImage = !!imageInputs.characterUrl;
  const hasReferenceImages = !!(imageInputs.referenceUrls && imageInputs.referenceUrls.length > 0);

  const systemInstruction = buildSystemInstruction({
    brandContext,
    cleanedUserPrompt,
    referenceContext,
    creativeMode,
    referenceInfluence,
    aspectRatio,
    customHeadline,
    ctaText,
    isCarousel,
    hasCharacterImage,
    hasReferenceImages,
    visualStyle,
    designType,
    flyerStyle,
    isEdit: Boolean(imageInputs.existingDesignUrl),
  });

  // Prepare images for Gemini to see — with explicit role labels so the planner
  // knows which image is the logo, which is the subject/character, and which are references
  const labeledImageParts: Promise<any[]>[] = [];

  if (imageInputs.logoUrl) {
    labeledImageParts.push(
      prepareImageInput(imageInputs.logoUrl).then(img => [
        { text: "[IMAGE INPUT #1 — BRAND LOGO] The following image is the official brand logo. Stamp it exactly." },
        img
      ])
    );
  }

  if (imageInputs.characterUrl) {
    labeledImageParts.push(
      prepareImageInput(imageInputs.characterUrl).then(img => [
        { text: "[IMAGE INPUT #2 — MAIN SUBJECT / CHARACTER] The following image is the user's primary human/character subject. Incorporate this person as the foreground hero." },
        img
      ])
    );
  }

  if (imageInputs.existingDesignUrl) {
    labeledImageParts.push(
      prepareImageInput(imageInputs.existingDesignUrl).then(img => [
        { text: "[EXISTING FINISHED DESIGN] This image is the design to revise. Reproduce it. Change only what the request names. Do not invent a new layout, photo, or headline." },
        img
      ])
    );
  }

  if (imageInputs.referenceUrls && imageInputs.referenceUrls.length > 0) {
    imageInputs.referenceUrls.forEach((refUrl, idx) => {
      labeledImageParts.push(
        prepareImageInput(refUrl).then(img => [
          { text: `[IMAGE INPUT #${(imageInputs.logoUrl ? 1 : 0) + (imageInputs.characterUrl ? 1 : 0) + idx + 1} — STYLE REFERENCE] Style reference image #${idx + 1}. Mirror layout, balance, depth, and motif.` },
          img
        ])
      );
    });
  }

  const resolvedImageParts = (await Promise.all(labeledImageParts)).flat();

  // Combine instructions, labeled images, and prompt text
  const parts: any[] = [
    { text: systemInstruction },
    ...resolvedImageParts,
    { text: `Generative Request:\nPrompt: ${cleanedUserPrompt}` }
  ];

  let rawResponse = "";
  try {
    const result = await generateContentWithModelFallback({
      primaryModel: TEXT_PRIMARY_MODEL,
      fallbackModel: TEXT_FALLBACK_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    rawResponse = result.text ?? "";
  } catch (err: any) {
    console.error("Gemini mergePrompt error:", err);
    throw new Error(`Failed to generate design plan: ${err.message || String(err)}`);
  }

  let parsedJson: any;
  try {
    parsedJson = cleanAndParseJson(rawResponse);
  } catch (firstParseErr) {
    console.warn("First JSON parse failed, attempting repair model...", firstParseErr);
    try {
      const repairedText = await repairGeminiJson(rawResponse);
      parsedJson = cleanAndParseJson(repairedText);
    } catch (secondParseErr) {
      console.error("Failed to parse Gemini response as JSON even after repair:", rawResponse);
      throw new Error("AI output was not valid JSON. Please try again.");
    }
  }

  // Validate structure using Zod/schema validation
  let finalPrompt: NanobannaPrompt = parsedJson as NanobannaPrompt;
  try {
    validateNanobannaPrompt(parsedJson);
  } catch (validationError) {
    console.warn("Gemini output JSON failed strict schema validation, returning fallback object:", validationError);
  }

  // Cache the result before returning
  promptCache.set(cacheKey, { prompt: finalPrompt, timestamp: Date.now() });

  return finalPrompt;
}
