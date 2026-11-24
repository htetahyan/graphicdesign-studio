"use client";

import React, { type RefObject, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUI } from "@/components/context/ui-context";
import { PreviewLightbox } from "./components/preview-lightbox";
import { DesignCanvasEmptyState } from "./components/design-canvas-empty-state";
import { JobStack } from "./components/job-stack";
import { ActivePreviewImage } from "./components/active-preview-image";
import { PreviewActionsWithTray } from "./components/preview-actions-with-tray";
import type { Brand, GenerateResult } from "./types";

export interface GeneratePreviewProps {
  brands: Brand[];
  state: {
    result: GenerateResult | null;
    recentGenerations?: GenerateResult[];
    imageLoaded: boolean;
    isPending: boolean;
    activeJobsCount?: number;
    activeJobs?: string[];
    progressValue: number;
    isDownloading: boolean;
    selectedBrandId: string;
    aspectRatio: string;
    speed: "slow" | "normal";
    quality: "normal" | "hd" | "2k" | "4k";
    modelTier: "normal" | "pro";
  };
  refs: {
    resultRef: RefObject<HTMLDivElement | null>;
  };
  setters: {
    setImageLoaded: (loaded: boolean) => void;
    setResult?: (result: GenerateResult) => void;
  };
  handlers: {
    handleDownload: (res?: GenerateResult) => Promise<void>;
    handleAnimateAd?: (duration: 4 | 6) => void;
  };
}

export function GeneratePreview({
  brands,
  state,
  refs,
  setters,
  handlers,
}: GeneratePreviewProps) {
  const {
    result,
    recentGenerations = [],
    imageLoaded,
    isPending,
    activeJobsCount = 0,
    activeJobs = [],
    progressValue,
    isDownloading,
    selectedBrandId,
    aspectRatio,
    speed,
    quality,
    modelTier,
    isAnimating,
  } = state as typeof state & { isAnimating?: boolean };

  const { resultRef } = refs;
  const { setImageLoaded, setResult } = setters;
  const { handleDownload, handleAnimateAd } = handlers;
  const { showToast } = useUI();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxResult, setActiveLightboxResult] = useState<GenerateResult | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [isGridDownloading, setIsGridDownloading] = useState(false);
  const lastOpenedId = React.useRef<string | null>(null);

  const nextSrc = result?.result_url || null;
  const effectiveSrc = displaySrc || nextSrc;
  const isSwapping = !!nextSrc && !!displaySrc && displaySrc !== nextSrc;

  const isGenerating = isPending;
  const isBackgroundGenerating = activeJobsCount > 0;

  // Check if current result is part of a carousel series
  const seriesId = (result?.params as any)?.seriesId;
  const isCarousel = !!seriesId;

  // Gather all slides in this carousel series from history
  const carouselSlides = isCarousel
    ? [
        result,
        ...recentGenerations.filter(
          (g) => g && (g.params as any)?.seriesId === seriesId && g.id !== result?.id
        ),
      ].sort((a, b) => ((a?.params as any)?.slideIndex ?? 0) - ((b?.params as any)?.slideIndex ?? 0))
    : [];

  const currentSlideIndex = isCarousel
    ? carouselSlides.findIndex((s) => s?.id === result?.id)
    : -1;

  const handleGridDownload = async () => {
    try {
      setIsGridDownloading(true);
      showToast("🎨 Carousel Grid ပုံ စုစည်းနေပါသည်...", "info");
      
      const urls = carouselSlides.map((s) => s?.result_url).filter(Boolean) as string[];
      const { composeCarouselGrid } = await import("@/lib/grid-composer");
      const gridDataUrl = await composeCarouselGrid(urls, aspectRatio);
      
      const { downloadImage } = await import("@/lib/download");
      const res = await downloadImage(gridDataUrl, `carousel-grid-${Date.now()}.jpg`);
      
      showToast(res.toastMessage, res.toastType);
    } catch (error: any) {
      console.error("Grid download failed:", error);
      showToast(error?.message || "Grid composition/download failed", "error");
    } finally {
      setIsGridDownloading(false);
    }
  };

  const totalEntityCount = (result ? 1 : 0) + activeJobsCount;
  const stackCount = Math.max(0, Math.min(totalEntityCount - 1, 3));

  useEffect(() => {
    if (result?.id && result.id !== lastOpenedId.current && !isGenerating) {
        lastOpenedId.current = result.id;
        setActiveLightboxResult(result);
        setLightboxOpen(true);
    }
  }, [result?.id, isGenerating]);

  const handleRecentSelect = (gen: GenerateResult) => {
    setResult?.(gen);
    setImageLoaded(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const showCanvas = !!(result || isGenerating || isBackgroundGenerating);

  return (
    <section className={cn(
        "w-full lg:flex-1 shrink-0 min-h-[42vh] lg:h-full lg:min-h-0 min-w-0 bg-gradient-to-b from-accent/5 to-accent/15 relative flex flex-col items-center overflow-y-auto overflow-x-hidden selection:bg-primary/20 order-1 lg:order-2 border-b lg:border-b-0 border-border pb-10 transition-all duration-500",
        "flex"
      )}>

      {/* Modern Workspace Header Banner */}
      {showCanvas && (
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/30 backdrop-blur-md sticky top-0 z-10 select-none animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Interactive Canvas Workspace
            </h4>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold px-2.5 py-0.5 rounded-full bg-background/50 border border-border/60">
            {isGenerating ? "Rendering Live" : "Draft Saved"}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 lg:p-10 animate-in fade-in duration-1000">
        {showCanvas ? (
          <div ref={resultRef as any} className="relative w-full h-auto flex flex-col items-center">
            {/* Image Frame Area */}
            <div className="relative w-full max-w-[95%] md:max-w-4xl flex flex-col items-center justify-center">
              {/* Card Stack and Active Image Container */}
              <div 
                className={cn(
                  "relative w-[290px] md:w-[480px] lg:w-[560px] max-w-full flex items-center justify-center transition-all duration-500 ease-out mx-auto",
                  (!nextSrc && !effectiveSrc) && "h-[290px] md:h-[480px] lg:h-[560px]"
                )}
                style={(!nextSrc && !effectiveSrc) ? {} : { 
                  aspectRatio: aspectRatio.replace(":", "/"),
                  height: "auto",
                  maxHeight: "55vh"
                }}
              >
                {/* Background Job Stack Cards */}
                <JobStack
                  stackCount={stackCount}
                  activeJobs={activeJobs}
                  aspectRatio={aspectRatio}
                  showToast={showToast}
                />

                {/* The Top Main Image Canvas */}
                <ActivePreviewImage
                  nextSrc={nextSrc}
                  effectiveSrc={effectiveSrc}
                  imageLoaded={imageLoaded}
                  isGenerating={isGenerating}
                  isBackgroundGenerating={isBackgroundGenerating}
                  isSwapping={isSwapping}
                  progressValue={progressValue}
                  result={result}
                  setActiveLightboxResult={setActiveLightboxResult}
                  setLightboxOpen={setLightboxOpen}
                  setImageLoaded={setImageLoaded}
                  setDisplaySrc={setDisplaySrc}
                  speed={speed}
                  quality={quality}
                  modelTier={modelTier}
                  aspectRatio={aspectRatio}
                />

                {/* Carousel Navigation Arrows */}
                {isCarousel && carouselSlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevIdx = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
                        setResult?.(carouselSlides[prevIdx] as any);
                        setImageLoaded(false);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border/50 text-foreground shadow-sm transition-all z-20 cursor-pointer backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIdx = (currentSlideIndex + 1) % carouselSlides.length;
                        setResult?.(carouselSlides[nextIdx] as any);
                        setImageLoaded(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border/50 text-foreground shadow-sm transition-all z-20 cursor-pointer backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Carousel Slide Indicators */}
            {isCarousel && carouselSlides.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4 select-none">
                {carouselSlides.map((slide, idx) => (
                  <button
                    key={slide?.id || `dot-${idx}`}
                    type="button"
                    onClick={() => {
                      if (slide) {
                        setResult?.(slide);
                        setImageLoaded(false);
                      }
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentSlideIndex === idx
                        ? "bg-primary w-5"
                        : "bg-muted-foreground/35 hover:bg-muted-foreground/60"
                    )}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-2 font-bold uppercase tracking-wider bg-muted/40 px-2 py-0.5 rounded-full border border-border/40">
                  Slide {currentSlideIndex + 1} / {carouselSlides.length}
                </span>
              </div>
            )}
            
            {/* Actions & History Deck */}
            <PreviewActionsWithTray
              result={result}
              isDownloading={isDownloading}
              isGenerating={isGenerating}
              recentGenerations={recentGenerations}
              handleDownload={handleDownload}
              handleRecentSelect={handleRecentSelect}
              isCarousel={isCarousel}
              carouselSlidesCount={carouselSlides.length}
              handleGridDownload={handleGridDownload}
              isGridDownloading={isGridDownloading}
              handleAnimateAd={handleAnimateAd}
              isAnimating={isAnimating}
            />
          </div>
        ) : (
          /* High-Fidelity Empty State */
          <DesignCanvasEmptyState />
        )}
      </div>

      <PreviewLightbox 
        isOpen={lightboxOpen}
        result={activeLightboxResult}
        onClose={() => { setLightboxOpen(false); setActiveLightboxResult(null); }}
        handleDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </section>
  );
}