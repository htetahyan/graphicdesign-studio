"use client";

import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import type { BrandFormValues } from "./types";
import { cn } from "@/lib/utils";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { TemplateGridItem } from "./TemplateGridItem";
import { ReferenceUploadSection } from "./ReferenceUploadSection";
import { InspirationSkeletons, LoadingMoreSkeletons } from "./InspirationSkeletons";

interface Step3InspirationProps {
  watchedInspirationIds: string[];
  watchedReferenceImages: File[];
  errors: FieldErrors<BrandFormValues>;
  selectedIndustry: string | null;
  industryTemplates: any[];
  isLoadingTemplates?: boolean;
  isDraggingRefImages: boolean;
  handleRefImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefImagesDragOver: (e: React.DragEvent) => void;
  handleRefImagesDragEnter: (e: React.DragEvent) => void;
  handleRefImagesDragLeave: (e: React.DragEvent) => void;
  handleRefImagesDrop: (e: React.DragEvent) => void;
  removeRefImage: (idx: number) => void;
  setValue: UseFormSetValue<BrandFormValues>;
  toggleInspiration: (id: string) => void;
}

import { NoIndustrySelected } from "./NoIndustrySelected";

export function Step3Inspiration({
  watchedInspirationIds,
  watchedReferenceImages,
  errors,
  selectedIndustry,
  industryTemplates,
  isLoadingTemplates,
  isDraggingRefImages,
  handleRefImagesChange,
  handleRefImagesDragOver,
  handleRefImagesDragEnter,
  handleRefImagesDragLeave,
  handleRefImagesDrop,
  removeRefImage,
  setValue,
  toggleInspiration,
}: Step3InspirationProps) {
  const inspirationCount = watchedInspirationIds.length;

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayTemplates = industryTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < industryTemplates.length;

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    setIsLoadingMore,
    setVisibleCount,
    totalLength: industryTemplates.length,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Premium Header */}
      <div className="flex items-center gap-4.5 pb-2 border-b border-border/25">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Lightbulb className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
            Style Inspiration
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Inspiration is used for layout and style only. Colors and text stay from your previous designs.
          </p>
        </div>
      </div>

      {/* ── Reference Images Upload Card ── */}
      <ReferenceUploadSection
        watchedReferenceImages={watchedReferenceImages}
        errors={errors}
        isDraggingRefImages={isDraggingRefImages}
        handleRefImagesChange={handleRefImagesChange}
        handleRefImagesDragOver={handleRefImagesDragOver}
        handleRefImagesDragEnter={handleRefImagesDragEnter}
        handleRefImagesDragLeave={handleRefImagesDragLeave}
        handleRefImagesDrop={handleRefImagesDrop}
        removeRefImage={removeRefImage}
      />

      {/* Style Templates Grid */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
            Pick Styles
          </label>
          <span
            className="text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all duration-300 bg-primary text-primary-foreground border-primary shadow-md"
          >
            {inspirationCount}/5
          </span>
        </div>

        {/* Selected Industry Styles Section */}
        {!isLoadingTemplates && selectedIndustry && displayTemplates.some((t: any) => t.industryId === selectedIndustry) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-border" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-3.5 py-1 rounded-full border border-border">
                Your Industry
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border to-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {displayTemplates
                .filter((t: any) => t.industryId === selectedIndustry)
                .map((template: any) => (
                  <TemplateGridItem
                    key={template.id}
                    template={template}
                    isSelected={watchedInspirationIds.includes(template.id)}
                    onToggle={toggleInspiration}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Other Styles Section */}
        {!isLoadingTemplates && displayTemplates.some((t: any) => t.industryId !== selectedIndustry) && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/60 to-border/60" />
              <span className="text-[9px] font-bold text-muted-foreground/80 uppercase tracking-widest bg-muted/40 px-3.5 py-1 rounded-full border border-border/50">
                More Styles
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border/60 to-border/60" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {displayTemplates
                .filter((t: any) => t.industryId !== selectedIndustry)
                .map((template: any) => (
                  <TemplateGridItem
                    key={template.id}
                    template={template}
                    isSelected={watchedInspirationIds.includes(template.id)}
                    onToggle={toggleInspiration}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Skeletons loader */}
        {isLoadingTemplates && <InspirationSkeletons />}

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-4">
            {isLoadingMore && <LoadingMoreSkeletons />}
          </div>
        )}

        {!selectedIndustry && <NoIndustrySelected />}
      </div>
    </div>
  );
}
