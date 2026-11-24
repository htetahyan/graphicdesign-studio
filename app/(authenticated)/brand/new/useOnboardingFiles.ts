"use client";

import { useState, Dispatch, SetStateAction } from "react";

interface UseOnboardingFilesProps {
  logo: File | null;
  setLogo: Dispatch<SetStateAction<File | null>>;
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  referenceImages: File[];
  setReferenceImages: Dispatch<SetStateAction<File[]>>;
}

export function useOnboardingFiles({
  logo,
  setLogo,
  images,
  setImages,
  referenceImages,
  setReferenceImages,
}: UseOnboardingFilesProps) {
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingRefImages, setIsDraggingRefImages] = useState(false);

  // --- Logo Handlers ---
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
    }
  };
  const handleLogoDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/"),
    );
    if (file) setLogo(file);
  };
  const handleLogoDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };
  const handleLogoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
  };

  // --- Images Handlers ---
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };
  const handleImagesDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleImagesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!dropped.length) return;
    setImages((prev) => [...prev, ...dropped].slice(0, 5));
  };
  const handleImagesDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(true);
  };
  const handleImagesDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(false);
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Reference Images Handlers ---
  const handleRefImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setReferenceImages((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };
  const handleRefImagesDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleRefImagesDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRefImages(true);
  };
  const handleRefImagesDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRefImages(false);
  };
  const handleRefImagesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRefImages(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!dropped.length) return;
    setReferenceImages((prev) => [...prev, ...dropped].slice(0, 5));
  };
  const removeRefImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    isDraggingLogo,
    isDraggingImages,
    isDraggingRefImages,
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
    handleRefImagesChange,
    handleRefImagesDragOver,
    handleRefImagesDragEnter,
    handleRefImagesDragLeave,
    handleRefImagesDrop,
    removeRefImage,
  };
}
