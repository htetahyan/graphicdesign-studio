"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

interface TemplateGridItemProps {
  template: any;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function TemplateGridItem({ template, isSelected, onToggle }: TemplateGridItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      onClick={() => onToggle(template.id)}
      className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98] outline-none group
        ${isSelected
          ? "border-primary shadow-xl scale-[1.01]"
          : "border-border/60 hover:border-border-hover hover:shadow-md shadow-sm"
        }`}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse">
          <div className="w-full h-full bg-gradient-to-t from-muted/50 to-muted/10 opacity-60" />
        </div>
      )}
      <img
        src={template.imageUrl}
        alt={template.name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        style={{ opacity: isLoaded ? 1 : 0 }}
        loading="lazy"
        decoding="async"
        onLoad={handleImageLoad}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-white text-xs font-extrabold line-clamp-2 leading-snug">
          {template.name}
        </p>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 h-6.5 w-6.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-in zoom-in-75">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
