"use client";

import React from "react";
import { Paintbrush, FileImage, Frame, Share2, PanelTop } from "lucide-react";
import { cn } from "@/lib/utils";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import type { AdvancedSettings, DesignType } from "../types";

interface DesignTypeSelectorProps {
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettings>>;
  isPending: boolean;
  isInputDisabled: boolean;
}

export function DesignTypeSelector({
  advancedSettings,
  setAdvancedSettings,
  isPending,
  isInputDisabled,
}: DesignTypeSelectorProps) {
  const designTypes: { id: DesignType; label: string; icon: React.ElementType }[] = [
    { id: "graphic_design", label: "Design", icon: Paintbrush },
    { id: "flyer", label: "Flyer", icon: FileImage },
    { id: "banner", label: "Banner", icon: PanelTop },
    { id: "social_post", label: "Social", icon: Share2 },
    { id: "poster", label: "Poster", icon: Frame },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
        <Paintbrush className="w-4 h-4 text-primary" />
        Design Type
      </label>
      
      <div className="grid grid-cols-5 gap-2 p-1.5 bg-muted/40 rounded-2xl border border-border/60">
        {designTypes.map((type) => {
          const isSelected = (advancedSettings.designType || "graphic_design") === type.id;
          const Icon = type.icon;
          
          return (
            <button
              key={type.id}
              type="button"
              disabled={isInputDisabled}
              onClick={() => {
                Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
                setAdvancedSettings((prev) => ({
                  ...prev,
                  designType: type.id,
                }));
              }}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all gap-1.5 select-none",
                isSelected 
                  ? "bg-background shadow-sm border border-border text-foreground font-bold" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent",
                isInputDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", isSelected ? "text-primary scale-110" : "")} />
              <span className="text-[11px] font-bold tracking-tight">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
