"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface BottomNavigationProps {
  currentStep: number;
  totalSteps: number;
  isPending: boolean;
  watchedName: string;
  watchedLogo: File | null;
  watchedImages: File[];
  selectedIndustry: string | null;
  watchedInspirationTemplateIds: string[];
  serverError?: string | null;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function BottomNavigation({
  currentStep,
  totalSteps,
  isPending,
  watchedName,
  watchedLogo,
  watchedImages,
  selectedIndustry,
  watchedInspirationTemplateIds,
  serverError,
  onBack,
  onNext,
  onSubmit,
}: BottomNavigationProps) {
  const hasUserImages = (watchedImages?.length ?? 0) > 0;
  const MIN_INSPIRATION = 0;

  const isStep1Disabled = !watchedName?.trim() || !selectedIndustry;
  const isStep2Disabled = !watchedLogo;
  const isStep3Disabled = false;

  const isNextDisabled =
    (currentStep === 1 && isStep1Disabled) ||
    (currentStep === 2 && isStep2Disabled) ||
    (currentStep === 3 && isStep3Disabled);

  const isSubmitDisabled = isPending;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-sm">
      {/* Error Banner — shown above buttons on last step after a failed submission */}
      {serverError && isLastStep && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-red-400">Brand creation failed</p>
              <p className="text-xs font-medium mt-0.5 text-red-400/80 break-words">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        {/* Back */}
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={onBack}
            disabled={isPending}
            variant="outline"
            className="h-11 px-4 rounded-xl border border-border text-foreground text-sm font-semibold bg-secondary hover:bg-accent disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}

        {/* Next / Submit */}
        {!isLastStep ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            variant="accent"
            className="flex-1 h-11 rounded-xl text-sm font-bold shadow-md disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            variant="accent"
            className="flex-1 h-11 rounded-xl text-sm font-bold shadow-md disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                Creating…
              </>
            ) : serverError ? (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Try Again
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Create Brand
              </>
            )}
          </Button>
        )}
      </div>

      {/* Step counter */}
      <p className="text-center text-[10px] text-muted-foreground pb-2 font-medium tracking-widest uppercase">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
