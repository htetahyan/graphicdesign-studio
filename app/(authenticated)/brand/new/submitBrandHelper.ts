"use client";

import { createBrand } from "@/app/actions/brand";
import { optimizeImageForCapacitor, batchOptimizeImages } from "@/lib/image-utils";
import type { BrandFormValues } from "./types";

export const normalizeServerError = (message: string) => {
  const msg = String(message || "");
  const lower = msg.toLowerCase();

  const isBusy =
    lower.includes("503") ||
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("too many") ||
    lower.includes("overload") ||
    lower.includes("overloaded") ||
    lower.includes("busy") ||
    lower.includes("temporarily") ||
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("service unavailable");

  if (isBusy) {
    return "Server မအားလပ်သေးပါ။ ခဏစောင့်ပြီး ပြန်စမ်းကြည့်ပါ။";
  }

  return msg || "Failed to create brand";
};

interface SubmitBrandProps {
  data: BrandFormValues;
  designSource: "my_brand" | "inspiration";
  selectedIndustry: string | null;
  showToast: (msg: string, type: "success" | "error" | "info" | "warning") => void;
  router: { push: (path: string) => void };
  setCreatedBrandId: (id: string | null) => void;
  setIsSuccess: (s: boolean) => void;
  setServerError: (err: string | null) => void;
  redirectTo?: "generate" | "gallery";
}

export async function submitBrand({
  data,
  designSource,
  selectedIndustry,
  showToast,
  router,
  setCreatedBrandId,
  setIsSuccess,
  setServerError,
  redirectTo = "generate",
}: SubmitBrandProps) {
  try {
    if (!data.logo || data.logo.size === 0)
      throw new Error("Logo ကို မဖြစ်မနေ တင်ပါ (Logo required)");

    const formData = new FormData();
    formData.append("name", data.name);

    if (data.logo) {
      const { file: compressedLogo } = await optimizeImageForCapacitor(
        data.logo,
        {
          maxSizeMB: 0.4,
          enableProgressive: true,
        },
      );
      formData.append("logo", compressedLogo);
    }

    if (data.images.length > 0) {
      const { optimizedFiles } = await batchOptimizeImages(data.images, {
        maxSizeMB: 0.7,
        concurrent: 2,
      });

      for (const compressedImg of optimizedFiles) {
        formData.append("images", compressedImg);
      }
    }

    if (data.referenceImages && data.referenceImages.length > 0) {
      const { optimizedFiles } = await batchOptimizeImages(
        data.referenceImages,
        {
          maxSizeMB: 0.7,
          concurrent: 2,
        },
      );

      for (const compressedRefImg of optimizedFiles) {
        formData.append("referenceImages", compressedRefImg);
      }
    }

    formData.append("designSource", designSource);
    if (data.description) formData.append("description", data.description);
    if (data.preferredCtas)
      formData.append("preferredCtas", data.preferredCtas);
    if (data.brandVoice) formData.append("brandVoice", data.brandVoice);
    if (selectedIndustry) formData.append("industry", selectedIndustry);
    if (data.inspirationTemplateIds && data.inspirationTemplateIds.length > 0) {
      formData.append(
        "inspirationTemplateIds",
        JSON.stringify(data.inspirationTemplateIds),
      );
    }

    const result = await createBrand(formData);
    if (result.success) {
      const newBrandId = result.brand?.id;
      setCreatedBrandId(newBrandId || null);
      showToast("Brand created", "success");
      if (redirectTo === "gallery") {
        setIsSuccess(true);
        router.push("/gallery");
        return;
      }
      setIsSuccess(true);
      router.push(newBrandId ? `/generate?brand=${newBrandId}` : "/generate");
      return;
    }

    const raw = (result as any)?.error || "Failed to create brand";
    const message = normalizeServerError(raw);
    setServerError(message);
    showToast(message, "error");
  } catch (e: any) {
    const raw = e?.message || "Failed to create brand";
    const message = normalizeServerError(raw);
    setServerError(message);
    showToast(message, "error");
  }
}
