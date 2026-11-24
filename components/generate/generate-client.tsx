"use client";


import { ChevronLeft, ChevronRight, CreditCard, Wand2 } from "lucide-react";
import Link from "next/link";

import { useUI } from "@/components/context/ui-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GenerateForm from "@/app/(authenticated)/generate/generate-form";
import type { User, Brand } from "@/app/(authenticated)/generate/types";

interface GenerateClientProps {
  user: User;
  brands: Brand[];
  initialSessionId?: string | null;
}

export function GenerateClient({ user, brands, initialSessionId = null }: GenerateClientProps) {
  const { openSidebar } = useUI();

  return (
    <div className="flex flex-col h-dvh max-h-dvh overflow-hidden bg-background text-foreground selection:bg-primary/20">
      {/* Sleek Grok Top Bar */}
      <div className="shrink-0 relative w-full z-20 safe-area-top border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <header className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary flex items-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <h1 className="font-semibold text-base tracking-tight text-foreground leading-none">
                Design Studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/recharge"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/90 border border-border hover:bg-accent transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">{user?.credits ?? 0}</span>
              <span className="text-[10px] text-muted-foreground font-medium">credits</span>
            </Link>

            <button
              onClick={openSidebar}
              className="h-9 w-9 rounded-full border border-border bg-secondary p-0.5 flex items-center justify-center overflow-hidden hover:border-foreground/30 transition-all active:scale-95"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user?.username}&background=14141a&color=fff&bold=true`}
                alt="User"
                className="h-full w-full object-cover rounded-full"
              />
            </button>
          </div>
        </header>
      </div>

      <ErrorBoundary>
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {brands.length > 0 ? (
            <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
              <GenerateForm user={user} brands={brands} initialSessionId={initialSessionId} />
            </div>
          ) : (
            <div className="flex-1 flex w-full">
              {/* Asymmetrical Minimalist Design */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-8 lg:py-0 border-r border-border bg-background z-10">
                <div className="max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-sm border border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ပြင်ဆင်ရန်လိုအပ်သည် (Setup Required)</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-serif tracking-tight leading-tight text-foreground">
                      သင်၏ Brand Profile ကို <br />အရင်ဖန်တီးပါ။
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-[340px]">
                      Brand နှင့် ကိုက်ညီသော Design များဖန်တီးရန်၊ သင်၏ Brand အရောင်၊ လိုဂို နှင့် အချက်အလက်များကို AI မှ သိရှိရန်လိုအပ်ပါသည်။
                    </p>
                  </div>

                  <Link
                    href="/brand/new"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
                  >
                    <span>Brand Profile ဖန်တီးမည်</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border">
                    {[
                      { label: "Design System", hint: "သင်၏ Brand အချက်အလက်များကို ချိတ်ဆက်ပါ" },
                      { label: "AI Intelligence", hint: "အလိုအလျောက် Style ချိန်ညှိမှု" }
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right decorative area */}
              <div className="hidden lg:flex w-1/2 bg-accent relative overflow-hidden items-center justify-center">
                <div className="w-48 h-48 rounded-md border border-border bg-background shadow-sm flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-700">
                  <Wand2 className="w-16 h-16 text-muted-foreground/20 stroke-[1]" />
                </div>
              </div>
            </div>
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
}