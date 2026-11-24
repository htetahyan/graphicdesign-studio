import "server-only";

import { generateContentWithModelFallback, prepareImageInput } from "./client";
import { TEXT_FALLBACK_MODEL, TEXT_PRIMARY_MODEL } from "./models";
import { cleanAndParseJson } from "./json-utils";
import { getFullAnalysisPrompt } from "./brand-analysis-prompt/full-analysis-prompt";
import { getStyleOnlyPrompt } from "./brand-analysis-prompt/style-only-prompt";

const brandAnalysisCache = new Map<string, { analysis: any; timestamp: number }>();
const BRAND_CACHE_TTL = 60 * 60 * 1000; // 1 hour TTL
const MAX_BRAND_CACHE_SIZE = 20;

function getBrandAnalysisCacheKey(input: string[]): string {
  const hashes = input.map(img => typeof img === 'string' ? img.slice(0, 100) : 'buffer').join('|');
  return hashes;
}

function cleanExpiredBrandCache() {
  const now = Date.now();
  for (const [key, value] of brandAnalysisCache.entries()) {
    if (now - value.timestamp > BRAND_CACHE_TTL) {
      brandAnalysisCache.delete(key);
    }
  }
  if (brandAnalysisCache.size > MAX_BRAND_CACHE_SIZE) {
    const entries = Array.from(brandAnalysisCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, brandAnalysisCache.size - MAX_BRAND_CACHE_SIZE);
    for (const [key] of toRemove) {
      brandAnalysisCache.delete(key);
    }
  }
}

export async function analyzeBrandImages(
  input: string[] | { buffer: Buffer; mimeType: string }[],
) {
  if (input.every(item => typeof item === 'string')) {
    const cacheKey = getBrandAnalysisCacheKey(input as string[]);
    cleanExpiredBrandCache();
    const cached = brandAnalysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < BRAND_CACHE_TTL) {
      return cached.analysis;
    }
  }

  const images = await Promise.all(input.slice(0, 5).map(prepareImageInput));
  const prompt = getFullAnalysisPrompt();

  try {
    const result = await generateContentWithModelFallback({
      primaryModel: TEXT_PRIMARY_MODEL,
      fallbackModel: TEXT_FALLBACK_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...images],
        },
      ],
      config: {
        temperature: 0.3,
      },
    });

    const output: any = result.text ?? "";
    const analysis = cleanAndParseJson(output);

    if (input.every(item => typeof item === 'string')) {
      const cacheKey = getBrandAnalysisCacheKey(input as string[]);
      brandAnalysisCache.set(cacheKey, { analysis, timestamp: Date.now() });
    }

    return analysis;
  } catch (e) {
    console.error("Gemini analysis failed (fail-fast):", e);
    if (e instanceof SyntaxError && e.message.includes("JSON")) {
      throw new Error(
        "Failed to parse brand analysis. The AI response was incomplete. Please try again or use fewer images.",
      );
    }
    throw e;
  }
}

export async function analyzeBrandImagesStyleOnly(
  input: string[] | { buffer: Buffer; mimeType: string }[],
) {
  const images = await Promise.all(input.slice(0, 5).map(prepareImageInput));
  const prompt = getStyleOnlyPrompt();

  try {
    const result = await generateContentWithModelFallback({
      primaryModel: TEXT_PRIMARY_MODEL,
      fallbackModel: TEXT_FALLBACK_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...images],
        },
      ],
      config: {
        temperature: 0.2,
      },
    });

    const output: any = result.text ?? "";
    return cleanAndParseJson(output);
  } catch (e) {
    console.error("Gemini composition-only analysis failed (fail-fast):", e);
    if (e instanceof SyntaxError && e.message.includes("JSON")) {
      throw new Error(
        "Failed to parse reference image analysis. The AI response was incomplete. Please try again with fewer reference images.",
      );
    }
    throw e;
  }
}
