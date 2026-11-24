"use client";

import Link from "next/link";
import { Wand2, Sparkles, Target, Type, Zap } from "lucide-react";
import { useGenerateForm } from "./use-generate-form";
import { GenerateChat } from "./generate-chat";
import type { GenerateFormProps } from "./types";

export default function GenerateForm({ user, brands, initialSessionId }: GenerateFormProps) {
  const formHook = useGenerateForm({ user, brands, initialSessionId });

  if (brands.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            <div className="relative h-24 w-24 rounded-2xl bg-secondary border border-border shadow-xl flex items-center justify-center transform transition-all duration-700 ease-out group-hover:-translate-y-1">
              <Wand2 className="w-10 h-10 text-foreground stroke-[1.5]" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              သင်၏ Brand Profile ကို <br />အရင်ဖန်တီးပါ။
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
              Brand နှင့် ကိုက်ညီသော AI Marketing Design များဖန်တီးရန် သင်၏ Brand အချက်အလက်များကို အရင်သတ်မှတ်ပေးပါ။
            </p>
          </div>

          <Link
            href="/brand/new"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            <span>Brand Profile ဖန်တီးမည်</span>
            <Sparkles className="w-4 h-4" />
          </Link>

          <div className="pt-8 grid grid-cols-3 gap-8 w-full max-w-sm mx-auto border-t border-border">
            {[
              { icon: Target, label: "Identity", desc: "Colors" },
              { icon: Type, label: "Type", desc: "Fonts" },
              { icon: Zap, label: "AI", desc: "Smart" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-1.5">
                <item.icon className="w-4 h-4 text-muted-foreground mb-0.5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
      <GenerateChat
        user={user}
        brands={brands}
        state={formHook.state}
        refs={formHook.refs}
        setters={formHook.setters}
        handlers={formHook.handlers}
      />
    </div>
  );
}