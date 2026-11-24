"use client";

import React from "react";
import { ZoomIn, Zap, Clock, Sparkles, Sliders, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerateResult } from "../types";

interface ActivePreviewImageProps {
  nextSrc: string | null;
  effectiveSrc: string | null;
  imageLoaded: boolean;
  isGenerating: boolean;
  isBackgroundGenerating: boolean;
  isSwapping: boolean;
  progressValue: number;
  result: GenerateResult | null;
  setActiveLightboxResult: (res: GenerateResult | null) => void;
  setLightboxOpen: (open: boolean) => void;
  setImageLoaded: (loaded: boolean) => void;
  setDisplaySrc: (src: string | null) => void;
  speed: "slow" | "normal";
  quality: "normal" | "hd" | "2k" | "4k";
  modelTier?: "normal" | "pro";
  aspectRatio: string;
}

export function ActivePreviewImage({
  nextSrc,
  effectiveSrc,
  imageLoaded,
  isGenerating,
  isBackgroundGenerating,
  isSwapping,
  progressValue,
  result,
  setActiveLightboxResult,
  setLightboxOpen,
  setImageLoaded,
  setDisplaySrc,
  speed,
  quality,
  modelTier = "normal",
  aspectRatio,
}: ActivePreviewImageProps) {
  const currentSpeed = (result?.params?.speed as "slow" | "normal") || speed;
  const currentQuality = (result?.params?.quality as "normal" | "hd" | "2k" | "4k") || quality;
  const currentModelTier = (result?.params?.modelTier as "normal" | "pro") || modelTier;
  const currentRatio = result?.aspect_ratio || aspectRatio;
  const speedCost = currentSpeed === "slow" ? 7 : 10;
  const qualityCost = currentQuality === "4k" ? 10 : currentQuality === "2k" ? 5 : currentQuality === "hd" ? 2 : 0;
  const modelCost = currentModelTier === "pro" ? 5 : 0;
  const rawCost = speedCost + qualityCost + modelCost;
  // Profit Margin Safeguard (Enforce >= 60% profit margin on any setting):
  // 1 credit = $0.02 USD revenue.
  // Standard/HD API cost is $0.03 (min 3.75 credits for 60% profit margin).
  // Premium (2K/4K) API cost is $0.05 (min 6.25 credits for 60% profit margin).
  const minRequiredCredits = (currentQuality === "2k" || currentQuality === "4k") ? 7 : 4;
  const totalCost = Math.max(rawCost, minRequiredCredits);
  const showOverlay = isGenerating || (!result && isBackgroundGenerating) || (isSwapping && !imageLoaded);

  return (
    <div
      className={cn(
        "relative group w-full h-full flex items-center justify-center select-none",
        imageLoaded && !isGenerating && result
          ? "cursor-pointer pointer-events-auto"
          : "cursor-default pointer-events-none"
      )}
      onClick={() => {
        if (imageLoaded && !isGenerating && result) {
          import("@capacitor/haptics").then(({ Haptics, ImpactStyle }) => {
            Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
          });
          setActiveLightboxResult(result);
          setLightboxOpen(true);
        }
      }}
    >
      <div
        className={cn(
          "relative w-full h-full bg-slate-950/5 p-2 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-border/60 transition-all duration-700 ease-out flex items-center justify-center overflow-hidden",
          imageLoaded && !isGenerating
            ? "opacity-100 scale-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:border-primary/40"
            : "opacity-100 scale-[0.98] translate-y-1",
        )}
      >
        {/* Subtle Ambient Frame Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* The Main Top Image */}
        {nextSrc && (
          nextSrc.endsWith(".mp4") ? (
            <video
              src={nextSrc}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "w-full h-full max-h-[55vh] object-contain rounded-xl transition-all duration-1000 ease-out",
                imageLoaded && !isGenerating && !isBackgroundGenerating
                  ? "opacity-100 blur-0 scale-100"
                  : "opacity-0 blur-xl scale-105",
              )}
              onLoadedData={() => {
                if (nextSrc) setDisplaySrc(nextSrc);
                setImageLoaded(true);
              }}
            />
          ) : (
            <img
              src={nextSrc}
              className={cn(
                "w-full h-full max-h-[55vh] object-contain rounded-xl transition-all duration-1000 ease-out",
                imageLoaded && !isGenerating && !isBackgroundGenerating
                  ? "opacity-100 blur-0 scale-100"
                  : "opacity-0 blur-xl scale-105",
              )}
              alt="Generated artwork design"
              onLoad={() => {
                if (nextSrc) setDisplaySrc(nextSrc);
                setImageLoaded(true);
              }}
            />
          )
        )}

        {/* Previous Image Underlay for Swapping */}
        {!!effectiveSrc && effectiveSrc !== nextSrc && (
          effectiveSrc.endsWith(".mp4") ? (
            <video
              src={effectiveSrc}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain rounded-xl transition-all duration-700",
                !imageLoaded || isGenerating || isBackgroundGenerating
                  ? "opacity-40 blur-[2px]"
                  : "opacity-0 blur-lg",
              )}
            />
          ) : (
            <img
              src={effectiveSrc}
              className={cn(
                "absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain rounded-xl transition-all duration-700",
                !imageLoaded || isGenerating || isBackgroundGenerating
                  ? "opacity-40 blur-[2px]"
                  : "opacity-0 blur-lg",
              )}
              alt="Previous design"
            />
          )
        )}

        {/* Floating Glassmorphic Metadata Drawer (Top Overlay) */}
        {!showOverlay && imageLoaded && (
          <div className="absolute top-4 left-4 right-4 flex justify-between gap-2 opacity-0 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0 transition-all duration-500 z-10 pointer-events-none">
            {/* Left Badges */}
            <div className="flex flex-wrap gap-1.5 max-w-[75%]">
              <span className="flex items-center gap-1 px-2.5 py-1 bg-black/60 dark:bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                {currentSpeed === "slow" ? (
                  <Clock className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                ) : (
                  <Zap className="w-2.5 h-2.5 text-primary animate-pulse" />
                )}
                <span>{currentSpeed === "slow" ? "Slow" : "Turbo"}</span>
              </span>

              <span className="flex items-center gap-1 px-2.5 py-1 bg-black/60 dark:bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                <span>
                  {currentQuality === "4k" ? "4K" : currentQuality === "2k" ? "2K" : currentQuality === "hd" ? "HD" : "1K"}
                </span>
              </span>

              <span className="flex items-center gap-1 px-2.5 py-1 bg-black/60 dark:bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                <Layers className="w-2.5 h-2.5 text-emerald-400" />
                <span>{currentRatio}</span>
              </span>


            </div>
            {/* Right Cost Badge */}
            <span className="flex items-center shrink-0 px-2.5 py-1 bg-primary/95 backdrop-blur-md border border-primary/20 rounded-full text-[9px] font-extrabold text-primary-foreground uppercase tracking-wider shadow-md">
              -{totalCost} Credits
            </span>
          </div>
        )}
        {/* Premium Neon/Orbital Loading State - Rendered LAST */}
        {showOverlay && (
          <div className="absolute inset-2 rounded-xl overflow-hidden bg-background/85 dark:bg-slate-950/85 backdrop-blur-xl flex flex-col items-center justify-center z-20 transition-all duration-500 shadow-inner">
            {!!effectiveSrc && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl scale-120 opacity-30 dark:opacity-20"
                style={{ backgroundImage: `url(${effectiveSrc})` }}
              />
            )}

            {/* Orbital Ring & Glowing Status Indicator */}
            <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6">
              <div className="relative h-16 w-16 flex items-center justify-center">
                {/* Outermost neon spinning halo */}
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-primary via-purple-500 to-indigo-500 opacity-20 blur-sm animate-pulse" />
                {/* Spinning rings */}
                <div className="absolute inset-0 rounded-full border-3 border-primary/10" />
                <div className="absolute inset-0 rounded-full border-3 border-primary border-t-transparent animate-spin duration-1000" />
                <div className="absolute inset-1.5 rounded-full border-2 border-indigo-500/10" />
                <div className="absolute inset-1.5 rounded-full border-2 border-indigo-500 border-b-transparent animate-spin duration-1500 reverse" />
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase block">
                  {progressValue < 30 ? "Analyzing Context" : progressValue < 70 ? "Composing Layout" : "Polishing Details"}
                </span>
                {progressValue > 0 && (
                  <p className="text-[11px] text-foreground font-extrabold bg-primary/10 dark:bg-primary/20 border border-primary/20 inline-block px-3 py-0.5 rounded-full">
                    {Math.round(progressValue)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {!showOverlay && imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/15 transition-all duration-300 pointer-events-none">
            <div className="w-12 h-10 bg-background/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-border/80 text-foreground scale-90 group-hover:scale-100 transition-all duration-300">
              <ZoomIn className="w-5 h-5 stroke-[1.8] text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
