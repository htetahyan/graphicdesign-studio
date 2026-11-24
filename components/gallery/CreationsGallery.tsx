"use client";

import React from "react";
import { Search, Image as ImageIcon, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreationCard } from "./CreationCard";

interface CreationsGalleryProps {
  hasHistory: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredHistory: any[];
  displayHistory: any[];
  filterBrandId: string;
  setFilterBrandId: (id: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  setSelectedGen: (gen: any) => void;
  visibleCount: number;
  isLoading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  brands: any[];
  hasBrands: boolean;
}

export function CreationsGallery({
  hasHistory,
  searchQuery,
  setSearchQuery,
  filteredHistory,
  displayHistory,
  filterBrandId,
  setFilterBrandId,
  sortBy,
  setSortBy,
  setSelectedGen,
  visibleCount,
  isLoading,
  loadMoreRef,
  brands,
  hasBrands,
}: CreationsGalleryProps) {
  const hasSearchResults = displayHistory.length > 0;

  return (
    <section className="space-y-4 pt-2 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {searchQuery ? "Search results" : "Designs"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? `${filteredHistory.length} results for "${searchQuery}"`
              : "Your latest designs"}
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your history..."
              className="w-full h-11 rounded-full bg-[#121218] text-foreground border border-white/10 pl-10 pr-10 text-sm focus:border-white/30 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {hasBrands && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48">
            <Select
              value={filterBrandId}
              onValueChange={(value: string) => setFilterBrandId(value)}
            >
              <SelectTrigger className="h-10 rounded-full border-white/10 bg-[#121218] text-foreground text-xs font-semibold">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="all" className="text-xs font-medium">All brands</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs font-medium">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className="h-10 rounded-full border-white/10 bg-[#121218] text-foreground text-xs font-semibold">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-popover border-border text-popover-foreground">
                <SelectItem value="newest" className="text-xs font-medium">Newest first</SelectItem>
                <SelectItem value="oldest" className="text-xs font-medium">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {hasSearchResults ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4 items-start">
          {displayHistory.map((gen: any, index: number) => (
            <CreationCard
              key={gen.id}
              gen={gen}
              index={index}
              setSelectedGen={setSelectedGen}
            />
          ))}
          
          {visibleCount < filteredHistory.length && (
            <div ref={loadMoreRef} className="col-span-full py-10 flex justify-center">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <div className="h-4" />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="imaging-rise py-16 text-center border border-dashed border-white/15 rounded-3xl bg-white/[0.03]">
          <p className="text-muted-foreground font-medium">
            &quot;{searchQuery}&quot; အတွက် ရလဒ်များ မတွေ့ပါ
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm font-bold text-primary hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
}
