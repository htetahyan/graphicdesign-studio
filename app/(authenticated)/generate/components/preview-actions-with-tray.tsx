"use client";

import React from "react";
import Link from "next/link";
import { Download, Image as ImageIcon, Loader2, Sparkles, ChevronRight, LayoutGrid, Play, PlayCircle } from "lucide-react";
import { RecentTray } from "./recent-tray";
import type { GenerateResult } from "../types";

interface PreviewActionsWithTrayProps {
  result: GenerateResult | null;
  isDownloading: boolean;
  isGenerating: boolean;
  recentGenerations: GenerateResult[];
  handleDownload: () => Promise<void>;
  handleRecentSelect: (gen: GenerateResult) => void;
  isCarousel?: boolean;
  carouselSlidesCount?: number;
  handleGridDownload?: () => Promise<void>;
  isGridDownloading?: boolean;
  handleAnimateAd?: (duration: 4 | 6) => void;
  isAnimating?: boolean;
}

export function PreviewActionsWithTray({
  result,
  isDownloading,
  isGenerating,
  recentGenerations,
  handleDownload,
  handleRecentSelect,
  isCarousel = false,
  carouselSlidesCount = 0,
  handleGridDownload,
  isGridDownloading = false,
  handleAnimateAd,
  isAnimating = false,
}: PreviewActionsWithTrayProps) {
  if (!result && !isGenerating) return null;

  return (
    <div className="flex flex-col items-center gap-5 mt-6 w-full max-w-2xl mx-auto">
      {/* Premium Floating Actions Dock */}
      <div className="flex items-center gap-1.5 p-1.5 bg-background/60 backdrop-blur-xl border border-border/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-3 fade-in duration-500 max-w-full flex-wrap justify-center">
        <button
          onClick={() => {
            import("@capacitor/haptics").then(({ Haptics, ImpactStyle }) => {
              Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
            });
            handleDownload();
          }}
          disabled={isDownloading || isGenerating || !result}
          className="h-11 px-6 bg-gradient-to-r from-primary to-primary/95 text-primary-foreground rounded-xl flex items-center gap-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary-foreground/90" />
              <span>Saving Artwork...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isCarousel ? "Download Slide" : "Download Masterpiece"}</span>
            </>
          )}
        </button>

        {isCarousel && carouselSlidesCount > 1 && (
          <>
            <div className="w-[1px] h-6 bg-border/80 mx-1 shrink-0" />
            <button
              onClick={() => {
                import("@capacitor/haptics").then(({ Haptics, ImpactStyle }) => {
                  Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
                });
                handleGridDownload?.();
              }}
              disabled={isGridDownloading || isGenerating}
              className="h-11 px-5 bg-background/50 hover:bg-accent hover:text-foreground text-muted-foreground border border-border/60 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
            >
              {isGridDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Composing Grid...</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  <span>Download Grid</span>
                </>
              )}
            </button>
          </>
        )}

        {handleAnimateAd && !result?.result_url.endsWith(".mp4") && (
          <>
            <div className="w-[1px] h-6 bg-border/80 mx-1 shrink-0" />
            <button
              onClick={() => {
                handleAnimateAd(4);
              }}
              disabled={isAnimating || isGenerating || !result}
              className="h-11 px-5 bg-background/50 hover:bg-indigo-500/10 hover:text-indigo-400 text-muted-foreground border border-border/60 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
            >
              {isAnimating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Animating...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Animate (4s)</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                handleAnimateAd(6);
              }}
              disabled={isAnimating || isGenerating || !result}
              className="h-11 px-5 bg-background/50 hover:bg-indigo-500/10 hover:text-indigo-400 text-muted-foreground border border-border/60 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
            >
              {isAnimating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Animating...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Animate (6s)</span>
                </>
              )}
            </button>
          </>
        )}

        <div className="w-[1px] h-6 bg-border/80 mx-1 shrink-0" />

        <Link
          href="/gallery"
          className="h-11 px-5 bg-background/50 hover:bg-accent hover:text-foreground text-muted-foreground rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-[0.98]"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Gallery</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50 sm:hidden" />
        </Link>
      </div>

      {/* Version list container */}
      <RecentTray
        recentGenerations={recentGenerations}
        activeResultId={result?.id}
        onSelect={handleRecentSelect}
      />
    </div>
  );
}
