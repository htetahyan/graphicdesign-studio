"use client";

import React from "react";
import { Target, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferenceImageSectionProps {
  isDisabled: boolean;
  referenceImages: File[];
  referenceImagePreviews: string[];
  handleReferenceImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeReferenceImage: (index: number) => void;
}

export function ReferenceImageSection({
  isDisabled,
  referenceImages,
  referenceImagePreviews,
  handleReferenceImageUpload,
  removeReferenceImage,
}: ReferenceImageSectionProps) {
  const [isDraggingRef, setIsDraggingRef] = React.useState(false);

  const fireFileInput = (
    files: FileList | null,
    handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    if (!files || files.length === 0) return;
    const dt = new DataTransfer();
    Array.from(files).forEach((f) => dt.items.add(f));
    handler({
      target: { files: dt.files } as unknown as EventTarget & HTMLInputElement,
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] lg:text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 lg:gap-2">
          <Target className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> Reference (Style) ပုံ
        </label>
        {referenceImages.length > 0 && (
          <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-wider text-foreground bg-secondary border border-border px-1.5 lg:px-2 py-0.5 rounded-sm">
            {referenceImages.length} ပုံတင်ထားသည်
          </span>
        )}
      </div>

      {referenceImages.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-row gap-1.5 flex-wrap">
            {referenceImages.map((_, index) => (
              <div
                key={index}
                className="relative group w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-md border border-border bg-accent overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <img
                  src={referenceImagePreviews[index]}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeReferenceImage(index)}
                  disabled={isDisabled}
                  className={cn(
                    "absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-red-500/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-md",
                    isDisabled && "hidden"
                  )}
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5 backdrop-blur-[2px]">
                  Ref
                </div>
              </div>
            ))}
            {referenceImages.length < 1 && (
              <label className="group flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-md border border-dashed border-border bg-card hover:bg-accent hover:border-primary/50 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[8px] font-bold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isDisabled}
                  onChange={handleReferenceImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingRef(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingRef(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node))
              setIsDraggingRef(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingRef(false);
            fireFileInput(e.dataTransfer.files, handleReferenceImageUpload);
          }}
          className={cn(
            "group relative flex items-center gap-3 h-14 w-full rounded-md cursor-pointer select-none transition-all duration-200 active:scale-[0.98]",
            isDisabled
              ? "opacity-50 cursor-not-allowed bg-accent pointer-events-none"
              : isDraggingRef
                ? "bg-primary/5 border-primary ring-1 ring-primary"
                : "bg-card border border-dashed border-border hover:bg-accent hover:border-primary/50"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 shrink-0 ml-2",
            isDraggingRef
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-muted-foreground group-hover:text-primary"
          )}>
            <Upload className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs font-bold transition-colors duration-200 uppercase tracking-widest",
              isDraggingRef ? "text-primary" : "text-foreground"
            )}>
              {isDraggingRef ? "Drop Image" : "Add Reference"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
              Style guide
            </p>
          </div>
          
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={isDisabled}
            onChange={handleReferenceImageUpload}
          />
        </label>
      )}
    </div>
  );
}
