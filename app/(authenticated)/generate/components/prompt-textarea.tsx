"use client";

import React from "react";
import { Wand2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDATION_LIMITS } from "@/components/generate/schema";
import type { FormValidationErrors } from "@/components/generate/schema";

interface PromptTextareaProps {
  localPrompt: string;
  setLocalPrompt: (val: string) => void;
  isInputDisabled: boolean;
  formErrors: FormValidationErrors;
  clearFieldError: (field: keyof FormValidationErrors) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function PromptTextarea({
  localPrompt,
  setLocalPrompt,
  isInputDisabled,
  formErrors,
  clearFieldError,
  textareaRef,
}: PromptTextareaProps) {
  const promptCharCount = localPrompt.length;
  const isPromptNearLimit = promptCharCount > VALIDATION_LIMITS.PROMPT_MAX_LENGTH * 0.9;
  const isPromptOverLimit = promptCharCount > VALIDATION_LIMITS.PROMPT_MAX_LENGTH;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          className={cn(
            "text-xs font-bold uppercase tracking-wider flex items-center gap-2",
            formErrors.prompt ? "text-red-600" : "text-foreground/80",
          )}
        >
          <Wand2 className="w-4 h-4 text-primary" /> Prompt
        </label>
        <span
          className={cn(
            "text-xs font-mono",
            isPromptOverLimit
              ? "text-red-600 font-bold"
              : isPromptNearLimit
              ? "text-amber-600 font-medium"
              : "text-muted-foreground",
          )}
        >
          {promptCharCount}
          {isPromptNearLimit && `/${VALIDATION_LIMITS.PROMPT_MAX_LENGTH}`}
        </span>
      </div>
      <div className="relative group">
        <textarea
          ref={textareaRef as unknown as React.RefObject<HTMLTextAreaElement>}
          value={localPrompt}
          onChange={(e) => {
            setLocalPrompt(e.target.value);
            if (formErrors.prompt) clearFieldError("prompt");
          }}
          disabled={isInputDisabled}
          rows={4}
          className={cn(
            "w-full bg-background rounded-xl px-4 py-3.5 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none shadow-xs transition-all leading-relaxed resize-none min-h-[110px]",
            formErrors.prompt
              ? "border-2 border-red-400 focus:ring-1 focus:ring-red-100"
              : "border border-border focus:border-primary focus:ring-1 focus:ring-primary",
          )}
          placeholder="Describe your design vision here (Burmese or English)..."
        />
        {localPrompt && (
          <button
            disabled={isInputDisabled}
            onClick={() => setLocalPrompt("")}
            className="absolute top-2.5 right-2.5 h-6 w-6 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {formErrors.prompt && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {formErrors.prompt}
        </p>
      )}
    </div>
  );
}
