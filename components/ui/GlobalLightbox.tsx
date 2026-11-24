"use client"

import React, { useState } from "react"
import { useJobs } from "@/components/context/job-context"
import { PreviewModal } from "@/components/gallery/PreviewModal"
import { useUI } from "@/components/context/ui-context"

export function GlobalLightbox() {
  const { completedResult, setCompletedResult } = useJobs()
  const { showToast } = useUI()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [imageCache, setImageCache] = useState<Set<string>>(new Set())

  if (!completedResult) return null

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast("📋 Prompt ကို ကူးယူပြီးပါပြီ (Copied)", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (url: string, filename: string) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { downloadImage } = await import("@/lib/download");
      const result = await downloadImage(url, filename);
      const duration = result.toastType === "info" ? 5000 : 3000;
      showToast(result.toastMessage, result.toastType, duration);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showToast(`❌ ဒေါင်းလုဒ် မအောင်မြင်ပါ: ${errorMessage}`, "error", 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PreviewModal
      selectedGen={completedResult}
      closeModal={() => setCompletedResult(null)}
      copyPrompt={copyPrompt}
      isCopied={isCopied}
      handleDownload={handleDownload}
      isDownloading={isDownloading}
      imageCache={imageCache}
      setImageCache={setImageCache}
    />
  )
}
