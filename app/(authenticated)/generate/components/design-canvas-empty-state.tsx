"use client";

import React from "react";
import { Wand2, Palette, Layers, Sparkles, Zap } from "lucide-react";

export function DesignCanvasEmptyState() {
  return (
    <div className="flex flex-col items-center text-center gap-10 max-w-lg mx-auto py-12 px-4 select-none relative">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-gradient-to-tr from-primary/10 via-purple-500/5 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-10000" />
      
      {/* Floating High-Fidelity Glassmorphic Mockup Deck */}
      <div className="relative w-44 h-44 flex items-center justify-center group cursor-pointer">
        {/* Rear Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-xl opacity-40 scale-90 group-hover:scale-110 transition-all duration-700" />
        
        {/* Layer 3 - Back Deck */}
        <div className="absolute w-32 h-32 bg-background/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 dark:border-white/5 transform rotate-12 translate-x-8 -translate-y-3 opacity-30 transition-all duration-500 group-hover:rotate-[18deg] group-hover:translate-x-10 group-hover:-translate-y-5" />
        
        {/* Layer 2 - Middle Deck */}
        <div className="absolute w-32 h-32 bg-background/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-white/10 transform -rotate-12 -translate-x-8 translate-y-3 opacity-65 transition-all duration-500 group-hover:-rotate-[18deg] group-hover:-translate-x-10 group-hover:translate-y-5" />

        {/* Layer 1 - Front Active Deck */}
        <div className="relative z-10 h-36 w-32 rounded-2xl bg-gradient-to-b from-background/90 to-background/50 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center transform transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-primary/40">
          <div className="relative p-4 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
            <Wand2 className="w-8 h-8 stroke-[1.5] animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 animate-bounce duration-3000" />
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>

      {/* Elegant Typography & Welcome Copy */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h3 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground font-serif">
          Creative Design Canvas
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mx-auto font-sans font-medium">
          Select your brand context, customize speed, quality, and input your prompt to watch your masterpiece render in real-time.
        </p>
      </div>

      {/* Feature Badges with Premium Micro-Animations */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap opacity-80 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        {[
          { icon: Palette, text: "Brand Identity", color: "hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400" },
          { icon: Layers, text: "Smart Layout", color: "hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400" },
          { icon: Zap, text: "AI Generation", color: "hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400" },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/80 text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground shadow-sm transition-all duration-300 transform hover:scale-105 cursor-default ${item.color}`}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
