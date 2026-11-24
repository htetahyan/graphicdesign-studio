import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Brand } from "../types";

interface UseBrandSyncProps {
  brands: Brand[];
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
}

export function useBrandSync({ brands, selectedBrandId, setSelectedBrandId }: UseBrandSyncProps) {
  const router = useRouter();

  // Initial sync from URL or localStorage — runs strictly ONCE on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlBrand = params.get("brand") || "";
    const storedBrand =
      typeof window !== "undefined"
        ? window.localStorage.getItem("lastBrandId") || ""
        : "";

    const preferred = urlBrand || storedBrand;
    const isValidPreferred =
      preferred && brands.some((b) => b.id === preferred);
    const isCurrentValid =
      selectedBrandId && brands.some((b) => b.id === selectedBrandId);

    if (!isCurrentValid && brands.length > 0) {
      setSelectedBrandId(isValidPreferred ? preferred : brands[0]?.id || "");
    }
  }, []);

  // Optimized event-driven select brand handler
  const selectBrand = (brandId: string) => {
    if (!brandId) return;
    
    setSelectedBrandId(brandId);

    try {
      window.localStorage.setItem("lastBrandId", brandId);
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const current = params.get("brand") || "";
    if (current !== brandId) {
      params.set("brand", brandId);
      router.replace(`/generate?${params.toString()}`);
    }
  };

  return { selectBrand };
}
