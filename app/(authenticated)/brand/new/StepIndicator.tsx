"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Check,
  Building2,
  ImagePlus,
  Lightbulb,
  ClipboardCheck,
} from "lucide-react";

const STEPS = [
  { id: 1, titleMy: "အခြေခံ", icon: Building2 },
  { id: 2, titleMy: "ပုံများ", icon: ImagePlus },
  { id: 3, titleMy: "Inspiration", icon: Lightbulb },
  { id: 4, titleMy: "စစ်ဆေး", icon: ClipboardCheck },
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <>
      {/* Header with high-end glassmorphism and subtle border blur */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
        <div className="relative flex items-center justify-between px-4 pt-10 pb-4 max-w-2xl mx-auto">
          <Link
            href="/gallery"
            className="p-2.5 -ml-3 text-muted-foreground hover:text-foreground transition-all rounded-xl active:scale-95 active:bg-accent/40 hover:bg-accent/20"
            aria-label="Back to Gallery"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <h1 className="font-serif text-lg font-bold text-foreground tracking-tight text-center absolute left-1/2 -translate-x-1/2">
            Brand ဖန်တီးရန်
          </h1>
          <div className="w-10" />
        </div>

        {/* Premium multi-stop gradient progress bar with micro-glow */}
        <div className="h-1 bg-border/20 w-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#818cf8] via-[#6366f1] to-[#a855f7] transition-all duration-700 ease-out rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Steps Pill Bar with premium glass card background */}
      <div className="bg-background/60 backdrop-blur-md border-b border-border/30 px-4 py-5 shadow-sm relative z-20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isLast = idx === STEPS.length - 1;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-2">
                  {/* Circle with premium glows and active scaling */}
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 border relative
                      ${isActive
                        ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10 scale-110 z-10"
                        : isCompleted
                          ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                          : "bg-muted/40 text-muted-foreground/60 border-border/40"
                      }`}
                  >
                    {/* Glowing pulse effect behind the active step */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-foreground/20 animate-ping opacity-75 pointer-events-none scale-105" />
                    )}

                    {isCompleted ? (
                      <Check className="w-4.5 h-4.5" strokeWidth={3} />
                    ) : (
                      <Icon className="w-4 h-4 transition-transform duration-300" />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`text-[9px] font-black uppercase tracking-widest leading-none transition-colors duration-300
                      ${isActive
                        ? "text-foreground font-extrabold"
                        : isCompleted
                          ? "text-foreground/70 font-semibold"
                          : "text-muted-foreground/50 font-medium"
                      }`}
                  >
                    {step.titleMy}
                  </p>
                </div>

                {/* Smooth Gradient Connector line */}
                {!isLast && (
                  <div className="flex-1 mx-2 mb-5 h-[2px] rounded-full overflow-hidden bg-muted/40">
                    <div
                      className={`h-full transition-all duration-700 ease-in-out rounded-full
                        ${isCompleted 
                          ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8]" 
                          : "bg-transparent w-0"}`}
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
