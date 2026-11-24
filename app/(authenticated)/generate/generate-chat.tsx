"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Sparkles,
  ImagePlus,
  SlidersHorizontal,
  Download,
  Maximize2,
  Wand2,
  RotateCcw,
  X,
  Check,
  ChevronDown,
  Layers,
  Zap,
  Turtle,
  LayoutGrid,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Palette,
  Type,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Flame,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/components/context/ui-context";
import { PreviewLightbox } from "./components/preview-lightbox";
import type {
  Brand,
  User,
  GenerateResult,
  ChatTurn,
  AdvancedSettings,
  DesignType,
} from "./types";
import type { FormValidationErrors } from "@/components/generate/schema";

interface GenerateChatProps {
  user: User;
  brands: Brand[];
  state: {
    selectedBrandId: string;
    prompt: string;
    aspectRatio: string;
    result: GenerateResult | null;
    recentGenerations: GenerateResult[];
    chatTurns: ChatTurn[];
    editTarget: GenerateResult | null;
    imageLoaded: boolean;
    generationError: string | null;
    isPending: boolean;
    isPolling: boolean;
    activeJobsCount: number;
    activeJobs: string[];
    progressValue: number;
    isDownloading: boolean;
    isOffline: boolean;
    showAdvanced: boolean;
    referenceImages: File[];
    referenceImagePreviews: string[];
    characterImages: File[];
    characterImagePreviews: string[];
    advancedSettings: AdvancedSettings;
    formErrors: FormValidationErrors;
    speed: "slow" | "normal";
    quality: "normal" | "hd" | "2k" | "4k";
    modelTier: "normal" | "pro";
    carouselMode: boolean;
    slideCount: number;
    singleCost: number;
    totalCost: number;
  };
  refs: {
    resultRef: React.RefObject<HTMLDivElement | null>;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  };
  setters: {
    setSelectedBrandId: (id: string) => void;
    setPrompt: (p: string) => void;
    setAspectRatio: (r: string) => void;
    setImageLoaded: (loaded: boolean) => void;
    setResult: (res: GenerateResult | null) => void;
    setGenerationError: (err: string | null) => void;
    setShowAdvanced: (v: boolean) => void;
    setAdvancedSettings: React.Dispatch<React.SetStateAction<AdvancedSettings>>;
    setSpeed: (s: "slow" | "normal") => void;
    setQuality: (q: "normal" | "hd" | "2k" | "4k") => void;
    setModelTier: (m: "normal" | "pro") => void;
    setCarouselMode: (v: boolean) => void;
    setSlideCount: (n: number) => void;
    setChatTurns: React.Dispatch<React.SetStateAction<ChatTurn[]>>;
    setEditTarget: (target: GenerateResult | null) => void;
  };
  handlers: {
    handleGenerate: () => void;
    clearFieldError: (field: keyof FormValidationErrors) => void;
    handleReferenceImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCharacterImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeCharacterImage: (index: number) => void;
    removeReferenceImage: (index: number) => void;
    handleDownload: (res?: GenerateResult) => Promise<void>;
  };
}

const ASPECT_RATIOS = [
  { label: "1:1", desc: "Square", icon: Square },
  { label: "4:5", desc: "Portrait", icon: RectangleVertical },
  { label: "9:16", desc: "Story", icon: RectangleVertical },
  { label: "16:9", desc: "Wide", icon: RectangleHorizontal },
  { label: "4:3", desc: "Standard", icon: RectangleHorizontal },
  { label: "3:2", desc: "Classic", icon: RectangleHorizontal },
] as const;

const DESIGN_TYPES: { id: DesignType; label: string; desc: string }[] = [
  { id: "graphic_design", label: "Design", desc: "Balanced commercial artwork" },
  { id: "poster", label: "Poster", desc: "High-impact visual poster" },
  { id: "flyer", label: "Flyer", desc: "Promotional event/sale flyer" },
  { id: "social_post", label: "Social", desc: "Scroll-stopping social post" },
  { id: "banner", label: "Banner", desc: "Wide hero or ad banner" },
];

const QUICK_STARTERS = [
  {
    title: "Luxury Product Poster",
    prompt: "Create a sleek, high-contrast luxury product advertisement with dramatic studio rim lighting, floating podium, and bold editorial typography.",
    type: "poster" as DesignType,
    ratio: "4:5",
  },
  {
    title: "Social Promo Post",
    prompt: "Design a vibrant modern social media promotion post with clean geometric framing, dynamic depth, and eye-catching focal hierarchy.",
    type: "social_post" as DesignType,
    ratio: "1:1",
  },
  {
    title: "Special Offer Flyer",
    prompt: "Create a bold promotional campaign flyer with energetic composition, clear visual callouts, and premium commercial polish.",
    type: "flyer" as DesignType,
    ratio: "4:5",
  },
  {
    title: "4-Slide Brand Story",
    prompt: "Tell a cohesive 4-slide visual brand story introducing our signature product, key benefits, customer lifestyle, and call to action.",
    type: "social_post" as DesignType,
    ratio: "4:5",
    carousel: true,
  },
];

/** Room kept for the prompt line and the download row so the poster is fully visible. */
const ARTWORK_CHROME_PX = 168;

export function GenerateChat({
  user,
  brands,
  state,
  refs,
  setters,
  handlers,
}: GenerateChatProps) {
  const {
    selectedBrandId,
    prompt,
    aspectRatio,
    recentGenerations,
    chatTurns,
    editTarget,
    isPending,
    progressValue,
    isDownloading,
    referenceImagePreviews,
    characterImagePreviews,
    advancedSettings,
    formErrors,
    speed,
    quality,
    carouselMode,
    slideCount,
    totalCost,
  } = state;

  const { textareaRef } = refs;
  const {
    setSelectedBrandId,
    setPrompt,
    setAspectRatio,
    setAdvancedSettings,
    setSpeed,
    setQuality,
    setCarouselMode,
    setSlideCount,
    setEditTarget,
  } = setters;
  const {
    handleGenerate,
    clearFieldError,
    handleReferenceImageUpload,
    handleCharacterImageUpload,
    removeCharacterImage,
    removeReferenceImage,
    handleDownload,
  } = handlers;

  const { showToast } = useUI();

  // Popover state inside the Grok composer
  const [activePopover, setActivePopover] = useState<
    "brand" | "images" | "ratio" | "type" | "tune" | null
  >(null);

  // Lightbox state
  const [lightboxResult, setLightboxResult] = useState<GenerateResult | null>(null);

  // Per-turn active carousel slide index
  const [activeSlideByTurn, setActiveSlideByTurn] = useState<Record<string, number>>({});
  const [gridDownloadingTurnId, setGridDownloadingTurnId] = useState<string | null>(null);

  // Hidden file input refs
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const pinToEndRef = useRef(true);
  const programmaticScrollRef = useRef(false);
  const [paneHeight, setPaneHeight] = useState(0);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];
  const currentDesignType =
    DESIGN_TYPES.find((d) => d.id === (advancedSettings.designType || "graphic_design")) ||
    DESIGN_TYPES[0];

  const totalUploadedImages =
    characterImagePreviews.length + referenceImagePreviews.length;

  const hasCustomTune =
    Boolean(advancedSettings.customHeadline.trim()) ||
    Boolean(advancedSettings.ctaText.trim()) ||
    advancedSettings.creativeMode ||
    carouselMode ||
    quality !== "hd" ||
    speed !== "normal";

  // Combine latest session results + recentGenerations for the Top Recent Prompt & Vision Bar
  const recentVisionItems = React.useMemo(() => {
    const sessionResults: GenerateResult[] = [];
    for (let i = chatTurns.length - 1; i >= 0; i--) {
      const turn = chatTurns[i];
      for (const r of turn.results) {
        if (r?.result_url) {
          sessionResults.push({
            ...r,
            prompt: r.prompt || turn.userPrompt,
            aspect_ratio: r.aspect_ratio || turn.aspectRatio,
          });
        }
      }
    }
    const combined = [...sessionResults, ...(recentGenerations || [])];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (!item?.result_url || seen.has(item.result_url)) return false;
      seen.add(item.result_url);
      return true;
    }).slice(0, 14);
  }, [chatTurns, recentGenerations]);

  useEffect(() => {
    const pane = scrollRef.current;
    if (!pane) return;
    const measure = () => setPaneHeight(Math.floor(pane.clientHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);

  const artworkMaxPx = Math.max(160, (paneHeight || 520) - ARTWORK_CHROME_PX);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      pinToEndRef.current = distance < 140;
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const scrollThreadToEnd = (behavior: ScrollBehavior) => {
    const end = chatEndRef.current;
    if (!end) return;
    programmaticScrollRef.current = true;
    pinToEndRef.current = true;
    end.scrollIntoView({ behavior, block: "end" });
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, behavior === "smooth" ? 500 : 50);
  };

  // Auto-scroll when new turns are added or status changes
  useEffect(() => {
    if (chatTurns.length === 0) return;
    scrollThreadToEnd("smooth");
  }, [chatTurns.length, chatTurns[chatTurns.length - 1]?.status, chatTurns[chatTurns.length - 1]?.results.length]);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (composerRef.current && !composerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    }
    if (activePopover) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activePopover]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isPending && prompt.trim()) {
        setActivePopover(null);
        handleGenerate();
      }
    }
  };

  const handleReplyEdit = (res: GenerateResult) => {
    setEditTarget(res);
    if (res.aspect_ratio) {
      setAspectRatio(res.aspect_ratio);
    }
    setActivePopover(null);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleRemixPrompt = (turn: ChatTurn) => {
    setPrompt(turn.userPrompt);
    setAspectRatio(turn.aspectRatio);
    setAdvancedSettings((prev) => ({
      ...prev,
      designType: turn.designType,
      customHeadline: turn.customHeadline || "",
      ctaText: turn.ctaText || "",
    }));
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const [animatingResultId, setAnimatingResultId] = useState<string | null>(null);

  const handleAnimateAd = async (duration: 4 | 6, res: GenerateResult) => {
    try {
      setAnimatingResultId(res.id || null);
      showToast(`🎬 Video Animation (${duration}s) စတင်နေပါပြီ... မိနစ်အနည်းငယ်ကြာနိုင်ပါသည်။`, "info");
      
      const { generateVideoAction } = await import("@/app/actions/generate");
      const r = await generateVideoAction({
        generationId: res.id || "",
        imageUrl: res.result_url,
        brandId: res.brand_id || selectedBrandId,
        durationSeconds: duration,
      });
      
      if (r.status === "queued") {
        showToast("🎬 Video request queued successfully! Please wait...", "success");
        // We might want to poll or wait, but for now it's queued.
        // The background worker will generate it. 
        // We will need to poll for status. Let's just track it in activeJobs so UI updates.
        // Wait, activeJobs tracking is via the main queue in job-context.
        // So the queue indicator will show it.
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to animate video", "error");
    } finally {
      setAnimatingResultId(null);
    }
  };

  const handleCarouselGridDownload = async (turn: ChatTurn) => {
    try {
      setGridDownloadingTurnId(turn.id);
      showToast("🎨 Carousel Grid ပုံ စုစည်းနေပါသည်...", "info");
      const urls = turn.results.map((r) => r.result_url).filter(Boolean);
      const { composeCarouselGrid } = await import("@/lib/grid-composer");
      const gridDataUrl = await composeCarouselGrid(urls, turn.aspectRatio);
      const { downloadImage } = await import("@/lib/download");
      const res = await downloadImage(gridDataUrl, `carousel-grid-${Date.now()}.jpg`);
      showToast(res.toastMessage, res.toastType);
    } catch (error: any) {
      showToast(error?.message || "Grid download failed", "error");
    } finally {
      setGridDownloadingTurnId(null);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 h-full bg-[#050507] text-foreground overflow-hidden select-none">
      {/* Subtle Grok radial ambient top light */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-60 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255,255,255,0.055), transparent 70%)",
        }}
      />

      {/* Hidden File Inputs for Subject & Style Reference */}
      <input
        ref={subjectInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleCharacterImageUpload}
      />
      <input
        ref={referenceInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleReferenceImageUpload}
      />

      {/* ── TOP BAR: RECENT PROMPTS & VISIONS ── */}
      <div className="shrink-0 relative z-20 border-b border-white/[0.08] bg-[#09090d]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/85">
              Recent Visions
            </span>
          </div>

          {recentVisionItems.length > 0 ? (
            <div className="flex items-center gap-2">
              {recentVisionItems.map((item, idx) => (
                <div
                  key={item.id || `${item.result_url}-${idx}`}
                  className="group flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#121218] hover:bg-[#191922] border border-white/[0.08] hover:border-white/20 transition-all shrink-0 max-w-[260px]"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxResult(item)}
                    className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/15 shrink-0 group/img"
                    title="Click to view vision fullscreen"
                  >
                    <img
                      src={item.result_url}
                      alt={item.prompt || "Recent vision"}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                    />
                  </button>

                  <div className="min-w-0 flex-1 text-left">
                    <p
                      onClick={() => {
                        if (item.prompt) {
                          setPrompt(item.prompt);
                          if (item.aspect_ratio) setAspectRatio(item.aspect_ratio);
                          setTimeout(() => textareaRef.current?.focus(), 50);
                        } else {
                          setLightboxResult(item);
                        }
                      }}
                      className="text-[11px] font-medium text-white/90 truncate cursor-pointer hover:text-white"
                      title={item.prompt || "Click to reuse prompt"}
                    >
                      {item.prompt || "Generated Brand Vision"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.aspect_ratio && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8b8b97]">
                          {item.aspect_ratio}
                        </span>
                      )}
                      {item.prompt && (
                        <button
                          type="button"
                          onClick={() => {
                            setPrompt(item.prompt || "");
                            if (item.aspect_ratio) setAspectRatio(item.aspect_ratio);
                            setTimeout(() => textareaRef.current?.focus(), 50);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8b8b97] hover:text-white transition-colors"
                          title="Reuse prompt in chat"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Prompt</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleReplyEdit(item)}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400/90 hover:text-emerald-300 transition-colors"
                        title="Edit this vision in chat"
                      >
                        <Wand2 className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {QUICK_STARTERS.map((starter) => (
                <button
                  key={starter.title}
                  type="button"
                  onClick={() => {
                    setPrompt(starter.prompt);
                    setAspectRatio(starter.ratio);
                    setAdvancedSettings((prev) => ({
                      ...prev,
                      designType: starter.type,
                    }));
                    setCarouselMode(Boolean(starter.carousel));
                    if (starter.carousel) setSlideCount(4);
                    setTimeout(() => textareaRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121218] hover:bg-[#191922] border border-white/[0.08] hover:border-white/20 text-left transition-all shrink-0"
                >
                  <span className="text-xs font-semibold text-white">{starter.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8b8b97]">
                    {starter.ratio}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable chat. The composer sits below this pane, so images cannot slide under it. */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 pt-3 pb-4 scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto w-full flex flex-col min-h-full">
          {chatTurns.length === 0 ? (
            /* ── COMPACT GROK EMPTY STATE (Fits in viewport with zero scroll needed) ── */
            <div className="flex-1 flex flex-col items-center justify-center py-2 sm:py-4 text-center animate-in fade-in duration-500">
              <div className="relative mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[#111116] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.04)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050507]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-1">
                What are we designing today?
              </h2>
              <p className="text-xs sm:text-sm text-[#8b8b97] max-w-md mb-4 leading-relaxed">
                Type your vision below or pick a starter prompt. Your recent visions are pinned at the top.
              </p>

              {/* Quick Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl text-left">
                {QUICK_STARTERS.map((starter) => (
                  <button
                    key={starter.title}
                    type="button"
                    onClick={() => {
                      setPrompt(starter.prompt);
                      setAspectRatio(starter.ratio);
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        designType: starter.type,
                      }));
                      if (starter.carousel) {
                        setCarouselMode(true);
                        setSlideCount(4);
                      } else {
                        setCarouselMode(false);
                      }
                      setTimeout(() => textareaRef.current?.focus(), 50);
                    }}
                    className="group p-3 rounded-2xl bg-[#0e0e13] hover:bg-[#15151d] border border-white/[0.07] hover:border-white/15 transition-all flex flex-col justify-between gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-white transition-colors">
                        {starter.title}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-[#8b8b97]">
                        {starter.carousel ? "4 Slides" : starter.ratio}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8b8b97] line-clamp-1 leading-relaxed">
                      {starter.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── CONVERSATION THREAD ── */
            <div className="space-y-8 py-2">
              {chatTurns.map((turn) => {
                const turnBrand = brands.find((b) => b.id === turn.brandId);
                const activeSlideIdx = activeSlideByTurn[turn.id] ?? 0;
                const currentResult = turn.results[activeSlideIdx] || turn.results[0];
                const isCarouselTurn = turn.carouselMode || turn.results.length > 1;

                return (
                  <div
                    key={turn.id}
                    className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    {/* 1. USER PROMPT MESSAGE (Right-aligned Grok Bubble) */}
                    <div className="flex flex-col items-end">
                      <div className="max-w-[88%] sm:max-w-[78%] rounded-3xl rounded-tr-md bg-[#16161e] border border-white/10 px-4 py-3 text-left shadow-lg">
                        {/* If this turn was editing a previous image */}
                        {turn.editSourceUrl && (
                          <div className="mb-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 w-fit">
                            <img
                              src={turn.editSourceUrl}
                              alt="Edited source"
                              className="w-7 h-7 rounded-md object-cover border border-white/15"
                            />
                            <span className="text-[11px] font-medium text-white/80">
                              Follow-up edit on design
                            </span>
                          </div>
                        )}

                        {/* Attached Subject / Reference Previews */}
                        {(turn.subjectPreviews.length > 0 ||
                          turn.referencePreviews.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {turn.subjectPreviews.map((src, idx) => (
                              <div
                                key={`sub-${idx}`}
                                className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/15"
                              >
                                <img src={src} alt="Subject" className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-center text-white py-0.5">
                                  Subject
                                </span>
                              </div>
                            ))}
                            {turn.referencePreviews.map((src, idx) => (
                              <div
                                key={`ref-${idx}`}
                                className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/15"
                              >
                                <img src={src} alt="Style Ref" className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-center text-white py-0.5">
                                  Style
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-sm text-white/95 whitespace-pre-wrap leading-relaxed select-text">
                          {turn.userPrompt}
                        </p>

                        {/* Metadata Pills inside User Bubble */}
                        <div className="mt-2.5 pt-2 border-t border-white/[0.07] flex flex-wrap items-center gap-1.5">
                          {turnBrand && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/80">
                              {turnBrand.name}
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-[#8b8b97]">
                            {turn.aspectRatio}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-[#8b8b97] uppercase">
                            {turn.quality}
                          </span>
                          {turn.carouselMode && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white">
                              {turn.slideCount} Slides
                            </span>
                          )}
                          {turn.customHeadline && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/75 truncate max-w-[180px]">
                              “{turn.customHeadline}”
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. GROK AI STUDIO RESPONSE (Left-aligned) */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#14141b] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        {/* AI Turn Header */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            Design Studio
                          </span>
                          <span className="text-[10px] text-[#8b8b97] font-mono">
                            {turn.status === "generating"
                              ? turn.carouselMode
                                ? `Rendering slide ${turn.results.length + 1} of ${turn.slideCount}...`
                                : "Rendering artwork..."
                              : turn.status === "failed"
                                ? "Generation failed"
                                : "Completed"}
                          </span>
                        </div>

                        {/* FAILED STATE */}
                        {turn.status === "failed" && turn.results.length === 0 && (
                          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md space-y-3">
                            <div className="flex items-start gap-2.5 text-red-400">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <p className="text-xs leading-relaxed">{turn.error}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemixPrompt(turn)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore Prompt & Retry
                            </button>
                          </div>
                        )}

                        {/* GENERATING SHIMMER CARD (When waiting for first result) */}
                        {turn.status === "generating" && turn.results.length === 0 && (
                          <div
                            className="relative w-full max-w-md rounded-2xl bg-[#0e0e13] border border-white/10 overflow-hidden p-6 flex flex-col justify-between shadow-2xl"
                            style={{
                              aspectRatio: (turn.aspectRatio || "1:1").replace(":", "/"),
                              maxHeight: artworkMaxPx,
                            }}
                          >
                            {/* Animated pulse gradient */}
                            <div
                              className="absolute inset-0 opacity-30 pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
                                backgroundSize: "200% 100%",
                                animation: "sweep-gradient 2.5s infinite linear",
                              }}
                            />

                            <div className="relative z-10 flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-medium text-white/80">
                                <Loader2 className="w-3 h-3 animate-spin text-white" />
                                Rendering
                              </span>
                              <span className="text-xs font-mono font-semibold text-white/80">
                                {Math.round(progressValue)}%
                              </span>
                            </div>

                            <div className="relative z-10 my-auto flex flex-col items-center text-center space-y-2 py-8">
                              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-white animate-pulse" />
                              </div>
                              <p className="text-xs font-medium text-white/90">
                                {progressValue < 35
                                  ? "Analyzing brand identity & layout..."
                                  : progressValue < 75
                                    ? "Composing visual hierarchy & typography..."
                                    : "Finalizing high-definition render..."}
                              </p>
                              <p className="text-[11px] text-[#8b8b97]">
                                Keep this tab open while your design renders
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative z-10 w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                              <div
                                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.max(8, progressValue)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* COMPLETED / PARTIAL RESULTS CARD */}
                        {turn.results.length > 0 && currentResult && (
                          <div className="space-y-3 max-w-lg">
                            {/* Main Artwork Frame */}
                            <div className="group relative inline-flex max-w-full justify-center">
                              {currentResult.result_url.endsWith(".mp4") ? (
                                <video
                                  src={currentResult.result_url}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  onClick={() => setLightboxResult(currentResult)}
                                  onLoadedData={() => {
                                    if (pinToEndRef.current) scrollThreadToEnd("auto");
                                  }}
                                  style={{ maxHeight: artworkMaxPx }}
                                  className="h-auto w-auto max-w-full rounded-2xl border border-white/10 bg-[#0b0b0f] object-contain shadow-2xl cursor-zoom-in"
                                />
                              ) : (
                                <img
                                  src={currentResult.result_url}
                                  alt={turn.userPrompt}
                                  onClick={() => setLightboxResult(currentResult)}
                                  onLoad={() => {
                                    if (pinToEndRef.current) scrollThreadToEnd("auto");
                                  }}
                                  style={{ maxHeight: artworkMaxPx }}
                                  className="h-auto w-auto max-w-full rounded-2xl border border-white/10 bg-[#0b0b0f] object-contain shadow-2xl cursor-zoom-in"
                                />
                              )}

                              {/* Top-right floating quick actions on hover */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setLightboxResult(currentResult)}
                                  className="p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/15 backdrop-blur-md transition-colors"
                                  title="Full screen"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Slide badge if carousel */}
                              {isCarouselTurn && (
                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[10px] font-semibold text-white">
                                  Slide {activeSlideIdx + 1} /{" "}
                                  {turn.carouselMode ? turn.slideCount : turn.results.length}
                                </div>
                              )}
                            </div>

                            {/* Carousel Thumbnail Strip (if multi-slide) */}
                            {isCarouselTurn && (
                              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {turn.results.map((slideRes, idx) => (
                                  <button
                                    key={slideRes.id || idx}
                                    type="button"
                                    onClick={() =>
                                      setActiveSlideByTurn((prev) => ({
                                        ...prev,
                                        [turn.id]: idx,
                                      }))
                                    }
                                    className={cn(
                                      "relative w-14 h-14 rounded-xl overflow-hidden border transition-all shrink-0",
                                      activeSlideIdx === idx
                                        ? "border-white ring-2 ring-white/25 scale-105"
                                        : "border-white/10 opacity-60 hover:opacity-100"
                                    )}
                                  >
                                    <img
                                      src={slideRes.result_url}
                                      alt={`Slide ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}

                                {/* Skeleton placeholders for remaining slides still generating */}
                                {turn.status === "generating" &&
                                  Array.from({
                                    length: Math.max(0, turn.slideCount - turn.results.length),
                                  }).map((_, idx) => (
                                    <div
                                      key={`pending-${idx}`}
                                      className="w-14 h-14 rounded-xl bg-[#14141c] border border-white/10 flex items-center justify-center shrink-0"
                                    >
                                      <Loader2 className="w-4 h-4 animate-spin text-[#8b8b97]" />
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Per-Turn Grok Action Bar */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleDownload(currentResult)}
                                disabled={isDownloading}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                              >
                                {isDownloading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Download className="w-3.5 h-3.5" />
                                )}
                                <span>Download</span>
                              </button>

                              {!currentResult.result_url.endsWith(".mp4") && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleAnimateAd(4, currentResult)}
                                    disabled={animatingResultId === currentResult.id || !currentResult.id || turn.status !== 'completed'}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#16161e] hover:bg-[#1f1f2a] text-white border border-white/10 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {animatingResultId === currentResult.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    )}
                                    <span>Animate (4s)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAnimateAd(6, currentResult)}
                                    disabled={animatingResultId === currentResult.id || !currentResult.id || turn.status !== 'completed'}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#16161e] hover:bg-[#1f1f2a] text-white border border-white/10 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {animatingResultId === currentResult.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    )}
                                    <span>Animate (6s)</span>
                                  </button>
                                </>
                              )}

                              {isCarouselTurn && turn.results.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleCarouselGridDownload(turn)}
                                  disabled={gridDownloadingTurnId === turn.id}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#16161e] hover:bg-[#1f1f2a] text-white border border-white/10 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
                                >
                                  {gridDownloadingTurnId === turn.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                  )}
                                  <span>Download Grid</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleReplyEdit(currentResult)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#16161e] hover:bg-[#1f1f2a] text-white border border-white/10 text-xs font-medium transition-all active:scale-95"
                              >
                                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Edit in Chat</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemixPrompt(turn)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-transparent hover:bg-white/[0.06] text-[#8b8b97] hover:text-white text-xs font-medium transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reuse Prompt</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} className="h-2 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* ── FLOATING GROK-STYLE FIXED BOTTOM COMPOSER DOCK ── */}
      <div
        ref={composerRef}
        className="relative shrink-0 z-30 border-t border-white/[0.06] bg-[#050507] pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:pb-4"
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pointer-events-auto">
          {/* POPOVER TRAYS (Anchored above the composer bar) */}
          {activePopover === "brand" && (
          <div className="mb-2 p-2 rounded-2xl bg-[#121218] border border-white/12 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 max-h-64 overflow-y-auto">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8b8b97]">
              Select Brand Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {brands.map((brand) => {
                const isSelected = brand.id === selectedBrandId;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrandId(brand.id);
                      clearFieldError("brandId");
                      setActivePopover(null);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors",
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-white/[0.06] text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                            isSelected ? "bg-black text-white" : "bg-white/15 text-white"
                          )}
                        >
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs truncate">{brand.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activePopover === "images" && (
          <div className="mb-2 p-4 rounded-2xl bg-[#121218] border border-white/12 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                Attach Subject & Style Reference Images
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-[#8b8b97] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Subject / Product Photos */}
              <div className="p-3 rounded-xl bg-[#181820] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">
                      Subject / Product
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8b8b97]">
                    {characterImagePreviews.length}/2
                  </span>
                </div>
                <p className="text-[11px] text-[#8b8b97]">
                  Include your exact product, person, or object in the design.
                </p>
                <button
                  type="button"
                  disabled={characterImagePreviews.length >= 2}
                  onClick={() => subjectInputRef.current?.click()}
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-medium text-white transition-colors"
                >
                  + Upload Subject Photo
                </button>
              </div>

              {/* Style Reference Photos */}
              <div className="p-3 rounded-xl bg-[#181820] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">
                      Style Reference
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8b8b97]">
                    {referenceImagePreviews.length}/3
                  </span>
                </div>
                <p className="text-[11px] text-[#8b8b97]">
                  Guide lighting, color mood, and layout aesthetic.
                </p>
                <button
                  type="button"
                  disabled={referenceImagePreviews.length >= 3}
                  onClick={() => referenceInputRef.current?.click()}
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-medium text-white transition-colors"
                >
                  + Upload Style Reference
                </button>
              </div>
            </div>

            {/* Style influence toggles when reference images exist */}
            {referenceImagePreviews.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() =>
                    setAdvancedSettings((prev) => ({
                      ...prev,
                      styleIntensity: prev.styleIntensity === "high" ? "normal" : "high",
                    }))
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    advancedSettings.styleIntensity === "high"
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.05] text-[#8b8b97] border-white/10 hover:text-white"
                  )}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Strong Style
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAdvancedSettings((prev) => ({
                      ...prev,
                      referenceInfluence:
                        prev.referenceInfluence === "high" ? "normal" : "high",
                    }))
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    advancedSettings.referenceInfluence === "high"
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.05] text-[#8b8b97] border-white/10 hover:text-white"
                  )}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Visual Structure
                </button>
              </div>
            )}
          </div>
        )}

        {activePopover === "ratio" && (
          <div className="mb-2 p-2.5 rounded-2xl bg-[#121218] border border-white/12 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8b8b97]">
              Aspect Ratio
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-1">
              {ASPECT_RATIOS.map((item) => {
                const Icon = item.icon;
                const isSelected = aspectRatio === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setAspectRatio(item.label);
                      setActivePopover(null);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all",
                      isSelected
                        ? "bg-white text-black border-white font-semibold"
                        : "bg-[#181820] text-white/80 border-white/[0.07] hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">{item.label}</span>
                    <span
                      className={cn(
                        "text-[9px]",
                        isSelected ? "text-black/70" : "text-[#8b8b97]"
                      )}
                    >
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activePopover === "type" && (
          <div className="mb-2 p-2.5 rounded-2xl bg-[#121218] border border-white/12 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8b8b97]">
              Design Format
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-1">
              {DESIGN_TYPES.map((t) => {
                const isSelected =
                  (advancedSettings.designType || "graphic_design") === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setAdvancedSettings((prev) => ({
                        ...prev,
                        designType: t.id,
                      }));
                      setActivePopover(null);
                    }}
                    className={cn(
                      "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all",
                      isSelected
                        ? "bg-white text-black border-white"
                        : "bg-[#181820] text-white border-white/[0.07] hover:bg-white/10"
                    )}
                  >
                    <span className="text-xs font-bold">{t.label}</span>
                    <span
                      className={cn(
                        "text-[10px] line-clamp-1 mt-0.5",
                        isSelected ? "text-black/70" : "text-[#8b8b97]"
                      )}
                    >
                      {t.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activePopover === "tune" && (
          <div className="mb-2 p-4 rounded-2xl bg-[#121218] border border-white/12 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                Typography, Quality & Carousel Settings
              </span>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="text-[#8b8b97] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Exact Text Overlay Inputs (Headline & CTA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8b8b97] flex items-center gap-1">
                  <Type className="w-3 h-3" /> Headline Text (Optional)
                </label>
                <input
                  type="text"
                  value={advancedSettings.customHeadline}
                  onChange={(e) => {
                    clearFieldError("headline");
                    setAdvancedSettings((prev) => ({
                      ...prev,
                      customHeadline: e.target.value,
                    }));
                  }}
                  placeholder="e.g. GRAND OPENING 50% OFF"
                  className="w-full h-9 px-3 rounded-xl bg-[#181820] border border-white/10 text-xs text-white placeholder:text-[#8b8b97]/60 focus:outline-none focus:border-white/30"
                />
                {formErrors.headline && (
                  <p className="text-[10px] text-red-400">{formErrors.headline}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8b8b97]">
                  CTA / Subtext (Optional)
                </label>
                <input
                  type="text"
                  value={advancedSettings.ctaText}
                  onChange={(e) => {
                    clearFieldError("cta");
                    setAdvancedSettings((prev) => ({
                      ...prev,
                      ctaText: e.target.value,
                    }));
                  }}
                  placeholder="e.g. Order Now · Limited Time"
                  className="w-full h-9 px-3 rounded-xl bg-[#181820] border border-white/10 text-xs text-white placeholder:text-[#8b8b97]/60 focus:outline-none focus:border-white/30"
                />
                {formErrors.cta && (
                  <p className="text-[10px] text-red-400">{formErrors.cta}</p>
                )}
              </div>
            </div>

            {/* Speed & Resolution Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Speed */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8b8b97]">
                  Generation Speed
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#181820] border border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => setSpeed("slow")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      speed === "slow"
                        ? "bg-white text-black"
                        : "text-[#8b8b97] hover:text-white"
                    )}
                  >
                    <Turtle className="w-3.5 h-3.5" />
                    <span>Flex · 7c</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed("normal")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      speed === "normal"
                        ? "bg-white text-black"
                        : "text-[#8b8b97] hover:text-white"
                    )}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Fast · 10c</span>
                  </button>
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8b8b97]">
                  Resolution Quality
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#181820] border border-white/[0.07]">
                  {(
                    [
                      { id: "normal", label: "1K" },
                      { id: "hd", label: "HD" },
                      { id: "2k", label: "2K" },
                      { id: "4k", label: "4K" },
                    ] as const
                  ).map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQuality(q.id)}
                      className={cn(
                        "py-1.5 rounded-lg text-xs font-semibold transition-all",
                        quality === q.id
                          ? "bg-white text-black"
                          : "text-[#8b8b97] hover:text-white"
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Multi-Slide & Creative Mode Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCarouselMode(!carouselMode)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    carouselMode
                      ? "bg-white text-black border-white"
                      : "bg-[#181820] text-[#8b8b97] border-white/10 hover:text-white"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Carousel Series</span>
                </button>

                {carouselMode && (
                  <div className="inline-flex items-center gap-1 bg-[#181820] p-1 rounded-full border border-white/10">
                    {[2, 3, 4, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSlideCount(n)}
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all",
                          slideCount === n
                            ? "bg-white text-black"
                            : "text-[#8b8b97] hover:text-white"
                        )}
                      >
                        {n}s
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setAdvancedSettings((prev) => ({
                    ...prev,
                    creativeMode: !prev.creativeMode,
                  }))
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  advancedSettings.creativeMode
                    ? "bg-white text-black border-white"
                    : "bg-[#181820] text-[#8b8b97] border-white/10 hover:text-white"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creative Boost</span>
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN GROK COMPOSER BOX ── */}
        <div className="rounded-3xl bg-[#121217] border border-white/[0.11] focus-within:border-white/25 shadow-[0_12px_50px_rgba(0,0,0,0.75)] transition-all overflow-hidden">
          {/* Active Edit Mode Banner (When replying to an existing design) */}
          {editTarget && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a23] border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={editTarget.result_url}
                  alt="Editing target"
                  className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">
                      Editing selected design
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8b8b97] truncate">
                    Describe what to change (text, colors, lighting, elements)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="p-1 rounded-full hover:bg-white/10 text-[#8b8b97] hover:text-white transition-colors"
                title="Cancel edit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attached Subject / Reference Image Chips Strip */}
          {totalUploadedImages > 0 && (
            <div className="flex items-center gap-2 px-4 pt-3 overflow-x-auto">
              {characterImagePreviews.map((src, i) => (
                <div
                  key={`char-${i}`}
                  className="relative group w-12 h-12 rounded-xl overflow-hidden border border-white/15 shrink-0"
                >
                  <img src={src} alt="Subject" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-center text-white">
                    Subject
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCharacterImage(i)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {referenceImagePreviews.map((src, i) => (
                <div
                  key={`ref-${i}`}
                  className="relative group w-12 h-12 rounded-xl overflow-hidden border border-white/15 shrink-0"
                >
                  <img src={src} alt="Style" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-center text-white">
                    Style
                  </span>
                  <button
                    type="button"
                    onClick={() => removeReferenceImage(i)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Textarea */}
          <div className="px-4 pt-3.5 pb-2">
            <textarea
              ref={textareaRef as any}
              rows={1}
              value={prompt}
              onChange={(e) => {
                if (formErrors.prompt) clearFieldError("prompt");
                setPrompt(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                editTarget
                  ? "Describe what to change in this design... (e.g., Change headline to 'SUMMER SALE', make background obsidian gold)"
                  : "Describe a poster, social ad, flyer, or brand design..."
              }
              className="w-full bg-transparent text-sm sm:text-[15px] text-white placeholder:text-[#8b8b97]/75 focus:outline-none resize-none max-h-40 leading-relaxed select-text"
            />
          </div>

          {/* Bottom Composer Toolbar (Grok Pills + Send Button) */}
          <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
              {/* 1. Attach Images Pill */}
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === "images" ? null : "images")
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0",
                  activePopover === "images" || totalUploadedImages > 0
                    ? "bg-white/15 text-white border-white/25"
                    : "bg-[#1a1a22] hover:bg-[#22222c] text-[#b4b4c0] border-white/[0.07]"
                )}
                title="Attach Subject or Style Reference photos"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Images</span>
                {totalUploadedImages > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-black text-[10px] font-bold">
                    {totalUploadedImages}
                  </span>
                )}
              </button>

              {/* 2. Brand Selector Pill */}
              {selectedBrand && (
                <button
                  type="button"
                  onClick={() =>
                    setActivePopover(activePopover === "brand" ? null : "brand")
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0 max-w-[130px]",
                    activePopover === "brand"
                      ? "bg-white/15 text-white border-white/25"
                      : "bg-[#1a1a22] hover:bg-[#22222c] text-[#b4b4c0] border-white/[0.07]"
                  )}
                  title="Switch Brand"
                >
                  {selectedBrand.logo_url ? (
                    <img
                      src={selectedBrand.logo_url}
                      alt={selectedBrand.name}
                      className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      {selectedBrand.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="truncate">{selectedBrand.name}</span>
                </button>
              )}

              {/* 3. Aspect Ratio Pill */}
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === "ratio" ? null : "ratio")
                }
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0",
                  activePopover === "ratio"
                    ? "bg-white/15 text-white border-white/25"
                    : "bg-[#1a1a22] hover:bg-[#22222c] text-[#b4b4c0] border-white/[0.07]"
                )}
                title="Aspect Ratio"
              >
                <span>{aspectRatio}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* 4. Design Type Pill */}
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === "type" ? null : "type")
                }
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0",
                  activePopover === "type"
                    ? "bg-white/15 text-white border-white/25"
                    : "bg-[#1a1a22] hover:bg-[#22222c] text-[#b4b4c0] border-white/[0.07]"
                )}
                title="Design Type"
              >
                <span>{currentDesignType.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* 5. Tune / Options Pill (Headline, CTA, Quality, Speed, Carousel) */}
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === "tune" ? null : "tune")
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0",
                  activePopover === "tune" || hasCustomTune
                    ? "bg-white/15 text-white border-white/25"
                    : "bg-[#1a1a22] hover:bg-[#22222c] text-[#b4b4c0] border-white/[0.07]"
                )}
                title="Headline, Quality, Speed & Carousel options"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Tune</span>
                {carouselMode && !editTarget && (
                  <span className="text-[10px] font-bold text-white">
                    {slideCount}s
                  </span>
                )}
                <span className="text-[10px] uppercase text-[#8b8b97]">
                  {quality}
                </span>
              </button>
            </div>

            {/* Right: Cost Badge + Grok Circular White Send Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-[#8b8b97] hidden sm:inline">
                {totalCost}c
              </span>

              <button
                type="button"
                onClick={() => {
                  setActivePopover(null);
                  handleGenerate();
                }}
                disabled={isPending || !prompt.trim()}
                className="w-9 h-9 rounded-full bg-white text-black hover:bg-white/90 disabled:bg-white/15 disabled:text-white/30 flex items-center justify-center transition-all active:scale-95 shadow-md"
                title="Generate (Enter)"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Fullscreen Lightbox */}
      <PreviewLightbox
        isOpen={Boolean(lightboxResult)}
        result={lightboxResult}
        onClose={() => setLightboxResult(null)}
        handleDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  );
}
