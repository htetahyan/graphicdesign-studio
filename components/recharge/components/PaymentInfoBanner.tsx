import React from "react";
import { CreditCard } from "lucide-react";

export function PaymentInfoBanner() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-lg text-foreground relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="flex items-center gap-4">
        <div className="bg-secondary p-3 rounded-xl border border-border">
          <CreditCard className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Payment</h2>
          <p className="text-sm font-bold text-foreground">Pay in AED, then upload your receipt below.</p>
        </div>
      </div>

      <div className="bg-secondary/80 border border-border p-3 rounded-xl text-[11px] font-bold text-muted-foreground max-w-xs">
        <p className="mb-1">1. Choose a package and complete payment.</p>
        <p className="mb-0">2. Upload the receipt screenshot and submit.</p>
      </div>
    </div>
  );
}
