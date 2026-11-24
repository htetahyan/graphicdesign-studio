"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface GalacticLoaderProps {
  isPending: boolean;
  progressValue: number;
}

export function GalacticLoader({ isPending, progressValue }: GalacticLoaderProps) {
  if (!isPending) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-full max-w-sm space-y-6">
        {/* Animated Orb / Galaxy */}
        <div className="relative w-28 h-28 mx-auto">
          <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse opacity-25 blur-xl" />
          <div className="absolute inset-2 rounded-full bg-white/15 animate-pulse opacity-35 blur-md" />
          <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.12)] border border-border">
            <Sparkles className="w-10 h-10 text-foreground animate-pulse" />
          </div>
          {/* Orbiting element */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2.5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-primary shadow-lg shadow-white/40 ring-2 ring-white/20" />
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-1">
          <p className="text-lg font-black text-foreground tracking-tight">
            {progressValue < 12 ? "Uploading images..." :
              progressValue < 28 ? "Analyzing brand style..." :
                progressValue < 45 ? "Extracting color palette..." :
                  progressValue < 60 ? "Building brand profile..." :
                    progressValue < 78 ? "Generating style context..." :
                      progressValue < 88 ? "Finalizing brand..." :
                        "Almost done..."}
          </p>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {Math.round(progressValue)}% complete
          </p>
        </div>

        {/* Premium Frosted Step Indicators Card */}
        <div className="bg-card backdrop-blur border border-border shadow-2xl rounded-2xl p-5 space-y-3.5">
          {[
            { label: "Uploading images", threshold: 10 },
            { label: "Analyzing brand style", threshold: 25 },
            { label: "Extracting color palette", threshold: 40 },
            { label: "Building brand profile", threshold: 55 },
            { label: "Generating style context", threshold: 72 },
            { label: "Finalizing brand", threshold: 88 },
          ].map((step, i) => {
            const isDone = progressValue >= step.threshold;
            const isActive = !isDone && (i === 0 || progressValue >= [0, 10, 25, 40, 55, 72][i]);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500
                  ${isDone 
                    ? "bg-primary text-primary-foreground shadow-md scale-100" 
                    : isActive 
                      ? "bg-secondary border-2 border-foreground scale-110 shadow-lg" 
                      : "bg-secondary/50 border border-border"
                  }`}
                >
                  {isDone ? (
                    <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <Loader2 className="w-3.5 h-3.5 text-foreground animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                  )}
                </div>
                <span className={`text-xs font-bold transition-colors duration-300 ${isDone ? "text-foreground" :
                  isActive ? "text-foreground font-extrabold" :
                    "text-muted-foreground"
                  }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Glowing Smooth Progress Bar */}
        <div className="px-1">
          <div className="w-full h-2.5 bg-secondary border border-border rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Warning Button/Badge */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider shadow-inner animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          ဒီစာမျက်နှာကို မပိတ်ပါနှင့် (Do Not Close)
        </div>
      </div>
    </div>
  );
}
