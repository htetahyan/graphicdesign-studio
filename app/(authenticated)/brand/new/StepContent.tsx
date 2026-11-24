"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { INDUSTRIES } from "./constants";
import type { InspirationTemplate } from "./templates";
import { cn } from "@/lib/utils";

// Import Step Components
import { Step1Basics } from "./Step1Basics";
import { Step2Visuals } from "./Step2Visuals";
import { Step3Inspiration } from "./Step3Inspiration";
import { Step4Review } from "./Step4Review";
import { BrandFormValues, StepContentProps } from "./types";

// ─── Component ────────────────────────────────────────────────────────────────

export function StepContent(props: StepContentProps) {
  const {
    currentStep,
    serverError,
    selectedIndustry,
    setSelectedIndustry,
    isDraggingImages,
    isDraggingLogo,
    isDraggingRefImages,
    register,
    watch,
    setValue,
    errors,
    handleLogoChange,
    handleLogoDragOver,
    handleLogoDragEnter,
    handleLogoDragLeave,
    handleLogoDrop,
    handleImagesChange,
    handleImagesDragOver,
    handleImagesDragEnter,
    handleImagesDragLeave,
    handleImagesDrop,
    removeImage,
    handleRefImagesChange,
    handleRefImagesDragOver,
    handleRefImagesDragEnter,
    handleRefImagesDragLeave,
    handleRefImagesDrop,
    removeRefImage,
    inspirationTemplates,
    isLoadingTemplates,
    watchedLogo: propLogo,
    watchedImages: propImages,
    watchedReferenceImages: propRefImages,
    watchedName: propName,
    watchedInspirationTemplateIds: propInspirationIds,
  } = props;

  const watchedImages = propImages ?? watch("images") ?? [];
  const watchedReferenceImages = propRefImages ?? watch("referenceImages") ?? [];
  const watchedLogo = propLogo ?? watch("logo") ?? null;
  const watchedName = propName ?? watch("name") ?? "";
  const watchedInspirationIds = propInspirationIds ?? watch("inspirationTemplateIds") ?? [];

  const hasUserImages = watchedImages.length > 0;
  const MIN_INSPIRATION = hasUserImages ? 0 : 2;
  const MAX_INSPIRATION = 5;
  const inspirationCount = watchedInspirationIds.length;

  // Sort templates: selected industry first, then other industries
  const sortedTemplates = React.useMemo(() => {
    if (!selectedIndustry) return inspirationTemplates;
    
    const selectedIndustryTemplates = inspirationTemplates.filter(
      (t: InspirationTemplate) => t.industryId === selectedIndustry,
    );
    const otherTemplates = inspirationTemplates.filter(
      (t: InspirationTemplate) => t.industryId !== selectedIndustry,
    );
    
    return [...selectedIndustryTemplates, ...otherTemplates];
  }, [selectedIndustry, inspirationTemplates]);

  const toggleInspiration = (id: string) => {
    const isSelected = watchedInspirationIds.includes(id);
    if (isSelected) {
      setValue(
        "inspirationTemplateIds",
        watchedInspirationIds.filter((x) => x !== id),
      );
    } else {
      if (inspirationCount >= MAX_INSPIRATION) return;
      setValue("inspirationTemplateIds", [...watchedInspirationIds, id]);
    }
  };

  return (
    <main className="flex-1 pb-32 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
        {/* Server-side error banner */}
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2 mb-5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-bold">{serverError}</div>
          </div>
        )}

        {/* STEP 1: Name & Industry */}
        {currentStep === 1 && (
          <Step1Basics
            register={register}
            errors={errors}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            setValue={setValue}
          />
        )}

        {/* STEP 2: Logo & Visuals */}
        {currentStep === 2 && (
          <Step2Visuals
            watchedLogo={watchedLogo}
            watchedImages={watchedImages}
            errors={errors}
            isDraggingLogo={isDraggingLogo}
            isDraggingImages={isDraggingImages}
            handleLogoChange={handleLogoChange}
            handleLogoDragOver={handleLogoDragOver}
            handleLogoDragEnter={handleLogoDragEnter}
            handleLogoDragLeave={handleLogoDragLeave}
            handleLogoDrop={handleLogoDrop}
            handleImagesChange={handleImagesChange}
            handleImagesDragOver={handleImagesDragOver}
            handleImagesDragEnter={handleImagesDragEnter}
            handleImagesDragLeave={handleImagesDragLeave}
            handleImagesDrop={handleImagesDrop}
            removeImage={removeImage}
            setValue={setValue}
          />
        )}

        {/* STEP 3: Inspiration */}
        {currentStep === 3 && (
          <Step3Inspiration
            key={selectedIndustry || "none"}
            watchedInspirationIds={watchedInspirationIds}
            watchedReferenceImages={watchedReferenceImages}
            errors={errors}
            selectedIndustry={selectedIndustry}
            industryTemplates={sortedTemplates}
            isLoadingTemplates={isLoadingTemplates}
            isDraggingRefImages={isDraggingRefImages}
            handleRefImagesChange={handleRefImagesChange}
            handleRefImagesDragOver={handleRefImagesDragOver}
            handleRefImagesDragEnter={handleRefImagesDragEnter}
            handleRefImagesDragLeave={handleRefImagesDragLeave}
            handleRefImagesDrop={handleRefImagesDrop}
            removeRefImage={removeRefImage}
            setValue={setValue}
            toggleInspiration={toggleInspiration}
          />
        )}

        {/* STEP 4: Review */}
        {currentStep === 4 && (
          <Step4Review
            watchedLogo={watchedLogo}
            watchedName={watchedName}
            selectedIndustry={selectedIndustry}
            watchedImages={watchedImages}
            watchedReferenceImages={watchedReferenceImages}
            watchedInspirationIds={watchedInspirationIds}
          />
        )}
      </div>
    </main>
  );
}
