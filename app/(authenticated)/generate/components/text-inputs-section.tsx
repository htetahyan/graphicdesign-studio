"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDATION_LIMITS } from "@/components/generate/schema";
import type { AdvancedSettings as AdvancedSettingsType } from "../types";

interface TypographyInputsProps {
  isDisabled: boolean;
  customHeadline: string;
  ctaText: string;
  setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettingsType>>;
  headlineError?: string;
  ctaError?: string;
  onHeadlineChange?: () => void;
  onCtaChange?: () => void;
}

export function TypographyInputs({
  isDisabled,
  customHeadline,
  ctaText,
  setAdvancedSettings,
  headlineError,
  ctaError,
  onHeadlineChange,
  onCtaChange,
}: TypographyInputsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className={cn(
            "text-xs font-bold uppercase tracking-wider",
            headlineError ? "text-red-500" : "text-foreground/80"
          )}>
            Headline
          </label>
          <span className={cn(
            "text-[10px] font-mono",
            customHeadline.length > VALIDATION_LIMITS.HEADLINE_MAX_LENGTH
              ? "text-red-500 font-bold"
              : customHeadline.length > VALIDATION_LIMITS.HEADLINE_MAX_LENGTH * 0.9
                ? "text-amber-500"
                : "text-muted-foreground"
          )}>
            {customHeadline.length > 0 && `${customHeadline.length}/${VALIDATION_LIMITS.HEADLINE_MAX_LENGTH}`}
          </span>
        </div>
        <input
          type="text"
          value={customHeadline}
          onChange={(e) => {
            setAdvancedSettings((prev) => ({
              ...prev,
              customHeadline: e.target.value,
            }));
            if (headlineError && onHeadlineChange) onHeadlineChange();
          }}
          placeholder="ခေါင်းစီး စာသား"
          disabled={isDisabled}
          maxLength={VALIDATION_LIMITS.HEADLINE_MAX_LENGTH + 10}
          className={cn(
            "w-full h-11 px-3.5 bg-background rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all disabled:opacity-50 shadow-xs",
            headlineError
              ? "border-2 border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border border-border focus:border-primary focus:ring-primary"
          )}
        />
        {headlineError && (
          <p className="text-xs font-semibold text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {headlineError}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className={cn(
            "text-xs font-bold uppercase tracking-wider",
            ctaError ? "text-red-500" : "text-foreground/80"
          )}>
            Call-to-Action
          </label>
          <span className={cn(
            "text-[10px] font-mono",
            ctaText.length > VALIDATION_LIMITS.CTA_MAX_LENGTH
              ? "text-red-500 font-bold"
              : ctaText.length > VALIDATION_LIMITS.CTA_MAX_LENGTH * 0.9
                ? "text-amber-500"
                : "text-muted-foreground"
          )}>
            {ctaText.length > 0 && `${ctaText.length}/${VALIDATION_LIMITS.CTA_MAX_LENGTH}`}
          </span>
        </div>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => {
            setAdvancedSettings((prev) => ({
              ...prev,
              ctaText: e.target.value,
            }));
            if (ctaError && onCtaChange) onCtaChange();
          }}
          placeholder="ယခုမှာမည်"
          disabled={isDisabled}
          maxLength={VALIDATION_LIMITS.CTA_MAX_LENGTH + 10}
          className={cn(
            "w-full h-11 px-3.5 bg-background rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all disabled:opacity-50 shadow-xs",
            ctaError
              ? "border-2 border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border border-border focus:border-primary focus:ring-primary"
          )}
        />
        {ctaError && (
          <p className="text-xs font-semibold text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {ctaError}
          </p>
        )}
      </div>
    </div>
  );
}
