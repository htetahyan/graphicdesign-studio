import { useState, useCallback } from "react";
import type { GenerateResult } from "../types";

export function useGenerateDownload(
  showToast: (msg: string, type: "success" | "error" | "info" | "warning", duration?: number) => void
) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(
    async (currentResult: GenerateResult | null) => {
      if (!currentResult?.result_url) {
        showToast("ဒေါင်းလုဒ် လုပ်ရန် ပုံ မရှိသေးပါ", "error");
        return;
      }
      if (isDownloading) return;
      setIsDownloading(true);

      try {
        const { downloadImage } = await import("@/lib/download");
        const filename = `design-${currentResult.id || Date.now()}`;
        const downloadResult = await downloadImage(
          currentResult.result_url,
          filename
        );
        const duration = downloadResult.toastType === "info" ? 5000 : 3000;
        showToast(
          downloadResult.toastMessage,
          downloadResult.toastType,
          duration
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[GenerateDownload] Download failed:", errorMessage);
        showToast(`❌ ဒေါင်းလုဒ် မအောင်မြင်ပါ: ${errorMessage}`, "error", 5000);
      } finally {
        setIsDownloading(false);
      }
    },
    [showToast, isDownloading]
  );

  return { isDownloading, handleDownload };
}
