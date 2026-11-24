"use client";

import { useCallback } from "react";
import { optimizeImageForCapacitor } from "@/lib/image-utils";
import { generateAction, generateActionWithRefs, generateCarouselAction } from "@/app/actions/generate";
import { validateGenerateForm } from "@/components/generate/schema";
import { normalizeErrorForUI } from "@/lib/error-utils";
import type { AdvancedSettings, User, ChatTurn, GenerateResult } from "../types";
import type { FormValidationErrors } from "@/components/generate/schema";

interface UseGenerateSubmitProps {
  selectedBrandId: string;
  prompt: string;
  setPrompt?: (val: string) => void;
  advancedSettings: AdvancedSettings;
  aspectRatio: string;
  referenceImages: File[];
  referenceImagePreviews?: string[];
  characterImages: File[];
  characterImagePreviews?: string[];
  isOffline: boolean;
  user: User;
  showAdvanced: boolean;
  setShowAdvanced: (val: boolean) => void;
  setFormErrors: (errors: FormValidationErrors) => void;
  setGenerationError: (err: string | null) => void;
  setActiveJobs: React.Dispatch<React.SetStateAction<string[]>>;
  setChatTurns?: React.Dispatch<React.SetStateAction<ChatTurn[]>>;
  editTarget?: GenerateResult | null;
  setEditTarget?: (target: GenerateResult | null) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
  startTransition: (fn: () => Promise<void>) => void;
  speed: "slow" | "normal";
  quality: "normal" | "hd" | "2k" | "4k";
  modelTier: "normal" | "pro";
  totalCost: number;
  carouselMode: boolean;
  slideCount: number;
  clearResult: () => void;
  designSessionId?: string | null;
}

export function useGenerateSubmit({
  selectedBrandId,
  prompt,
  setPrompt,
  advancedSettings,
  aspectRatio,
  referenceImages,
  referenceImagePreviews = [],
  characterImages,
  characterImagePreviews = [],
  isOffline,
  user,
  showAdvanced,
  setShowAdvanced,
  setFormErrors,
  setGenerationError,
  setActiveJobs,
  setChatTurns,
  editTarget,
  setEditTarget,
  showToast,
  startTransition,
  speed,
  quality,
  modelTier,
  totalCost,
  carouselMode,
  slideCount,
  clearResult,
  designSessionId,
}: UseGenerateSubmitProps) {
  const handleGenerate = useCallback(async () => {
    // 1. Validation
    const { valid, errors: validationErrors } = validateGenerateForm({
      brandId: selectedBrandId,
      prompt,
      advancedSettings: {
        customHeadline: advancedSettings.customHeadline,
        ctaText: advancedSettings.ctaText,
      },
      referenceImages,
      characterImages,
    });

    if (!valid) {
      setFormErrors(validationErrors);
      if ((validationErrors.headline || validationErrors.cta) && !showAdvanced) {
        setShowAdvanced(true);
      }
      const firstError = Object.values(validationErrors).find(Boolean);
      if (firstError) showToast(firstError, "error");
      return;
    }

    setFormErrors({});

    if (isOffline) {
      showToast("အင်တာနက် ချိတ်ဆက်မှုမရှိပါ။", "error");
      return;
    }

    if ((user?.credits ?? 0) < totalCost) {
      showToast(`Credits မလုံလောက်ပါ။ ${totalCost} credits အနည်းဆုံး လိုအပ်ပါသည်။`, "error");
      return;
    }

    const turnId = `turn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const submittedPrompt = prompt.trim();
    const editSourceUrl = editTarget?.result_url || undefined;
    const effectiveCarouselMode = carouselMode && !editSourceUrl;

    if (setChatTurns) {
      const optimisticTurn: ChatTurn = {
        id: turnId,
        createdAt: Date.now(),
        userPrompt: submittedPrompt,
        brandId: selectedBrandId,
        aspectRatio,
        designType: advancedSettings.designType || "graphic_design",
        quality,
        speed,
        customHeadline: advancedSettings.customHeadline.trim() || undefined,
        ctaText: advancedSettings.ctaText.trim() || undefined,
        carouselMode: effectiveCarouselMode,
        slideCount: effectiveCarouselMode ? slideCount : 1,
        editSourceUrl,
        subjectPreviews: [...characterImagePreviews],
        referencePreviews: [...referenceImagePreviews],
        jobIds: [],
        status: "generating",
        results: [],
      };
      setChatTurns((prev) => [...prev, optimisticTurn]);
    }

    if (setPrompt) {
      setPrompt("");
    }
    if (setEditTarget) {
      setEditTarget(null);
    }

    // 2. Execution
    clearResult();
    startTransition(async () => {
      try {
        setGenerationError(null);
        let enhancedPrompt = submittedPrompt;
        enhancedPrompt += `\n\nStyle: ${advancedSettings.styleIntensity}, Text Position: ${advancedSettings.textPosition}`;

        const res = effectiveCarouselMode
          ? await (async () => {
              const formData = new FormData();
              formData.set("brandId", selectedBrandId);
              formData.set("userPrompt", enhancedPrompt);
              formData.set("slideCount", String(slideCount));
              formData.set("aspectRatio", aspectRatio);
              formData.set("creativeMode", String(advancedSettings.creativeMode));
              formData.set("speed", speed);
              formData.set("quality", quality);
              formData.set("modelTier", modelTier);
              formData.set("designType", advancedSettings.designType || "graphic_design");
              if (advancedSettings.flyerStyle) {
                formData.set("flyerStyle", advancedSettings.flyerStyle);
              }
              if (advancedSettings.visualStyle) {
                formData.set("visualStyle", advancedSettings.visualStyle);
              }
              if (designSessionId) formData.set("sessionId", designSessionId);

              for (const file of referenceImages) {
                const { file: compressed } = await optimizeImageForCapacitor(file, {
                  maxSizeMB: 0.6,
                  enableProgressive: true,
                });
                formData.append("referenceImages", compressed);
              }
              for (const file of characterImages) {
                const { file: compressedChar } = await optimizeImageForCapacitor(file, {
                  maxSizeMB: 0.6,
                  enableProgressive: true,
                });
                formData.append("characterImages", compressedChar);
              }

              return generateCarouselAction(formData);
            })()
          : (referenceImages.length > 0 || characterImages.length > 0
              ? await (async () => {
                  const formData = new FormData();
                  formData.set("brandId", selectedBrandId);
                  formData.set("userPrompt", enhancedPrompt);
                  formData.set("aspectRatio", aspectRatio);
                  formData.set("creativeMode", String(advancedSettings.creativeMode));
                  formData.set("referenceInfluence", advancedSettings.referenceInfluence);
                  formData.set("customHeadline", advancedSettings.customHeadline.trim());
                  formData.set("ctaText", advancedSettings.ctaText.trim());
                  formData.set("speed", speed);
                  formData.set("quality", quality);
                  formData.set("modelTier", modelTier);
                  formData.set("designType", advancedSettings.designType || "graphic_design");
                  if (advancedSettings.flyerStyle) {
                    formData.set("flyerStyle", advancedSettings.flyerStyle);
                  }
                  if (advancedSettings.visualStyle) {
                    formData.set("visualStyle", advancedSettings.visualStyle);
                  }
                  if (editSourceUrl) {
                    formData.set("editSourceUrl", editSourceUrl);
                  }
                  if (designSessionId) formData.set("sessionId", designSessionId);

                  for (const file of referenceImages) {
                    const { file: compressed } = await optimizeImageForCapacitor(file, {
                      maxSizeMB: 0.6,
                      enableProgressive: true,
                    });
                    formData.append("referenceImages", compressed);
                  }
                  for (const file of characterImages) {
                    const { file: compressedChar } = await optimizeImageForCapacitor(file, {
                      maxSizeMB: 0.6,
                      enableProgressive: true,
                    });
                    formData.append("characterImages", compressedChar);
                  }

                  return generateActionWithRefs(
                    formData,
                    advancedSettings.customHeadline,
                    advancedSettings.ctaText,
                  );
                })()
              : await generateAction(
                  selectedBrandId,
                  enhancedPrompt,
                  aspectRatio,
                  advancedSettings.creativeMode,
                  advancedSettings.customHeadline.trim(),
                  advancedSettings.ctaText.trim(),
                  speed,
                  quality,
                  advancedSettings.visualStyle,
                  advancedSettings.designType || "graphic_design",
                  advancedSettings.flyerStyle,
                  modelTier,
                  editSourceUrl,
                  designSessionId || undefined,
                ));

        if (res.status === "queued") {
          const resAny = res as any;
          const newJobIds = resAny.jobIds && Array.isArray(resAny.jobIds)
            ? (resAny.jobIds as string[])
            : resAny.jobId
              ? [resAny.jobId as string]
              : [];

          if (setChatTurns) {
            setChatTurns((prev) =>
              prev.map((turn) =>
                turn.id === turnId ? { ...turn, jobIds: newJobIds } : turn
              )
            );
          }

          setActiveJobs((prev) => {
            const next = [...prev];
            newJobIds.forEach((id) => {
              if (id && !next.includes(id)) next.push(id);
            });
            return next;
          });
          setShowAdvanced(false);
          return;
        }
      } catch (e: unknown) {
        console.error("Generation error:", e);
        const rawMessage = e instanceof Error ? e.message : "ပုံဖန်တီးခြင်း မအောင်မြင်ပါ";
        const errorMessage = normalizeErrorForUI(rawMessage);
        setGenerationError(errorMessage);
        if (setChatTurns) {
          setChatTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? { ...turn, status: "failed", error: errorMessage }
                : turn
            )
          );
        }
        showToast(errorMessage, "error");
      }
    });
  }, [
    selectedBrandId,
    prompt,
    setPrompt,
    aspectRatio,
    showToast,
    advancedSettings,
    referenceImages,
    referenceImagePreviews,
    characterImages,
    characterImagePreviews,
    user?.credits,
    isOffline,
    showAdvanced,
    setFormErrors,
    setShowAdvanced,
    setGenerationError,
    setActiveJobs,
    setChatTurns,
    editTarget,
    setEditTarget,
    startTransition,
    speed,
    quality,
    modelTier,
    totalCost,
    carouselMode,
    slideCount,
    clearResult,
    designSessionId,
  ]);

  return { handleGenerate };
}
