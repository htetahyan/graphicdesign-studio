"use client";

import React, { use } from "react";
import { useUI } from "@/components/context/ui-context";
import { useGalleryState } from "./use-gallery-state";

// Sub-components
import { GalleryHeader } from "./GalleryHeader";
import { BrandWorkspace } from "./BrandWorkspace";
import { CreationsGallery } from "./CreationsGallery";
import { PreviewModal } from "./PreviewModal";
import { BrandDialogs } from "./BrandDialogs";
import { CreditsHero } from "./CreditsHero";

interface GalleryClientProps {
  user: any;
  historyPromise: Promise<any[]>;
  brandsPromise: Promise<any[]>;
}

export function GalleryClient({
  user,
  historyPromise,
  brandsPromise,
}: GalleryClientProps) {
  const history = use(historyPromise);
  const brands = use(brandsPromise);
  const hasHistory = history.length > 0;
  const hasBrands = brands.length > 0;

  const { openSidebar } = useUI();
  const state = useGalleryState(history);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% -20%, rgba(255,255,255,0.07), transparent 70%)",
        }}
      />
      <BrandDialogs
        editingBrand={state.editingBrand}
        closeEditBrand={state.closeEditBrand}
        editName={state.editName}
        setEditName={state.setEditName}
        editLogo={state.editLogo}
        setEditLogo={state.setEditLogo}
        isEditing={state.isEditing}
        isDeletingBrand={state.isDeletingBrand}
        brandToDelete={state.brandToDelete}
        setBrandToDelete={state.setBrandToDelete}
        logoInputRef={state.logoInputRef}
        submitEditBrand={state.submitEditBrand}
        submitDeleteBrand={state.submitDeleteBrand}
      />

      <GalleryHeader user={user} openSidebar={openSidebar} />

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 space-y-6">
        <CreditsHero user={user} />

        <BrandWorkspace
          brands={brands}
          hasBrands={hasBrands}
          openEditBrand={state.openEditBrand}
        />

        {(hasHistory || state.searchQuery) && (
          <CreationsGallery
            hasHistory={hasHistory}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            filteredHistory={state.filteredHistory}
            displayHistory={state.displayHistory}
            filterBrandId={state.filterBrandId}
            setFilterBrandId={state.setFilterBrandId}
            sortBy={state.sortBy}
            setSortBy={(val) => state.setSortBy(val as any)}
            setSelectedGen={state.setSelectedGen}
            visibleCount={state.visibleCount}
            isLoading={state.isLoading}
            loadMoreRef={state.loadMoreRef}
            brands={brands}
            hasBrands={hasBrands}
          />
        )}
      </main>

      <PreviewModal
        selectedGen={state.selectedGen}
        closeModal={state.closeModal}
        copyPrompt={state.copyPrompt}
        isCopied={state.isCopied}
        handleDownload={state.handleDownload}
        isDownloading={state.isDownloading}
        imageCache={state.imageCache}
        setImageCache={state.setImageCache}
      />
    </div>
  );
}
