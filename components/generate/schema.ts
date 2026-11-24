import { z } from "zod";

// Constants for validation
export const VALIDATION_LIMITS = {
  PROMPT_MIN_LENGTH: 3,
  PROMPT_MAX_LENGTH: 5000,
  HEADLINE_MAX_LENGTH: 100,
  CTA_MAX_LENGTH: 50,
  MAX_REFERENCE_IMAGES: 1,
  MAX_CHARACTER_IMAGES: 4,
  MAX_IMAGE_SIZE_MB: 10,
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  MIN_CREDITS_REQUIRED: 10,
} as const;

export const aspectRatioSchema = z.enum(["1:1", "9:16", "16:9", "4:3", "3:2", "4:5", "3:4"]);

export const advancedSettingsSchema = z.object({
  customHeadline: z
    .string()
    .max(VALIDATION_LIMITS.HEADLINE_MAX_LENGTH, `Headline must be ${VALIDATION_LIMITS.HEADLINE_MAX_LENGTH} characters or less`)
    .optional()
    .default(""),
  ctaText: z
    .string()
    .max(VALIDATION_LIMITS.CTA_MAX_LENGTH, `CTA must be ${VALIDATION_LIMITS.CTA_MAX_LENGTH} characters or less`)
    .optional()
    .default(""),
  styleIntensity: z.enum(["normal", "high"]).default("normal"),
  textPosition: z.enum(["top", "center", "bottom"]).default("center"),
});

// File validation helper
const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES,
    { message: `File is too large. Max size is ${VALIDATION_LIMITS.MAX_IMAGE_SIZE_MB}MB` }
  )
  .refine(
    (file) => (VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
    { message: `Unsupported format. Use JPEG, PNG, WebP, or GIF` }
  );

export const generateFormSchema = z
  .object({
    brandId: z.string().min(1, "Brand ရွေးချယ်ပါ"),
    prompt: z
      .string()
      .max(VALIDATION_LIMITS.PROMPT_MAX_LENGTH, `Prompt ၏ အများဆုံး အက္ခရာ ${VALIDATION_LIMITS.PROMPT_MAX_LENGTH} ခုသာ ရိုက်ထည့်နိုင်ပါသည်`)
      .default(""),
    aspectRatio: aspectRatioSchema.default("1:1"),
    referenceImages: z
      .array(imageFileSchema)
      .max(VALIDATION_LIMITS.MAX_REFERENCE_IMAGES, `Reference ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_REFERENCE_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`)
      .default([]),
    characterImages: z
      .array(imageFileSchema)
      .max(VALIDATION_LIMITS.MAX_CHARACTER_IMAGES, `Subject ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_CHARACTER_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`)
      .default([]),
    advancedSettings: advancedSettingsSchema,
  })
  .refine(
    (data) => {
      const hasPrompt = data.prompt.trim().length >= VALIDATION_LIMITS.PROMPT_MIN_LENGTH;
      const hasHeadline = (data.advancedSettings.customHeadline ?? "").trim().length >= VALIDATION_LIMITS.PROMPT_MIN_LENGTH;
      return hasPrompt || hasHeadline;
    },
    {
      message: "Vision text သို့မဟုတ် Headline တစ်ခုခုကို အနည်းဆုံး ၃ လုံး ရိုက်ထည့်ပါ",
      path: ["prompt"],
    }
  );

export type GenerateFormSchema = z.infer<typeof generateFormSchema>;

// Validation error shape for UI consumption
export interface FormValidationErrors {
  brandId?: string;
  prompt?: string;
  headline?: string;
  cta?: string;
  referenceImages?: string;
  characterImages?: string;
  general?: string;
}

// Validate form data and return structured errors
export function validateGenerateForm(data: {
  brandId: string;
  prompt: string;
  advancedSettings: { customHeadline: string; ctaText: string };
  referenceImages: File[];
  characterImages: File[];
}): { valid: boolean; errors: FormValidationErrors } {
  const errors: FormValidationErrors = {};
  let valid = true;

  // Brand validation
  if (!data.brandId || data.brandId.trim().length === 0) {
    errors.brandId = "Brand ရွေးချယ်ပါ";
    valid = false;
  }

  // Content validation: must have either prompt or headline
  const hasPrompt = data.prompt.trim().length >= VALIDATION_LIMITS.PROMPT_MIN_LENGTH;
  const hasHeadline = data.advancedSettings.customHeadline.trim().length >= VALIDATION_LIMITS.PROMPT_MIN_LENGTH;

  if (!hasPrompt && !hasHeadline) {
    errors.prompt = "Vision text သို့မဟုတ် Headline တစ်ခုခုကို အနည်းဆုံး ၃ လုံး ရိုက်ထည့်ပါ";
    errors.headline = "Vision text သို့မဟုတ် Headline တစ်ခုခုကို အနည်းဆုံး ၃ လုံး ရိုက်ထည့်ပါ";
    valid = false;
  }

  // Prompt max length
  if (data.prompt.length > VALIDATION_LIMITS.PROMPT_MAX_LENGTH) {
    errors.prompt = `Prompt ၏ အများဆုံး အက္ခရာ ${VALIDATION_LIMITS.PROMPT_MAX_LENGTH} ခုသာ ရိုက်ထည့်နိုင်ပါသည် (${data.prompt.length}/${VALIDATION_LIMITS.PROMPT_MAX_LENGTH})`;
    valid = false;
  }

  // Headline max length
  if (data.advancedSettings.customHeadline.length > VALIDATION_LIMITS.HEADLINE_MAX_LENGTH) {
    errors.headline = `Headline ၏ အများဆုံး အက္ခရာ ${VALIDATION_LIMITS.HEADLINE_MAX_LENGTH} ခုသာ ထည့်နိုင်ပါသည်`;
    valid = false;
  }

  // CTA max length
  if (data.advancedSettings.ctaText.length > VALIDATION_LIMITS.CTA_MAX_LENGTH) {
    errors.cta = `CTA ၏ အများဆုံး အက္ခရာ ${VALIDATION_LIMITS.CTA_MAX_LENGTH} ခုသာ ထည့်နိုင်ပါသည်`;
    valid = false;
  }

  // Image file validations
  for (const file of data.referenceImages) {
    if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
      errors.referenceImages = `"${file.name}" ဖိုင်အရွယ်အစား ကြီးလွန်းပါသည် (Max ${VALIDATION_LIMITS.MAX_IMAGE_SIZE_MB}MB)`;
      valid = false;
      break;
    }
    if (!(VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      errors.referenceImages = `"${file.name}" ဖိုင်အမျိုးအစား မမှန်ပါ။ JPEG, PNG, WebP, GIF သုံးပါ`;
      valid = false;
      break;
    }
  }

  if (data.referenceImages.length > VALIDATION_LIMITS.MAX_REFERENCE_IMAGES) {
    errors.referenceImages = `Reference ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_REFERENCE_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`;
    valid = false;
  }

  for (const file of data.characterImages) {
    if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
      errors.characterImages = `"${file.name}" ဖိုင်အရွယ်အစား ကြီးလွန်းပါသည် (Max ${VALIDATION_LIMITS.MAX_IMAGE_SIZE_MB}MB)`;
      valid = false;
      break;
    }
    if (!(VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      errors.characterImages = `"${file.name}" ဖိုင်အမျိုးအစား မမှန်ပါ။ JPEG, PNG, WebP, GIF သုံးပါ`;
      valid = false;
      break;
    }
  }

  if (data.characterImages.length > VALIDATION_LIMITS.MAX_CHARACTER_IMAGES) {
    errors.characterImages = `Subject ပုံ အများဆုံး ${VALIDATION_LIMITS.MAX_CHARACTER_IMAGES} ပုံသာ ထည့်နိုင်ပါသည်`;
    valid = false;
  }

  return { valid, errors };
}
