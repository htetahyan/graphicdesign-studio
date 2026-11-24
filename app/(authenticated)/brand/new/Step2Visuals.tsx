"use client";

import React from "react";
import {
  Plus,
  X,
  ImagePlus,
  Check,
  Upload,
  AlertCircle,
} from "lucide-react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import type { BrandFormValues } from "./types";
import { ImagesUploadSection } from "./ImagesUploadSection";

interface Step2VisualsProps {
  watchedLogo: File | null;
  watchedImages: File[];
  errors: FieldErrors<BrandFormValues>;
  isDraggingLogo: boolean;
  isDraggingImages: boolean;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoDragOver: (e: React.DragEvent) => void;
  handleLogoDragEnter: (e: React.DragEvent) => void;
  handleLogoDragLeave: (e: React.DragEvent) => void;
  handleLogoDrop: (e: React.DragEvent) => void;
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImagesDragOver: (e: React.DragEvent) => void;
  handleImagesDragEnter: (e: React.DragEvent) => void;
  handleImagesDragLeave: (e: React.DragEvent) => void;
  handleImagesDrop: (e: React.DragEvent) => void;
  removeImage: (idx: number) => void;
  setValue: UseFormSetValue<BrandFormValues>;
}

export function Step2Visuals({
  watchedLogo,
  watchedImages,
  errors,
  isDraggingLogo,
  isDraggingImages,
  handleLogoChange,
  handleLogoDragOver,
  handleLogoDragEnter,
  handleLogoDragLeave,
  handleLogoDrop,
  handleImagesChange,
  handleImagesDragOver,
  handleImagesDragEnter,
  handleImagesDragLeave,
  handleImagesDrop,
  removeImage,
  setValue,
}: Step2VisualsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Premium Header */}
      <div className="flex items-center gap-4.5 pb-2 border-b border-border/25">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ImagePlus className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
            Visual Assets
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
            Logo &amp; brand design examples
          </p>
        </div>
      </div>

      {/* ── Logo Upload Card ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Brand Logo *
          </label>
          {watchedLogo && (
            <span className="text-[10px] font-bold text-foreground bg-secondary border border-border px-3 py-1 rounded-full flex items-center gap-1.5 animate-in zoom-in-75">
              <Check className="w-3 h-3 text-foreground" strokeWidth={3} />
              Uploaded Successfully
            </span>
          )}
        </div>

        <label
          onDragOver={handleLogoDragOver}
          onDragEnter={handleLogoDragEnter}
          onDragLeave={handleLogoDragLeave}
          onDrop={handleLogoDrop}
          className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group block h-28 outline-none
            ${isDraggingLogo
              ? "border-primary bg-secondary scale-[1.01] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
              : watchedLogo
                ? "border-border bg-card"
                : "border-border bg-card hover:border-white/25 hover:bg-secondary/60 hover:shadow-md"
            }`}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleLogoChange}
            accept="image/*"
          />

          {watchedLogo ? (
            <>
              <img
                src={URL.createObjectURL(watchedLogo)}
                alt="Logo"
                className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1.5">
                  <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Upload className="w-5 h-5 text-foreground" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Replace Logo</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue("logo", null);
                }}
                className="absolute top-3 right-3 h-7 w-7 bg-secondary/90 hover:bg-secondary text-foreground border border-border rounded-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-1px]">
              <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Plus className="w-5.5 h-5.5" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {isDraggingLogo ? "ဒီမှာထည့်ပါ" : "Logo တင်ရန် နှိပ်ပါ"}
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">
                  PNG, SVG, or JPG
                </p>
              </div>
            </div>
          )}
        </label>

        {errors.logo && (
          <p className="text-xs text-red-500 font-bold flex items-center gap-1.5 pt-0.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.logo.message as string}
          </p>
        )}
      </div>

      {/* ── Brand Design Images (Reference DNA) ── */}
      <ImagesUploadSection
        watchedImages={watchedImages}
        isDraggingImages={isDraggingImages}
        handleImagesChange={handleImagesChange}
        handleImagesDragOver={handleImagesDragOver}
        handleImagesDragEnter={handleImagesDragEnter}
        handleImagesDragLeave={handleImagesDragLeave}
        handleImagesDrop={handleImagesDrop}
        removeImage={removeImage}
      />
    </div>
  );
}
