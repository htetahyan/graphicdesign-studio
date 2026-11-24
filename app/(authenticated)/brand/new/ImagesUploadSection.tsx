"use client";

import React from "react";
import { ImageIcon, Upload, X } from "lucide-react";

interface ImagesUploadSectionProps {
  watchedImages: File[];
  isDraggingImages: boolean;
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImagesDragOver: (e: React.DragEvent) => void;
  handleImagesDragEnter: (e: React.DragEvent) => void;
  handleImagesDragLeave: (e: React.DragEvent) => void;
  handleImagesDrop: (e: React.DragEvent) => void;
  removeImage: (idx: number) => void;
}

export function ImagesUploadSection({
  watchedImages,
  isDraggingImages,
  handleImagesChange,
  handleImagesDragOver,
  handleImagesDragEnter,
  handleImagesDragLeave,
  handleImagesDrop,
  removeImage,
}: ImagesUploadSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
          Design Examples (DNA)
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border transition-all duration-300
              ${watchedImages.length > 0 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-muted text-muted-foreground border-border/80"}`}
          >
            {watchedImages.length}/5
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
            Optional
          </span>
        </div>
      </div>

      {/* Premium Styled Info Box */}
      <div className="bg-secondary/70 border border-border rounded-2xl p-4 shadow-sm">
        <p className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
          <span>🎨</span> Definitive Brand DNA
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 font-medium">
          Upload previous graphic designs, posters, or style guidelines. We extract <strong>color schemes, composition templates, and core typography rules</strong> to feed into the AI.
        </p>
      </div>

      <label
        onDragOver={handleImagesDragOver}
        onDragEnter={handleImagesDragEnter}
        onDragLeave={handleImagesDragLeave}
        onDrop={handleImagesDrop}
        className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none h-32 outline-none
          ${isDraggingImages
            ? "border-primary bg-secondary scale-[1.01] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            : "border-border bg-card hover:bg-secondary/60 hover:border-white/25 hover:shadow-md"
          }`}
      >
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleImagesChange}
          accept="image/*"
        />
        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border shadow-sm transition-transform duration-300 group-hover:scale-110 pointer-events-none">
          <Upload className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="text-center pointer-events-none">
          <p className="text-sm font-bold text-foreground">
            {isDraggingImages
              ? "ဒီမှာထည့်ပါ"
              : "အကိုးအကားရှိပါက design ပုံများတင်ပါ"}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">Up to 5 images (max 10MB per image)</p>
        </div>
      </label>

      {/* Uploaded Grid Preview with Micro Deletion Animations */}
      {watchedImages.length > 0 && (
        <div className="grid grid-cols-5 gap-2.5 pt-1.5 animate-in slide-in-from-bottom-2 duration-300">
          {watchedImages.map((file, idx) => (
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
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-5 h-5 text-white active:scale-90 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
