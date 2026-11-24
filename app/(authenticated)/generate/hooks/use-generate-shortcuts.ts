import { useEffect } from "react";
import type { GenerateResult } from "../types";

interface UseGenerateShortcutsProps {
  isPending: boolean;
  prompt: string;
  selectedBrandId: string;
  result: GenerateResult | null;
  handleGenerate: () => void;
  clearResult: () => void;
}

export function useGenerateShortcuts({
  isPending,
  prompt,
  selectedBrandId,
  result,
  handleGenerate,
  clearResult,
}: UseGenerateShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isPending && prompt && selectedBrandId) handleGenerate();
      }
      if (e.key === "Escape" && result) {
        clearResult();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, prompt, selectedBrandId, result, handleGenerate, clearResult]);

  // Prevent unload while generating
  useEffect(() => {
    if (!isPending) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPending]);
}
