"use client";

import React from "react";
import { Loader2, LayoutGrid } from "lucide-react";
import { AdvancedSettings } from "./advanced-settings";
import { BrandSelector } from "./components/brand-selector";
import { AspectRatioSelector } from "./components/aspect-ratio-selector";
import { PromptTextarea } from "./components/prompt-textarea";
import { GenerateFooter } from "./components/generate-footer";
import { DesignTypeSelector } from "./components/design-type-selector";
import { ModelTierSelector } from "./components/model-tier-selector";
import { TypographyInputs } from "./components/text-inputs-section";
import { computeGenerationCredits } from "@/lib/credits";
import { cn } from "@/lib/utils";
import type { GenerateSidebarProps } from "./types";

export function GenerateSidebar({
  user,
  brands,
  state,
  refs,
  setters,
  handlers,
}: GenerateSidebarProps) {
  const {
    selectedBrandId,
    prompt,
    aspectRatio,
    isPending,
    activeJobsCount,
    showAdvanced,
    referenceImages,
    referenceImagePreviews,
    characterImages,
    characterImagePreviews,
    advancedSettings,
    isOffline,
    formErrors,
    speed,
    quality,
    modelTier,
    carouselMode,
    slideCount,
  } = state;

  const {
    setSelectedBrandId,
    setPrompt,
    setAspectRatio,
    setShowAdvanced,
    setAdvancedSettings,
    setSpeed,
    setQuality,
    setModelTier,
    setCarouselMode,
    setSlideCount,
  } = setters;

  const [localPrompt, setLocalPrompt] = React.useState(prompt);

  React.useEffect(() => {
    if (localPrompt === prompt) return;
    const timer = setTimeout(() => {
      setPrompt(localPrompt);
    }, 150);
    return () => clearTimeout(timer);
  }, [localPrompt, setPrompt, prompt]);

  React.useEffect(() => {
    if (prompt === "") setLocalPrompt("");
  }, [prompt]);

  const {
    handleGenerate,
    handleReferenceImageUpload,
    handleCharacterImageUpload,
    removeCharacterImage,
    removeReferenceImage,
    clearFieldError,
  } = handlers;

  const { totalCost } = computeGenerationCredits({
    speed,
    quality,
    modelTier,
    carouselMode,
    slideCount,
  });

  const hasEnoughCredits = (user?.credits ?? 0) >= totalCost;
  const isInputDisabled = isPending || !hasEnoughCredits;

  return (
    <aside className="w-full lg:w-1/3 lg:min-w-[380px] lg:h-full flex flex-col bg-background lg:border-r border-t lg:border-t-0 border-border order-2 lg:order-1 overflow-hidden shrink-0">
      {/* ── Active Jobs Indicator (Tray) ── */}
      {!!activeJobsCount && activeJobsCount > 0 && (
        <div className="absolute top-2 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full shadow-sm backdrop-blur-md">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs md:text-sm font-bold">
              {activeJobsCount} Background {activeJobsCount === 1 ? "Job" : "Jobs"}
            </span>
          </div>
        </div>
      )}

      {/* ── Scrollable body ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-5 pb-3 space-y-5">
        <BrandSelector
          selectedBrandId={selectedBrandId}
          setSelectedBrandId={setSelectedBrandId}
          brands={brands}
          isPending={isPending}
          formErrors={formErrors}
          clearFieldError={clearFieldError}
        />

        <PromptTextarea
          localPrompt={localPrompt}
          setLocalPrompt={setLocalPrompt}
          isInputDisabled={isInputDisabled}
          formErrors={formErrors}
          clearFieldError={clearFieldError}
          textareaRef={refs.textareaRef}
        />

        <TypographyInputs
          isDisabled={isInputDisabled}
          customHeadline={advancedSettings.customHeadline}
          ctaText={advancedSettings.ctaText}
          setAdvancedSettings={setAdvancedSettings}
          headlineError={formErrors.headline}
          ctaError={formErrors.cta}
          onHeadlineChange={() => clearFieldError("headline")}
          onCtaChange={() => clearFieldError("cta")}
        />

        <ModelTierSelector isInputDisabled={isInputDisabled} />

        <div className="space-y-2">
          <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            Speed
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isInputDisabled}
              onClick={() => setSpeed("slow")}
              className={cn(
                "h-11 rounded-xl border text-xs font-bold transition-all",
                speed === "slow"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/50",
              )}
            >
              Flex · 7c
            </button>
            <button
              type="button"
              disabled={isInputDisabled}
              onClick={() => setSpeed("normal")}
              className={cn(
                "h-11 rounded-xl border text-xs font-bold transition-all",
                speed === "normal"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/50",
              )}
            >
              Fast · 10c
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {([
            ["normal", "1K", "+0"],
            ["hd", "HD", "+2"],
            ["2k", "2K", "+5"],
            ["4k", "4K", "+10"],
          ] as const).map(([value, label, extra]) => (
            <button
              key={value}
              type="button"
              disabled={isInputDisabled}
              onClick={() => setQuality(value)}
              className={cn(
                "h-9 px-3 rounded-full border text-[11px] font-bold",
                quality === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/50",
              )}
            >
              {label} {extra}c
            </button>
          ))}
        </div>

        <AspectRatioSelector
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          isPending={isPending}
          isInputDisabled={isInputDisabled}
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
        />

        <DesignTypeSelector
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
          isPending={isPending}
          isInputDisabled={isInputDisabled}
        />

        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Make a series</h4>
                <p className="text-xs text-muted-foreground">Carousel · {slideCount}×{totalCost / (carouselMode ? slideCount : 1)}c each</p>
              </div>
            </div>
            <button
              type="button"
              disabled={isInputDisabled}
              onClick={() => setCarouselMode(!carouselMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                carouselMode ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                  carouselMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {carouselMode && (
            <div className="space-y-3 pt-3 border-t border-border/50 animate-in fade-in duration-200">
              <label className="text-xs font-semibold text-muted-foreground">Number of slides</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={isInputDisabled}
                    onClick={() => setSlideCount(num)}
                    className={`py-2 rounded-xl border text-xs md:text-sm font-bold transition-all ${
                      slideCount === num
                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                        : "bg-background border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {num} Slides
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                * Generates slide 1, then uses it as visual style reference sequentially for slide 2, 3, etc. for ultimate consistency.
              </p>
            </div>
          )}
        </div>

        {/* ── Advanced Settings ── */}
        <AdvancedSettings
          isOpen={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
          isDisabled={isInputDisabled}
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
          referenceImages={referenceImages}
          referenceImagePreviews={referenceImagePreviews}
          characterImages={characterImages}
          characterImagePreviews={characterImagePreviews}
          referenceInfluence={advancedSettings.referenceInfluence}
          setReferenceInfluence={(value) =>
            setAdvancedSettings((prev) => ({ ...prev, referenceInfluence: value }))
          }
          handleCharacterImageUpload={handleCharacterImageUpload}
          handleReferenceImageUpload={handleReferenceImageUpload}
          removeCharacterImage={removeCharacterImage}
          removeReferenceImage={removeReferenceImage}
          headlineError={formErrors.headline}
          ctaError={formErrors.cta}
          onHeadlineChange={() => clearFieldError("headline")}
          onCtaChange={() => clearFieldError("cta")}
          speed={speed}
          setSpeed={setSpeed}
          quality={quality}
          setQuality={setQuality}
        />
      </div>

      <GenerateFooter
        user={user}
        isOffline={isOffline}
        isPending={isPending}
        handleGenerate={handleGenerate}
        totalCost={totalCost}
        modelTier={modelTier}
        setModelTier={setModelTier}
        isInputDisabled={isInputDisabled}
      />
    </aside>
  );
}