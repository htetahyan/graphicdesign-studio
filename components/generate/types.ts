/**
 * Re-export all types from the canonical location.
 * Import from "@/app/(authenticated)/generate/types" directly when possible.
 */
export type {
  User as UserSession,
  Brand as BrandLite,
  GenerationLite,
  AspectRatio,
  AdvancedSettings,
} from "@/app/(authenticated)/generate/types";

export type { GenerateFormSchema as GenerateFormValues } from "@/components/generate/schema";
