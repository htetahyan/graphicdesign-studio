"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { VALIDATION_LIMITS } from "@/components/generate/schema";
import type { User } from "../types";

interface GenerateFooterProps {
  user: User;
  isOffline: boolean;
  isPending: boolean;
  handleGenerate: () => void;
  totalCost: number;
  modelTier: "normal" | "pro";
  setModelTier: (tier: "normal" | "pro") => void;
  isInputDisabled?: boolean;
}

export function GenerateFooter({
  user,
  isOffline,
  isPending,
  handleGenerate,
  totalCost,
}: GenerateFooterProps) {
  const credits = user?.credits ?? 0;
  const hasEnoughCredits = credits >= totalCost;

  return (
    <div className="shrink-0 p-6 bg-background/90 backdrop-blur-md border-t border-border space-y-4">
      {isOffline && (
        <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <p className="text-xs font-bold text-red-700 dark:text-red-400">Offline — reconnecting...</p>
        </div>
      )}

      {!hasEnoughCredits && !isOffline && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />{" "}
            Low Balance ({credits}/{totalCost} Credits)
          </p>
          <Link
            href="/recharge"
            className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline underline-offset-4"
          >
            Recharge
          </Link>
        </div>
      )}

      <Button
        onClick={() => {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
          handleGenerate();
        }}
        disabled={isPending || !hasEnoughCredits || isOffline}
        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base font-extrabold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? (
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Design...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Generate Design (-{totalCost} Credits)</span>
          </div>
        )}
      </Button>
    </div>
  );
}
