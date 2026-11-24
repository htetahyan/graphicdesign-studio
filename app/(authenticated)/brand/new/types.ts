import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { InspirationTemplate } from "./templates";
import * as z from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name သည် အနည်းဆုံး 2 အက္ခရာ ရှိရပါမယ်"),
  logo: z.any().refine((file) => file && file.size > 0, {
    message: "Logo ကို မဖြစ်မနေ တင်ပါ (Logo required)",
  }),
  images: z
    .array(z.any())
    .min(0, "Images များကိုယူပါ")
    .max(5, "အများဆုံး 5 ပုံသာ ခွင့်ပြုပါသည်"),
  referenceImages: z
    .array(z.any())
    .optional()
    .refine((files) => !files || files.length <= 5, {
      message: "အများဆုံး 5 ပုံသာ ခွင့်ပြုပါသည်",
    }),
  designSource: z.enum(["my_brand", "inspiration"]).optional(),
  description: z.string().optional(),
  preferredCtas: z.string().optional(),
  brandVoice: z.string().optional(),
  industry: z.string().optional(),
  inspirationTemplateIds: z.array(z.string()).optional(),
});

export interface BrandFormValues {
  name: string;
  logo: File | null;
  images: File[];
  referenceImages?: File[];
  designSource?: "my_brand" | "inspiration";
  description?: string;
  preferredCtas?: string;
  brandVoice?: string;
  industry?: string;
  inspirationTemplateIds?: string[];
}

export interface StepContentProps {
  currentStep: number;
  serverError: string | null;
  selectedIndustry: string | null;
  setSelectedIndustry: (id: string | null) => void;
  isDraggingImages: boolean;
  isDraggingLogo: boolean;
  isDraggingRefImages: boolean;
  register: UseFormRegister<BrandFormValues>;
  watch: UseFormWatch<BrandFormValues>;
  setValue: UseFormSetValue<BrandFormValues>;
  errors: FieldErrors<BrandFormValues>;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoDragOver: (e: React.DragEvent) => void;
  handleLogoDragEnter: (e: React.DragEvent) => void;
  handleLogoDragLeave: (e: React.DragEvent) => void;
  handleLogoDrop: (e: React.DragEvent) => void;
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImagesDragOver: (e: React.DragEvent) => void;
  handleImagesDragEnter: (e: React.DragEvent) => void;
  handleImagesDragLeave: (e: React.DragEvent) => void;
  handleImagesDrop: (e: React.DragEvent) => void;
  removeImage: (idx: number) => void;
  handleRefImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefImagesDragOver: (e: React.DragEvent) => void;
  handleRefImagesDragEnter: (e: React.DragEvent) => void;
  handleRefImagesDragLeave: (e: React.DragEvent) => void;
  handleRefImagesDrop: (e: React.DragEvent) => void;
  removeRefImage: (idx: number) => void;
  inspirationTemplates: InspirationTemplate[];
  isLoadingTemplates?: boolean;
  watchedLogo?: File | null;
  watchedImages?: File[];
  watchedReferenceImages?: File[];
  watchedName?: string;
  watchedInspirationTemplateIds?: string[];
}
