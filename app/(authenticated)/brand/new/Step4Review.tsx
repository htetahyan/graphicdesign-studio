"use client";

import React from "react";
import { ClipboardCheck, Sparkles, Image as ImageIcon, FolderHeart, Layers } from "lucide-react";
import { INDUSTRIES } from "./constants";

interface Step4ReviewProps {
  watchedLogo: File | null;
  watchedName: string;
  selectedIndustry: string | null;
  watchedImages: File[];
  watchedReferenceImages: File[];
  watchedInspirationIds: string[];
}

export function Step4Review({
  watchedLogo,
  watchedName,
  selectedIndustry,
  watchedImages,
  watchedReferenceImages,
  watchedInspirationIds,
}: Step4ReviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Premium Header */}
      <div className="flex items-center gap-4.5 pb-2 border-b border-border/25">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ClipboardCheck className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
            Review Brand
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Double check your details before generating your brand identity
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-4 bg-secondary/30">
          <div className="h-16 w-16 rounded-xl bg-secondary border border-border p-2 shrink-0 shadow-inner flex items-center justify-center relative overflow-hidden group">
            {watchedLogo ? (
              <img
                src={URL.createObjectURL(watchedLogo)}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                alt="Logo"
              />
            ) : (
              <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-extrabold text-lg">
                {watchedName ? watchedName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight leading-tight">
              {watchedName || "Untitled Brand"}
            </h3>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-foreground font-extrabold tracking-wide uppercase px-2.5 py-0.5 bg-secondary border border-border rounded-full mt-1.5">
              {INDUSTRIES.find((i) => i.id === selectedIndustry)?.label || "Other Industry"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-5 bg-card">
          {/* Images Stat */}
          <div className="bg-secondary/70 border border-border rounded-xl p-4 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Brand Images
              </p>
              <p className="text-xl font-extrabold text-foreground mt-0.5">
                {watchedImages.length}
                <span className="text-xs font-bold text-muted-foreground ml-1">
                  {watchedImages.length === 1 ? "file" : "files"}
                </span>
              </p>
            </div>
          </div>

          {/* References Stat */}
          <div className="bg-secondary/70 border border-border rounded-xl p-4 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Reference Designs
              </p>
              <p className="text-xl font-extrabold text-foreground mt-0.5">
                {watchedReferenceImages.length}
                <span className="text-xs font-bold text-muted-foreground ml-1">
                  {watchedReferenceImages.length === 1 ? "file" : "files"}
                </span>
              </p>
            </div>
          </div>

          {/* Inspiration Stat */}
          <div className="bg-secondary/70 border border-border rounded-xl p-4 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Style Selections
              </p>
              <p className="text-xl font-extrabold text-foreground mt-0.5">
                {watchedInspirationIds.length}
                <span className="text-xs font-bold text-muted-foreground ml-1">
                  selected
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA action card */}
      <div className="relative bg-card border border-border text-foreground rounded-2xl p-5.5 shadow-xl overflow-hidden group">
        <div className="relative flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground shadow-md">
            <Sparkles className="w-5 h-5 text-foreground animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-foreground tracking-wide">
              Ready to generate your visual identity?
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
              Press &ldquo;Create Brand&rdquo; below to compile your designs, logo profiles, and guidelines. Our AI designer will begin constructing custom brand models.
            </p>
            <p className="text-[10px] font-extrabold text-foreground mt-2 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Takes approximately 30–90 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
