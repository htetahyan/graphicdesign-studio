"use client";

import React from "react";
import { Building2, Check, AlertCircle } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { INDUSTRIES } from "./constants";
import type { BrandFormValues } from "./types";

interface Step1BasicsProps {
  register: UseFormRegister<BrandFormValues>;
  errors: FieldErrors<BrandFormValues>;
  selectedIndustry: string | null;
  setSelectedIndustry: (id: string) => void;
  setValue: UseFormSetValue<BrandFormValues>;
}

export function Step1Basics({
  register,
  errors,
  selectedIndustry,
  setSelectedIndustry,
  setValue,
}: Step1BasicsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Premium Header */}
      <div className="flex items-center gap-4.5 pb-2 border-b border-border/25">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Building2 className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
            Brand Basics
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">Name &amp; industry</p>
        </div>
      </div>

      {/* Brand Name Input Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
          Brand Name *
        </label>
        <div className="relative group">
          <FloatingInput
            {...register("name")}
            label="e.g. Golden Myanmar Restaurant"
            placeholder=" "
            className={`bg-secondary border-border text-foreground border h-13 rounded-2xl transition-all duration-300 font-medium px-4 shadow-sm w-full
              ${errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-border focus:border-primary focus:ring-4 focus:ring-white/10 hover:border-border-hover"
              }`}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-400 font-bold flex items-center gap-1.5 animate-in fade-in pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.name.message as string}
          </p>
        )}
      </div>

      {/* Industry grid selection with premium micro-interactions */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
          Industry *
        </label>

        <div className="grid grid-cols-2 gap-3.5">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            const isSelected = selectedIndustry === industry.id;

            return (
              <button
                key={industry.id}
                type="button"
                onClick={() => {
                  setSelectedIndustry(industry.id);
                  setValue("industry", industry.id);
                }}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] outline-none
                  ${isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-white/15"
                    : "bg-card border-border text-foreground hover:bg-secondary hover:border-white/25 hover:shadow-md shadow-sm"
                  }`}
              >
                {/* Circle Icon Indicator with glow */}
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${isSelected ? "bg-black/10" : "bg-secondary"}`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110
                      ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                </div>

                {/* Typography hierarchy details */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-bold leading-snug transition-colors duration-300 ${isSelected ? "text-primary-foreground font-extrabold" : "text-foreground"
                      }`}
                  >
                    {industry.label}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 leading-tight transition-colors duration-300 ${isSelected ? "text-primary-foreground/80 font-medium" : "text-muted-foreground font-medium"
                      }`}
                  >
                    {industry.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 h-5 w-5 bg-primary-foreground text-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!selectedIndustry && (
          <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5 font-semibold pt-1 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" />
            Select an industry to continue
          </p>
        )}
      </div>
    </div>
  );
}
