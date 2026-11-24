"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X, Download, Loader2 } from "lucide-react";
import type { GenerateResult } from "../types";

interface PreviewLightboxProps {
  isOpen: boolean;
  result: GenerateResult | null;
  onClose: () => void;
  handleDownload: (res?: GenerateResult) => Promise<void>;
  isDownloading: boolean;
}

export function PreviewLightbox({
  isOpen,
  result,
  onClose,
  handleDownload,
  isDownloading,
}: PreviewLightboxProps) {
  if (!isOpen || !result || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-background/98 flex items-center justify-center animate-in fade-in duration-300"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button
          className="w-11 h-11 bg-secondary/90 backdrop-blur-md border border-border rounded-full flex items-center justify-center text-foreground transition-all hover:bg-accent active:scale-95 disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(result);
          }}
          disabled={isDownloading}
          title="Download HD"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </button>

        <button
          className="w-11 h-11 bg-secondary/90 backdrop-blur-md border border-border rounded-full flex items-center justify-center text-foreground transition-all hover:bg-accent active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {result.result_url.endsWith(".mp4") ? (
        <video
          src={result.result_url}
          autoPlay
          loop
          controls
          className="max-w-[95vw] max-h-[90vh] object-contain rounded-md shadow-2xl border border-border animate-in zoom-in-[0.98] duration-500"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          src={result.result_url}
          className="max-w-[95vw] max-h-[90vh] object-contain rounded-md shadow-2xl border border-border animate-in zoom-in-[0.98] duration-500"
          alt="Generated design — full view"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>,
    document.body
  );
}
