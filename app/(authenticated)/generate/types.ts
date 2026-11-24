import type React from "react";
import type { FormValidationErrors } from "@/components/generate/schema";

// ── Core domain types ──────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  created_at?: string;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  credits: number;
}

export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:2" | "4:5" | "3:4";

export type DesignType = "graphic_design" | "flyer" | "banner" | "social_post" | "poster";

export interface AdvancedSettings {
  customHeadline: string;
  ctaText: string;
  textPosition: "top" | "center" | "bottom";
  creativeMode: boolean;
  styleIntensity: "normal" | "high";
  referenceInfluence: "normal" | "high";
  visualStyle?: "auto" | "editorial" | "3d_studio" | "glassmorphism" | "paper_cutout" | "retro_futuristic" | "brutalist";
  designType?: DesignType;
  flyerStyle?: "auto" | "commercial_promo" | "travel_tour" | "event_party" | "retail_sale";
}

export interface GenerateResult {
  id?: string;
  result_url: string;
  prompt?: string;
  aspect_ratio?: string;
  status?: string;
  user_id?: string;
  brand_id?: string;
  created_at?: string;
  params?: Record<string, unknown>;
}

export interface GenerationLite {
  id: string;
  created_at: string;
  result_url: string;
  prompt: string;
  brand_id: string | null;
  params?: Record<string, unknown> | null;
}

export interface ChatTurn {
  id: string;
  createdAt: number;
  userPrompt: string;
  brandId: string;
  aspectRatio: string;
  designType: DesignType;
  quality: "normal" | "hd" | "2k" | "4k";
  speed: "slow" | "normal";
  customHeadline?: string;
  ctaText?: string;
  carouselMode: boolean;
  slideCount: number;
  editSourceUrl?: string;
  subjectPreviews: string[];
  referencePreviews: string[];
  jobIds: string[];
  status: "generating" | "completed" | "failed";
  results: GenerateResult[];
  error?: string;
}

// ── Component prop types ───────────────────────────────────

export interface GenerateFormProps {
  user: User;
  brands: Brand[];
  initialSessionId?: string | null;
}

export interface GenerateSidebarProps {
  user: User;
  brands: Brand[];
  state: {
    selectedBrandId: string;
    prompt: string;
    aspectRatio: string;
    generationError?: string | null;
    isPending: boolean;
    isPolling?: boolean;
    activeJobsCount?: number;
    activeJobs?: string[];
    showAdvanced: boolean;
    referenceImages: File[];
    referenceImagePreviews: string[];
    characterImages: File[];
    characterImagePreviews: string[];
    advancedSettings: AdvancedSettings;
    isOffline: boolean;
    formErrors: FormValidationErrors;
    speed: "slow" | "normal";
    quality: "normal" | "hd" | "2k" | "4k";
    modelTier: "normal" | "pro";
    carouselMode: boolean;
    slideCount: number;
  };
  refs: {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  };
  setters: {
    setSelectedBrandId: (id: string) => void;
    setPrompt: (p: string) => void;
    setAspectRatio: (r: string) => void;
    setShowAdvanced: (v: boolean) => void;
    setGenerationError?: (v: string | null) => void;
    setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettings>>;
    setSpeed: (s: "slow" | "normal") => void;
    setQuality: (q: "normal" | "hd" | "2k" | "4k") => void;
    setModelTier: (m: "normal" | "pro") => void;
    setCarouselMode: (v: boolean) => void;
    setSlideCount: (n: number) => void;
  };
  handlers: {
    handleGenerate: () => void;
    handleReferenceImageUpload: (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleCharacterImageUpload: (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    removeCharacterImage: (index: number) => void;
    removeReferenceImage: (index: number) => void;
    clearFieldError: (field: keyof FormValidationErrors) => void;
  };
}
