/**
 * Canonical Gemini model IDs.
 *
 * Image (Vertex / Gemini API, never Replicate):
 * - Primary: gemini-3-pro-image
 * - Fallback only: gemini-3.1-flash-image
 * Never call flash-lite (text or image).
 */

export const TEXT_PRIMARY_MODEL = "gemini-3.1-pro";
export const TEXT_FALLBACK_MODEL = "gemini-3.8-flash";

export const NANO_BANANA_2_1 = "gemini-nano-banana-2.1";
export const NANO_BANANA_2 = "gemini-3.1-flash-image";
export const NANO_BANANA_PRO = "gemini-3-pro-image";

/** Image generation uses gemini-nano-banana-2.1 as primary. */
export const IMAGE_PRIMARY_MODEL = NANO_BANANA_2_1;
export const IMAGE_FALLBACK_MODEL = NANO_BANANA_PRO;

export const BANNED_MODEL_SUBSTRINGS = [
  "flash-lite",
  "flash_lite",
  "lite-image",
  "lite_image",
] as const;

export function assertNotLiteModel(model: string) {
  const lower = model.toLowerCase();
  if (BANNED_MODEL_SUBSTRINGS.some((s) => lower.includes(s))) {
    throw new Error(`Refusing lite model "${model}".`);
  }
}

export function resolveImageModel() {
  assertNotLiteModel(IMAGE_PRIMARY_MODEL);
  return IMAGE_PRIMARY_MODEL;
}

export function resolveImageSize(quality: "normal" | "hd" | "2k" | "4k" = "hd"): "1K" | "2K" | "4K" {
  if (quality === "4k") return "4K";
  if (quality === "2k") return "2K";
  return "1K";
}
