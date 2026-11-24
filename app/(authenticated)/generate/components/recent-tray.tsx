"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { History, Sparkles } from "lucide-react";
import type { GenerateResult } from "../types";

interface RecentTrayProps {
  recentGenerations: GenerateResult[];
  activeResultId?: string;
  onSelect: (gen: GenerateResult) => void;
}

export function RecentTray({ recentGenerations, activeResultId, onSelect }: RecentTrayProps) {
  if (!recentGenerations || recentGenerations.length <= 1) return null;

  return (
    <div className="w-full max-w-[90vw] md:max-w-2xl mt-4 px-4 py-3 rounded-2xl bg-background/40 backdrop-blur-xl border border-border/60 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <History className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
        <span className="text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase">
          Design Version Stack ({recentGenerations.length})
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {recentGenerations.map((gen, idx) => {
          const isActive = activeResultId === gen.id;
          return (
            <button
              key={gen.id || idx}
              onClick={() => {
                onSelect(gen);
                // Scroll to top to ensure user sees the change
                window.scrollTo({ top: 0, behavior: "smooth" });

                import("@capacitor/haptics").then(({ Haptics, ImpactStyle }) => {
                  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
                });
              }}
              className={cn(
                "group relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 transform active:scale-95 shadow-sm",
                isActive
                  ? "border-primary ring-2 ring-primary/20 scale-105 opacity-100 shadow-md"
                  : "border-border/40 opacity-70 hover:opacity-100 hover:border-primary/50 hover:scale-102"
              )}
            >
              <img
                src={gen.result_url}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Recent generation"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              {isActive && (
                <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-0.5 rounded-full shadow-inner animate-scale-in">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
              {/* Aspect Ratio Badge Overlay */}
              {gen.aspect_ratio && (
                <div className="absolute top-1 left-1 px-1 bg-black/60 backdrop-blur-sm rounded-[4px] text-[8px] font-bold text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  {gen.aspect_ratio}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
