"use client";

import React from "react";
import { ImageIcon, Upload, X, AlertCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";
import type { BrandFormValues } from "./types";

interface ReferenceUploadSectionProps {
  watchedReferenceImages: File[];
  errors: FieldErrors<BrandFormValues>;
  isDraggingRefImages: boolean;
  handleRefImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefImagesDragOver: (e: React.DragEvent) => void;
  handleRefImagesDragEnter: (e: React.DragEvent) => void;
  handleRefImagesDragLeave: (e: React.DragEvent) => void;
  handleRefImagesDrop: (e: React.DragEvent) => void;
  removeRefImage: (idx: number) => void;
}

export function ReferenceUploadSection({
  watchedReferenceImages,
  errors,
  isDraggingRefImages,
  handleRefImagesChange,
  handleRefImagesDragOver,
  handleRefImagesDragEnter,
  handleRefImagesDragLeave,
  handleRefImagesDrop,
  removeRefImage,
}: ReferenceUploadSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
          Reference Designs
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all duration-300
              ${watchedReferenceImages.length > 0 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-muted text-muted-foreground border-border/80"}`}
          >
            {watchedReferenceImages.length}/5
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
            Optional
          </span>
        </div>
      </div>

      <label
        onDragOver={handleRefImagesDragOver}
        onDragEnter={handleRefImagesDragEnter}
        onDragLeave={handleRefImagesDragLeave}
        onDrop={handleRefImagesDrop}
        className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none h-32 outline-none
          ${isDraggingRefImages
            ? "border-primary bg-secondary scale-[1.01] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            : "border-border bg-card hover:bg-secondary/60 hover:border-white/25 hover:shadow-md"
          }`}
      >
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleRefImagesChange}
          accept="image/*"
        />
        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border shadow-sm transition-transform duration-300 group-hover:scale-110 pointer-events-none">
          <Upload className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="text-center pointer-events-none">
          <p className="text-sm font-bold text-foreground">
            {isDraggingRefImages ? "ဒီမှာထည့်ပါ" : "သင်ကြိုက်သော designပုံများ တင်ပါ"}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">Layout and style only. Up to 5 images</p>
        </div>
      </label>

      {/* Uploaded Ref Previews */}
      {watchedReferenceImages.length > 0 && (
        <div className="grid grid-cols-5 gap-2.5 pt-1.5 animate-in slide-in-from-bottom-2 duration-300">
          {watchedReferenceImages.map((file, idx) => (
            <div
              key={idx}
              className="aspect-square relative rounded-xl overflow-hidden border border-border/60 group bg-muted/40 hover:shadow-md transition-shadow"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Ref ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button
                type="button"
                onClick={() => removeRefImage(idx)}
                className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-5 h-5 text-white active:scale-90 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}

      {errors.referenceImages && (
        <p className="text-xs text-red-500 font-bold flex items-center gap-1.5 pt-0.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errors.referenceImages.message as string}
        </p>
      )}
    </div>
  );
}
