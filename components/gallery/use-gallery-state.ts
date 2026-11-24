import { useState, useMemo, useEffect, useRef } from "react";
import { useUI } from "@/components/context/ui-context";
import { updateBrand, deleteBrand } from "@/app/actions/brand";

export function useGalleryState(history: any[]) {
  const { showToast } = useUI();
  
  // Brand Editing States
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingBrand, setIsDeletingBrand] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<any>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Gallery Filtering & Actions States
  const [selectedGen, setSelectedGen] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrandId, setFilterBrandId] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDownloading, setIsDownloading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const [isLoading, setIsLoading] = useState(false);
  const [imageCache, setImageCache] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filtered & Grouped History
  const filteredHistory = useMemo(() => {
    let result = [...history];
    if (filterBrandId !== "all") result = result.filter((gen) => gen.brand_id === filterBrandId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((gen) => gen.prompt?.toLowerCase().includes(q));
    }

    // Group generations by seriesId (carousel posts)
    const groups: Record<string, any> = {};
    const singleItems: any[] = [];

    result.forEach((gen) => {
      const seriesId = gen.params?.seriesId;
      if (seriesId) {
        if (!groups[seriesId]) {
          groups[seriesId] = {
            id: `series-${seriesId}`,
            isCarousel: true,
            seriesId,
            prompt: gen.prompt,
            brand_id: gen.brand_id,
            created_at: gen.created_at,
            slides: [],
          };
        }
        groups[seriesId].slides.push(gen);
        // Ensure group has the latest creation time
        if (new Date(gen.created_at).getTime() > new Date(groups[seriesId].created_at).getTime()) {
          groups[seriesId].created_at = gen.created_at;
        }
      } else {
        singleItems.push(gen);
      }
    });

    // Sort slide items within each group by slideIndex
    Object.values(groups).forEach((group: any) => {
      group.slides.sort((a: any, b: any) => (a.params?.slideIndex ?? 0) - (b.params?.slideIndex ?? 0));
      // Use the first slide URL as the group thumbnail URL
      group.result_url = group.slides[0]?.result_url;
    });

    const combined = [...singleItems, ...Object.values(groups)];

    // Sort by created_at time
    combined.sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });

    return combined;
  }, [history, searchQuery, filterBrandId, sortBy]);

  const displayHistory = useMemo(() => filteredHistory.slice(0, visibleCount), [filteredHistory, visibleCount]);

  // Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading && visibleCount < filteredHistory.length) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 12, filteredHistory.length));
          setIsLoading(false);
        }, 200);
      }
    }, { threshold: 0.05, rootMargin: "400px" });

    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [filteredHistory.length, visibleCount, isLoading]);

  const handleDownload = async (url: string, filename: string) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { downloadImage } = await import("@/lib/download");
      const result = await downloadImage(url, filename);
      showToast(result.toastMessage, result.toastType, result.toastType === "info" ? 5000 : 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[Gallery] Download failed:", errorMessage);
      showToast(`❌ ဒေါင်းလုဒ် မအောင်မြင်ပါ: ${errorMessage}`, "error", 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast("📋 Prompt ကို ကူးယူပြီးပါပြီ (Copied)", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const closeModal = () => setSelectedGen(null);

  const openEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setEditName(brand?.name ?? "");
    setEditLogo(null);
  };

  const closeEditBrand = () => {
    setEditingBrand(null);
    setEditName("");
    setEditLogo(null);
  };

  const submitEditBrand = async () => {
    if (!editingBrand) return;
    if (editName.trim().length < 2) {
      showToast("Brand name သည် အနည်းဆုံး 2 အက္ခရာ ရှိရပါမယ်", "error");
      return;
    }
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editLogo) formData.append("logo", editLogo);
      const res = await updateBrand(editingBrand.id, formData);
      if ((res as any)?.success) {
        showToast("Brand updated successfully", "success");
        closeEditBrand();
        window.location.reload();
      }
    } catch (e: any) {
      showToast(e?.message || "Failed to update brand", "error");
    } finally {
      setIsEditing(false);
    }
  };

  const submitDeleteBrand = async () => {
    if (!editingBrand) return;
    setIsDeletingBrand(true);
    try {
      const res = await deleteBrand(editingBrand.id);
      if ((res as any)?.success) {
        showToast("Brand deleted successfully", "success");
        closeEditBrand();
        window.location.reload();
      }
    } catch (e: any) {
      showToast(e?.message || "Failed to delete brand", "error");
    } finally {
      setIsDeletingBrand(false);
    }
  };

  return {
    editingBrand, editName, setEditName, editLogo, setEditLogo, isEditing, isDeletingBrand,
    brandToDelete, setBrandToDelete, logoInputRef, selectedGen, setSelectedGen, isCopied,
    searchQuery, setSearchQuery, filterBrandId, setFilterBrandId, sortBy, setSortBy,
    isDownloading, visibleCount, isLoading, imageCache, setImageCache, loadMoreRef,
    filteredHistory, displayHistory, handleDownload, copyPrompt, closeModal,
    openEditBrand, closeEditBrand, submitEditBrand, submitDeleteBrand,
  };
}
