"use client";

import React from "react";
import { UserIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectImageSectionProps {
  isDisabled: boolean;
  characterImages: File[];
  characterImagePreviews: string[];
  handleCharacterImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCharacterImage: (index: number) => void;
}

export function SubjectImageSection({
  isDisabled,
  characterImages,
  characterImagePreviews,
  handleCharacterImageUpload,
  removeCharacterImage,
}: SubjectImageSectionProps) {
  const [isDraggingChar, setIsDraggingChar] = React.useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] lg:text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 lg:gap-2">
          <UserIcon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
          Subject (လူ/ပစ္စည်း) ပုံ
        </label>
        {characterImages.length > 0 && (
          <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 lg:px-2 py-0.5 rounded-sm">
            {characterImages.length} ပုံတင်ထားသည်
          </span>
        )}
      </div>

      {characterImages.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-row gap-1.5 flex-wrap">
            {characterImages.map((img, index) => (
              <div
                key={index}
                className="relative group w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-md border border-border bg-accent overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-sm"
                title={img?.name || `Subject ${index + 1}`}
              >
                <img
                  src={characterImagePreviews[index]}
                  alt={`Subject ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeCharacterImage(index)}
                  disabled={isDisabled}
                  className={cn(
                    "absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-red-500/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-md",
                    isDisabled && "hidden"
                  )}
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5 backdrop-blur-[2px]">
                  #{index + 1}
                </div>
              </div>
            ))}

            {characterImages.length < 4 && (
              <label className="group flex flex-col items-center justify-center gap-1 w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-md border border-dashed border-border bg-card hover:bg-accent hover:border-primary/50 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[8px] font-bold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isDisabled}
                  onChange={handleCharacterImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingChar(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingChar(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node))
              setIsDraggingChar(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingChar(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleCharacterImageUpload({ target: { files } } as any);
            }
          }}
          className={cn(
            "group relative flex items-center gap-3 h-14 w-full rounded-md cursor-pointer select-none transition-all duration-200 active:scale-[0.98]",
            isDisabled
              ? "opacity-50 cursor-not-allowed bg-accent pointer-events-none"
              : isDraggingChar
                ? "bg-primary/5 border-primary ring-1 ring-primary"
                : "bg-card border border-dashed border-border hover:bg-accent hover:border-primary/50"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 shrink-0 ml-2",
            isDraggingChar
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-muted-foreground group-hover:text-primary"
          )}>
            <Upload className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs font-bold transition-colors duration-200 uppercase tracking-widest",
              isDraggingChar ? "text-primary" : "text-foreground"
            )}>
              {isDraggingChar ? "Drop Image" : "Add Subject"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
              Max 4 images
            </p>
          </div>
          
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={isDisabled}
            onChange={handleCharacterImageUpload}
          />
        </label>
      )}
    </div>
  );
}
