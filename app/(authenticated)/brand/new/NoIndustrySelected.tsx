"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

export function NoIndustrySelected() {
  return (
    <div className="text-center py-10 bg-card/80 backdrop-blur rounded-2xl border border-border p-6 shadow-sm">
      <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
        <Lightbulb className="w-5.5 h-5.5" />
      </div>
      <p className="text-xs text-muted-foreground font-bold tracking-tight uppercase">
        No Industry Selected
      </p>
      <p className="text-[11px] text-muted-foreground/80 mt-1 font-medium max-w-xs mx-auto leading-relaxed">
        Select an industry in Step 1 to load matching style inspirations.
      </p>
    </div>
  );
}
