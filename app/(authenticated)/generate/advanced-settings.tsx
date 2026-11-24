"use client";

import React from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadsSection } from "./image-uploads-section";
import type { AdvancedSettings as AdvancedSettingsType } from "./types";

interface AdvancedSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  isDisabled: boolean;
  advancedSettings: AdvancedSettingsType;
  setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettingsType>>;
  referenceImages: File[];
  referenceImagePreviews: string[];
  characterImages: File[];
  characterImagePreviews: string[];
  referenceInfluence: "normal" | "high";
  setReferenceInfluence: (value: "normal" | "high") => void;
  handleCharacterImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReferenceImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCharacterImage: (index: number) => void;
  removeReferenceImage: (index: number) => void;
  headlineError?: string;
  ctaError?: string;
  onHeadlineChange?: () => void;
  onCtaChange?: () => void;
  speed: "slow" | "normal";
  setSpeed: (s: "slow" | "normal") => void;
  quality: "normal" | "hd" | "2k" | "4k";
  setQuality: (q: "normal" | "hd" | "2k" | "4k") => void;
}

export function AdvancedSettings({
  isOpen,
  onToggle,
  isDisabled,
  advancedSettings,
  setAdvancedSettings,
  referenceImages,
  referenceImagePreviews,
  characterImages,
  characterImagePreviews,
  referenceInfluence,
  setReferenceInfluence,
  handleCharacterImageUpload,
  handleReferenceImageUpload,
  removeCharacterImage,
  removeReferenceImage,
}: AdvancedSettingsProps) {
  return (
    <div className="rounded-2xl border border-border/80 overflow-hidden bg-background shadow-xs">
      <button
        onClick={onToggle}
        disabled={isDisabled}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-background hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Refs & style
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300 ease-out",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="p-3.5 md:p-4 space-y-4 border-t border-border/60 bg-background animate-in slide-in-from-top-2 duration-300 ease-out">
          <ImageUploadsSection
            isDisabled={isDisabled}
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
          />

          {/* ── Style Intensity + Influence Weight (Switch Pills) ───── */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                !isDisabled &&
                setAdvancedSettings((prev) => ({
                  ...prev,
                  styleIntensity: prev.styleIntensity === "high" ? "normal" : "high",
                }))
              }
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center justify-between rounded-xl border px-3 py-2 transition-all select-none",
                advancedSettings.styleIntensity === "high"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Strong Style</span>
              </div>
              <span
                className={cn(
                  "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
                  advancedSettings.styleIntensity === "high" ? "bg-primary" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-2.5 w-2.5 transform rounded-full transition-transform shadow-xs",
                    advancedSettings.styleIntensity === "high"
                      ? "translate-x-3.5 bg-primary-foreground"
                      : "translate-x-0.5 bg-foreground",
                  )}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                !isDisabled &&
                setAdvancedSettings((prev) => ({
                  ...prev,
                  referenceInfluence: prev.referenceInfluence === "high" ? "normal" : "high",
                }))
              }
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center justify-between rounded-xl border px-3 py-2 transition-all select-none",
                advancedSettings.referenceInfluence === "high"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Lock Visual</span>
              </div>
              <span
                className={cn(
                  "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
                  advancedSettings.referenceInfluence === "high" ? "bg-primary" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-2.5 w-2.5 transform rounded-full transition-transform shadow-xs",
                    advancedSettings.referenceInfluence === "high"
                      ? "translate-x-3.5 bg-primary-foreground"
                      : "translate-x-0.5 bg-foreground",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}