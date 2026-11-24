import type { NanobannaPrompt } from "../types";

export const promptCache = new Map<string, { prompt: NanobannaPrompt; timestamp: number }>();
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour TTL
const MAX_CACHE_SIZE = 50;

export function getCacheKey(
  brandContext: any,
  userPrompt: string,
  referenceContext: any,
  imageInputs: any,
  creativeMode: boolean,
  referenceInfluence: string,
  aspectRatio: string,
  customHeadline?: string,
  ctaText?: string,
  visualStyle?: string,
  designType?: string,
  flyerStyle?: string,
): string {
  const inputs = {
    brandId: brandContext?.id,
    userPrompt,
    referenceContextHash: JSON.stringify(referenceContext).slice(0, 100),
    imageInputsHash: JSON.stringify(imageInputs).slice(0, 100),
    creativeMode,
    referenceInfluence,
    aspectRatio,
    customHeadline,
    ctaText,
    visualStyle,
    designType,
    flyerStyle,
  };
  return JSON.stringify(inputs);
}

export function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of promptCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      promptCache.delete(key);
    }
  }
  
  if (promptCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(promptCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, promptCache.size - MAX_CACHE_SIZE);
    for (const [key] of toRemove) {
      promptCache.delete(key);
    }
  }
}
