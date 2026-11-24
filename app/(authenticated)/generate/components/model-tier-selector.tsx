"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ModelTierSelectorProps {
  modelTier?: "normal" | "pro";
  setModelTier?: (tier: "normal" | "pro") => void;
  isInputDisabled?: boolean;
}

export function ModelTierSelector({
  isInputDisabled = false,
}: ModelTierSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
        Render
      </p>
      <div
        className={cn(
          "h-11 rounded-xl border border-primary bg-primary/10 px-3 flex items-center text-xs font-bold text-foreground",
          isInputDisabled && "opacity-60",
        )}
      >
        Standard
      </div>
    </div>
  );
}
