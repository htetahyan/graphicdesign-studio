"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  setIsLoadingMore: (loading: boolean) => void;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  totalLength: number;
}

export function useInfiniteScroll({
  hasMore,
  isLoadingMore,
  setIsLoadingMore,
  setVisibleCount,
  totalLength,
}: UseInfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore && hasMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            setIsLoadingMore(false);
          }, 200);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "200px",
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, totalLength, setIsLoadingMore, setVisibleCount]);

  return loadMoreRef;
}
