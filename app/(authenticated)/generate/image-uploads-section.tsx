"use client";

import React from "react";
import { SubjectImageSection } from "./components/subject-image-section";
import { ReferenceImageSection } from "./components/reference-image-section";

interface ImageUploadsSectionProps {
  isDisabled: boolean;
  referenceImages: File[];
  referenceImagePreviews: string[];
  characterImages: File[];
  characterImagePreviews: string[];
  referenceInfluence: "normal" | "high";
  setReferenceInfluence: (value: "normal" | "high") => void;
  handleCharacterImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReferenceImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCharacterImage: (index: number) => void;
  removeReferenceImage: (index: number) => void;
}

export function ImageUploadsSection({
  isDisabled,
  referenceImages,
  referenceImagePreviews,
  characterImages,
  characterImagePreviews,
  referenceInfluence,
  setReferenceInfluence,
  handleCharacterImageUpload,
  handleReferenceImageUpload,
  removeCharacterImage,
  removeReferenceImage,
}: ImageUploadsSectionProps) {
  return (
    <div className="space-y-2.5 lg:space-y-3">
      {/* ── Subject & Reference Images Row (Desktop) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SubjectImageSection
          isDisabled={isDisabled}
          characterImages={characterImages}
          characterImagePreviews={characterImagePreviews}
          handleCharacterImageUpload={handleCharacterImageUpload}
          removeCharacterImage={removeCharacterImage}
        />

        <ReferenceImageSection
          isDisabled={isDisabled}
          referenceImages={referenceImages}
          referenceImagePreviews={referenceImagePreviews}
          handleReferenceImageUpload={handleReferenceImageUpload}
          removeReferenceImage={removeReferenceImage}
        />
      </div>
    </div>
  );
}