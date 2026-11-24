"use client";

import { cn } from "@/lib/utils";

export function ModelSpeedBar({
  speed,
  setSpeed,
  disabled = false,
}: {
  modelTier?: "normal" | "pro";
  setModelTier?: (tier: "normal" | "pro") => void;
  speed: "slow" | "normal";
  setSpeed: (s: "slow" | "normal") => void;
  disabled?: boolean;
}) {
  return (
    <div className="shrink-0 z-20 w-full px-4 py-3 bg-background border-b border-border space-y-2">
      <p className="text-[11px] font-bold text-foreground/80">
        Render speed
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setSpeed("slow")}
          className={cn(
            "h-10 rounded-xl border text-xs font-bold transition-all",
            speed === "slow"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:bg-muted/50",
          )}
        >
          Flex · 7c
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setSpeed("normal")}
          className={cn(
            "h-10 rounded-xl border text-xs font-bold transition-all",
            speed === "normal"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:bg-muted/50",
          )}
        >
          Fast · 10c
        </button>
      </div>
    </div>
  );
}
