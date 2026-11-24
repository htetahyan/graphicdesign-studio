"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ChevronRight, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditsHeroProps {
  user: any;
}

export function CreditsHero({ user }: CreditsHeroProps) {
  const credits = user?.credits ?? 0;
  const isLowCredits = credits <= 3;

  return (
    <section
      className={cn(
        "imaging-rise rounded-3xl px-5 sm:px-6 py-5 relative border overflow-hidden bg-[#0e0e13] shadow-[0_16px_50px_rgba(0,0,0,0.28)]",
        isLowCredits ? "border-red-500/30" : "border-border",
      )}
    >
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div
            className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center border",
              isLowCredits
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-secondary border-border text-foreground",
            )}
          >
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              လက်ကျန်ငွေ (Balance)
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-semibold tracking-tight text-foreground">
                {credits}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Credit ကျန်ရှိမှု
              </div>
            </div>
            {credits <= 20 && (
              <p className="text-xs font-bold text-red-400 pt-1">
                သင့် Credit လက်ကျန်နည်းနေပါသည်။ ဆက်လက်ဖန်တီးရန် Credit ဖြည့်တင်းပေးပါ။
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/recharge"
            className={cn(
              "group inline-flex items-center justify-center h-12 px-6 sm:px-8 rounded-full text-sm font-semibold transition-all active:scale-[0.98] whitespace-nowrap",
              isLowCredits
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90",
            )}
          >
            Credit ဖြည့်မည်
            <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/generate"
            className="group relative inline-flex items-center justify-center h-12 px-4 sm:px-6 rounded-full text-sm font-semibold transition-all border border-white/10 bg-white/[0.04] text-foreground hover:bg-white/[0.08] active:scale-[0.98] w-full"
          >
            <span className="absolute left-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Wand2 className="w-3.5 h-3.5" />
            </span>
            <span className="pl-8 pr-3 tracking-wide">Design အသစ်ဖန်တီးမည်</span>
            <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
