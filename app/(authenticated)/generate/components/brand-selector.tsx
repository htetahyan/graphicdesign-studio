"use client";

import React from "react";
import { Target, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand } from "../types";
import type { FormValidationErrors } from "@/components/generate/schema";

interface BrandSelectorProps {
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  brands: Brand[];
  isPending: boolean;
  formErrors: FormValidationErrors;
  clearFieldError: (field: keyof FormValidationErrors) => void;
}

export function BrandSelector({
  selectedBrandId,
  setSelectedBrandId,
  brands,
  isPending,
  formErrors,
  clearFieldError,
}: BrandSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        className={cn(
          "text-xs font-bold uppercase tracking-wider flex items-center gap-2",
          formErrors.brandId ? "text-red-600" : "text-foreground/80",
        )}
      >
        <Target className="w-4 h-4 text-primary" />
        Brand
      </label>
      <Select
        value={selectedBrandId}
        onValueChange={(value) => {
          setSelectedBrandId(value);
          clearFieldError("brandId");
        }}
        disabled={isPending || brands.length === 0}
      >
        <SelectTrigger
          className={cn(
            "h-12 rounded-xl bg-background border-border/80 shadow-xs px-3.5",
            formErrors.brandId && "border-red-400 ring-1 ring-red-100",
          )}
        >
          <SelectValue>
            {selectedBrandId && brands.find((b) => b.id === selectedBrandId) ? (
              <div className="flex items-center gap-2.5">
                {(() => {
                  const brand = brands.find((b) => b.id === selectedBrandId);
                  return brand?.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-6 w-6 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">
                        {brand?.name?.substring(0, 2) || "B"}
                      </span>
                    </div>
                  );
                })()}
                <span className="text-sm font-semibold">
                  {brands.find((b) => b.id === selectedBrandId)?.name}
                </span>
              </div>
            ) : (
              "Select brand"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-md shadow-lg border-border">
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id} className="rounded-sm">
              <div className="flex items-center gap-2">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-5 w-5 rounded-sm object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-sm bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {brand.name?.substring(0, 2) || "B"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{brand.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formErrors.brandId && (
        <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1 animate-in fade-in">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {formErrors.brandId}
        </p>
      )}
    </div>
  );
}
