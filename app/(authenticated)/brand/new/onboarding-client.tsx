"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import type { InspirationTemplate } from "./templates";
import { Step2Visuals } from "./Step2Visuals";
import { Step3Inspiration } from "./Step3Inspiration";
import { GalacticLoader } from "./GalacticLoader";
import { useOnboardingState } from "./useOnboardingState";

interface BrandOnboardingProps {
  initialTemplates?: InspirationTemplate[];
  brandsCount?: number;
}

export default function BrandOnboardingPage({
  initialTemplates = [],
  brandsCount = 0,
}: BrandOnboardingProps) {
  const [showMore, setShowMore] = useState(false);
  const {
    serverError,
    selectedIndustry,
    setSelectedIndustry,
    isDraggingImages,
    isDraggingLogo,
    isDraggingRefImages,
    inspirationTemplates,
    isLoadingTemplates,
    register,
    onSubmitTo,
    setValue,
    errors,
    watchedImages,
    watchedReferenceImages,
    watchedLogo,
    watchedName,
    watchedInspirationTemplateIds,
    handleImagesChange,
    handleImagesDragOver,
    handleImagesDrop,
    handleImagesDragEnter,
    handleImagesDragLeave,
    removeImage,
    handleRefImagesChange,
    handleRefImagesDragOver,
    handleRefImagesDragEnter,
    handleRefImagesDragLeave,
    handleRefImagesDrop,
    removeRefImage,
    handleLogoChange,
    handleLogoDragOver,
    handleLogoDrop,
    handleLogoDragEnter,
    handleLogoDragLeave,
    isPending,
    progressValue,
  } = useOnboardingState(initialTemplates);

  const atLimit = brandsCount >= 5;
  const canSubmit = Boolean(watchedName?.trim() && watchedLogo) && !isPending && !atLimit;
  const inspirationIds = watchedInspirationTemplateIds || [];
  const toggleInspiration = (id: string) => {
    const selected = inspirationIds.includes(id);
    if (selected) {
      setValue("inspirationTemplateIds", inspirationIds.filter((x) => x !== id));
    } else if (inspirationIds.length < 5) {
      setValue("inspirationTemplateIds", [...inspirationIds, id]);
    }
  };

  if (atLimit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-[11px] font-semibold text-muted-foreground">5 / 5 brands</p>
          <h1 className="text-2xl font-semibold">Brand limit reached</h1>
          <p className="text-sm text-muted-foreground">Delete a brand in Gallery to add another.</p>
          <Link href="/gallery" className="inline-flex h-11 px-5 items-center rounded-full bg-white text-black text-sm font-semibold">
            Go to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 pt-4 pb-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {brandsCount} / 5 brands
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">New brand</h1>
          </div>
          <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </Link>
        </div>
      </header>

      <form className="imaging-rise flex-1 max-w-2xl mx-auto w-full px-4 pb-36 space-y-8">
        {serverError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brand name</label>
          <input
            {...register("name")}
            placeholder="e.g. Golden Bakery"
            className="w-full h-12 rounded-xl border border-border bg-secondary text-foreground px-4 text-sm"
          />
          {errors.name && <p className="text-xs text-red-400">{String(errors.name.message)}</p>}
        </div>

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

        <div className="rounded-2xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold"
          >
            More style options
            <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>
          {showMore && (
            <div className="px-4 pb-6 space-y-8 border-t border-border pt-4">
              <Step3Inspiration
                watchedInspirationIds={inspirationIds}
                watchedReferenceImages={watchedReferenceImages}
                errors={errors}
                selectedIndustry={selectedIndustry}
                industryTemplates={inspirationTemplates}
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
            </div>
          )}
        </div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canSubmit}
            onClick={onSubmitTo("gallery")}
            className="h-12 rounded-xl font-bold"
          >
            Create brand
          </Button>
          <Button
            type="button"
            variant="accent"
            disabled={!canSubmit}
            onClick={onSubmitTo("generate")}
            className="flex-1 h-12 rounded-xl font-bold"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create & generate
              </>
            )}
          </Button>
        </div>
      </div>

      <GalacticLoader isPending={isPending} progressValue={progressValue} />
    </div>
  );
}
