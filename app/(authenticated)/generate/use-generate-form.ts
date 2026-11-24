"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resolveDesignSession, saveDesignSession } from "@/app/actions/design-session";
import { useUI } from "@/components/context/ui-context";
import type { FormValidationErrors } from "@/components/generate/schema";
import type { AdvancedSettings, Brand, User, GenerateResult, ChatTurn } from "./types";

// Extracted hooks
import { useNetworkStatus } from "./hooks/use-network-status";
import { useBrandSync } from "./hooks/use-brand-sync";
import { useGenerateProgress } from "./hooks/use-generate-progress";
import { useGenerateShortcuts } from "./hooks/use-generate-shortcuts";
import { useImageUploads } from "./hooks/use-image-uploads";
import { useGenerateDownload } from "./hooks/use-generate-download";
import { useQueuedJobs } from "./hooks/use-queued-jobs";
import { useGenerateSubmit } from "./hooks/use-generate-submit";
import { computeGenerationCredits } from "@/lib/credits";

interface UseGenerateFormProps {
  user: User;
  brands: Brand[];
  initialSessionId?: string | null;
}

export function useGenerateForm({ user, brands, initialSessionId = null }: UseGenerateFormProps) {
  const { showToast } = useUI();
  const router = useRouter();

  // Core visual state
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<GenerateResult[]>([]);
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [designSessionId, setDesignSessionId] = useState<string | null>(null);
  const sessionReadyRef = useRef(false);
  const loadedSessionRef = useRef<string | null>(null);
  const [editTarget, setEditTarget] = useState<GenerateResult | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formErrors, setFormErrors] = useState<FormValidationErrors>({});
  const [speed, setSpeed] = useState<"slow" | "normal">("normal");
  const [quality, setQuality] = useState<"normal" | "hd" | "2k" | "4k">("hd");
  const [modelTier, setModelTier] = useState<"normal" | "pro">("normal");
  const [activeJobs, setActiveJobs] = useState<string[]>([]);
  const [carouselMode, setCarouselMode] = useState(false);
  const [slideCount, setSlideCount] = useState(4);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    customHeadline: "",
    ctaText: "",
    textPosition: "center",
    creativeMode: false,
    styleIntensity: "normal",
    referenceInfluence: "normal",
    visualStyle: "auto",
  });
  const { singleCost, totalCost } = computeGenerationCredits({
    speed,
    quality,
    modelTier,
    carouselMode: carouselMode && !editTarget,
    slideCount,
  });

  // Refs
  const resultRef = useRef<HTMLDivElement>(null);
  const resultDataRef = useRef<GenerateResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Field error clearing
  const clearFieldError = useCallback((field: keyof FormValidationErrors) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  useEffect(() => {
    if (loadedSessionRef.current && initialSessionId === loadedSessionRef.current) return;
    let cancelled = false;
    resolveDesignSession(initialSessionId)
      .then((session) => {
        if (cancelled) return;
        loadedSessionRef.current = session.id;
        setDesignSessionId(session.id);
        setChatTurns(Array.isArray(session.turns) ? (session.turns as ChatTurn[]) : []);
        sessionReadyRef.current = true;
        if (initialSessionId !== session.id) {
          router.replace(`/generate?session=${session.id}`);
        }
      })
      .catch(() => {
        if (!cancelled) showToast("Could not open this chat session.", "error");
      });
    return () => {
      cancelled = true;
    };
  }, [initialSessionId, router, showToast]);

  useEffect(() => {
    if (!sessionReadyRef.current || !designSessionId) return;
    const timer = window.setTimeout(() => {
      saveDesignSession(designSessionId, chatTurns).then((result) => {
        if (!result.expired) return;
        resolveDesignSession(null).then((fresh) => {
          loadedSessionRef.current = fresh.id;
          setDesignSessionId(fresh.id);
          router.replace(`/generate?session=${fresh.id}`);
          saveDesignSession(fresh.id, chatTurns);
        });
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [chatTurns, designSessionId, router]);

  // Composed Custom Hooks
  const isOffline = useNetworkStatus(showToast);
  const progressValue = useGenerateProgress(activeJobs.length);
  const { isDownloading, handleDownload } = useGenerateDownload(showToast);
  
  const { selectBrand } = useBrandSync({ brands, selectedBrandId, setSelectedBrandId });

  const {
    referenceImages,
    referenceImagePreviews,
    characterImages,
    characterImagePreviews,
    handleReferenceImageUpload,
    handleCharacterImageUpload,
    removeCharacterImage,
    removeReferenceImage,
  } = useImageUploads({ showToast, clearFieldError });

  const clearResult = useCallback(() => {
    setResult(null);
    resultDataRef.current = null;
  }, []);

  // Realtime background job subscribers
  const { isPolling } = useQueuedJobs({
    activeJobs,
    setActiveJobs,
    setImageLoaded,
    setResult,
    setRecentGenerations,
    setChatTurns,
    setGenerationError,
    showToast,
    router,
    resultDataRef,
  });

  // Submit action handler
  const { handleGenerate } = useGenerateSubmit({
    selectedBrandId,
    prompt,
    setPrompt,
    advancedSettings,
    aspectRatio,
    referenceImages,
    referenceImagePreviews,
    characterImages,
    characterImagePreviews,
    isOffline,
    user,
    showAdvanced,
    setShowAdvanced,
    setFormErrors,
    setGenerationError,
    setActiveJobs,
    setChatTurns,
    editTarget,
    setEditTarget,
    showToast,
    startTransition,
    speed,
    quality,
    modelTier,
    totalCost,
    carouselMode,
    slideCount,
    clearResult,
    designSessionId,
  });

  // Hook up keyboard shortcuts
  useGenerateShortcuts({
    isPending,
    prompt,
    selectedBrandId,
    result,
    handleGenerate,
    clearResult,
  });

  return {
    state: {
      selectedBrandId,
      prompt,
      aspectRatio,
      result,
      recentGenerations,
      chatTurns,
      editTarget,
      imageLoaded,
      generationError,
      isPending,
      isPolling,
      activeJobsCount: activeJobs.length,
      activeJobs,
      progressValue,
      isDownloading,
      isOffline,
      showAdvanced,
      referenceImages, referenceImagePreviews,
      characterImages, characterImagePreviews,
      advancedSettings, formErrors,
      speed,
      quality,
      modelTier,
      carouselMode,
      slideCount,
      singleCost,
      totalCost,
    },
    refs: {
      resultRef, textareaRef,
    },
    setters: {
      setSelectedBrandId: selectBrand,
      setPrompt, setAspectRatio, setImageLoaded, setResult,
      setGenerationError, setShowAdvanced, setAdvancedSettings,
      setSpeed, setQuality, setModelTier,
      setCarouselMode, setSlideCount,
      setChatTurns, setEditTarget,
    },
    handlers: {
      handleGenerate, clearFieldError,
      handleReferenceImageUpload, handleCharacterImageUpload,
      removeCharacterImage, removeReferenceImage,
      handleDownload: (res?: any) => {
        const target = (res && typeof res === "object" && res.result_url) ? res : resultDataRef.current;
        return handleDownload(target);
      },
    },
  };
}
