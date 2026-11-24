"use client";

import React from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import type { AdvancedSettings } from "../types";

interface AspectRatioSelectorProps {
  aspectRatio: string;
  setAspectRatio: (r: string) => void;
  isPending: boolean;
  isInputDisabled: boolean;
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettings>>;
}

export function AspectRatioSelector({
  aspectRatio,
  setAspectRatio,
  isPending,
  isInputDisabled,
  advancedSettings,
  setAdvancedSettings,
}: AspectRatioSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Aspect Ratio
        </label>

        <button
          type="button"
          onClick={() =>
            !isInputDisabled &&
            setAdvancedSettings((prev) => ({
              ...prev,
              creativeMode: !prev.creativeMode,
            }))
          }
          disabled={isInputDisabled}
          className={cn(
            "shrink-0 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 transition-all select-none",
            advancedSettings.creativeMode
              ? "border-primary/20 bg-primary/10 text-primary font-bold"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50",
            isInputDisabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <Sparkles
            className={cn(
              "w-3.5 h-3.5",
              advancedSettings.creativeMode && "animate-pulse text-primary",
            )}
          />
          <span className="text-xs font-bold">Creative</span>
          <span
            className={cn(
              "relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors",
              advancedSettings.creativeMode ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 transform rounded-full transition-transform shadow-xs",
                advancedSettings.creativeMode
                  ? "translate-x-4 bg-primary-foreground"
                  : "translate-x-0.5 bg-foreground",
              )}
            />
          </span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { ratio: "1:1", hint: "Square" },
          { ratio: "4:5", hint: "Portrait (IG)" },
          { ratio: "9:16", hint: "Story/Reels" },
          { ratio: "16:9", hint: "Landscape" },
          { ratio: "4:3", hint: "Standard" },
          { ratio: "3:2", hint: "Photo" },
        ].map((item) => (
          <button
            key={item.ratio}
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
              setAspectRatio(item.ratio);
            }}
            disabled={isPending}
            title={item.hint}
            className={cn(
              "h-12 py-1.5 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 select-none shadow-xs",
              aspectRatio === item.ratio
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border/70 hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <span className="text-xs font-extrabold">{item.ratio}</span>
            <span className={cn(
              "text-[10px] font-medium leading-none truncate max-w-full",
              aspectRatio === item.ratio ? "text-primary-foreground/80" : "text-muted-foreground/75"
            )}>
              {item.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
