import { Capacitor } from "@capacitor/core";
import { logger } from "./logger";
import { downloadImageNative } from "./download-native";

export type DownloadResult = {
  method: "web-download" | "gallery-direct" | "share-fallback";
  toastMessage: string;
  toastType: "success" | "info" | "warning" | "error";
};

export async function downloadImage(
  imageUrl: string,
  filename: string,
): Promise<DownloadResult> {
  if (!Capacitor.isNativePlatform()) {
    await downloadImageWeb(imageUrl, filename);
    return {
      method: "web-download",
      toastMessage: "✅ ဒေါင်းလုဒ် ပြီးပါပြီ",
      toastType: "success",
    };
  }
  return downloadImageNative(imageUrl, filename);
}

// ─── Web ─────────────────────────────────────────────────────────────────────

async function downloadImageWeb(
  imageUrl: string,
  filename: string,
): Promise<void> {
  const fullFilename = normalizeFilename(filename, "png");

  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      const blob = await response.blob();
      if (blob && blob.size > 0) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fullFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return;
      }
    }
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  } catch (fetchError) {
    logger.warn("[download] Direct fetch failed, trying canvas fallback", { error: fetchError });
  }

  try {
    const blob = await downloadViaCanvas(imageUrl, fullFilename);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return;
    }
  } catch (canvasError) {
    logger.warn("[download] Canvas fallback failed", { error: canvasError });
  }

  window.open(imageUrl, "_blank");
}

function downloadViaCanvas(imageUrl: string, filename: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob returned null"));
          }
        }, "image/png");
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error("Image load failed - likely CORS blocked"));
    };

    img.src = imageUrl;
  });
}

function normalizeFilename(filename: string, defaultExt: string): string {
  if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".mp4")) {
    return filename;
  }
  return `${filename}.${defaultExt}`;
}

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}
