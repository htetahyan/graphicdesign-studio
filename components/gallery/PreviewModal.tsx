"use client";

import React from "react";
import Image from "next/image";
import { X, Download, Copy, Check, Loader2, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  selectedGen: any;
  closeModal: () => void;
  copyPrompt: (text: string) => void;
  isCopied: boolean;
  handleDownload: (url: string, filename: string) => Promise<void>;
  isDownloading: boolean;
  imageCache: Set<string>;
  setImageCache: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function PreviewModal({
  selectedGen,
  closeModal,
  copyPrompt,
  isCopied,
  handleDownload,
  isDownloading,
  imageCache,
  setImageCache,
}: PreviewModalProps) {
  const isCarousel = !!selectedGen?.isCarousel;
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);
  const [isGridDownloading, setIsGridDownloading] = React.useState(false);

  React.useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedGen?.id]);

  const activeGen = isCarousel && selectedGen.slides?.[activeSlideIndex]
    ? selectedGen.slides[activeSlideIndex]
    : selectedGen;

  const handleDownloadGrid = async () => {
    if (isGridDownloading) return;
    try {
      setIsGridDownloading(true);
      const urls = selectedGen.slides.map((s: any) => s.result_url).filter(Boolean);
      const aspect = selectedGen.slides[0]?.params?.aspectRatio || "1:1";
      const { composeCarouselGrid } = await import("@/lib/grid-composer");
      const gridDataUrl = await composeCarouselGrid(urls, aspect);
      await handleDownload(gridDataUrl, `carousel-grid-${selectedGen.seriesId || Date.now()}.jpg`);
    } catch (error: any) {
      console.error("Grid download error:", error);
    } finally {
      setIsGridDownloading(false);
    }
  };

  if (!selectedGen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-8 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-6xl bg-[#0c0c10] rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex flex-col md:flex-row overflow-hidden h-[88dvh] sm:h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Mobile close row */}
        <div className="md:hidden sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur px-3 py-2 flex items-center justify-between">
          <div className="h-1.5 w-10 rounded-full bg-border/80" />
          <button
            onClick={closeModal}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full border border-white/10 bg-white/10 hover:bg-white/15 text-xs font-semibold text-foreground active:scale-[0.98]"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex-none h-[44dvh] sm:h-[50vh] md:h-full md:flex-[2.5] bg-background/50 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-border">
          {/* Instant low-res placeholder */}
          <div className="absolute inset-0 z-0">
            <Image
              src={activeGen.result_url}
              width={600}
              height={600}
              className="w-full h-full object-contain p-4 blur-sm opacity-50"
              alt="Loading placeholder"
              unoptimized={false}
            />
          </div>
          <Image
            src={activeGen.result_url}
            width={1200}
            height={1200}
            className="imaging-photo is-ready relative z-10 w-full h-full object-contain p-4"
            alt="Preview"
            priority
            decoding="async"
            unoptimized
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
              setImageCache(prev => new Set(prev).add(activeGen.result_url));
            }}
            style={{ opacity: imageCache.has(activeGen.result_url) ? 1 : 0 }}
          />

          {/* Carousel Arrows */}
          {isCarousel && selectedGen.slides?.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlideIndex((prev) => (prev - 1 + selectedGen.slides.length) % selectedGen.slides.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background/90 border border-border text-foreground hover:bg-secondary shadow-md transition-all z-20 cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlideIndex((prev) => (prev + 1) % selectedGen.slides.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background/90 border border-border text-foreground hover:bg-secondary shadow-md transition-all z-20 cursor-pointer backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={closeModal}
            className="hidden md:flex absolute top-4 right-4 h-10 w-10 rounded-full bg-black/70 backdrop-blur-md border border-white/15 items-center justify-center text-white hover:bg-black transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 md:w-80 flex flex-col h-[40vh] md:h-full bg-card min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="space-y-1 hidden md:block">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Creation Details</h3>
              <p className="text-xs font-medium text-foreground">
                {new Date(selectedGen.created_at).toLocaleString()}
                {isCarousel && ` • Slide ${activeSlideIndex + 1} of ${selectedGen.slides.length}`}
              </p>
            </div>

            <div className="space-y-2 flex-1">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Prompt</h3>
              <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/10">
                <p className="text-xs md:text-sm text-foreground leading-relaxed italic line-clamp-4 md:line-clamp-none">
                  &quot;{selectedGen.prompt}&quot;
                </p>
              </div>
            </div>

            {/* Slide Index Dots */}
            {isCarousel && selectedGen.slides?.length > 1 && (
              <div className="space-y-2 select-none">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Slides</h3>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {selectedGen.slides.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`w-7 h-7 rounded-md border text-xs font-bold transition-all ${
                        activeSlideIndex === idx
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-secondary border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-border bg-card flex flex-col gap-2 shrink-0">
              <button
                onClick={() => copyPrompt(selectedGen.prompt)}
                className="w-full h-11 rounded-full border border-white/10 bg-white/[0.05] text-sm font-semibold text-foreground hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Copied" : "Copy Prompt"}
              </button>

              {/* Download Active Slide */}
              <Button
                onClick={() =>
                  handleDownload(
                    activeGen.result_url,
                    `design-${activeGen.id}-${isCarousel ? `slide-${activeSlideIndex + 1}` : "single"}.png`,
                  )
                }
                disabled={isDownloading}
                className="w-full h-11 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-[0.98]"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {isCarousel ? "Download Slide" : "Download"}
                  </>
                )}
              </Button>

              {/* Download Composite Grid (Carousel Only) */}
              {isCarousel && selectedGen.slides?.length > 1 && (
                <Button
                  onClick={handleDownloadGrid}
                  disabled={isGridDownloading}
                  variant="outline"
                  className="w-full h-11 rounded-full border-white/15 text-foreground hover:bg-white/10 font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isGridDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <>
                      <LayoutGrid className="w-4 h-4" />
                      Download Grid
                    </>
                  )}
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
