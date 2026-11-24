"use client";

import React from "react";
import Image from "next/image";

interface GalleryHeaderProps {
  user: any;
  openSidebar: () => void;
}

export function GalleryHeader({ user, openSidebar }: GalleryHeaderProps) {
  return (
    <header className="relative px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-white/10 safe-area-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Studio logo"
            width={150}
            height={40}
            className="object-contain"
            priority
          />
          <span className="hidden sm:inline-flex items-center h-7 px-2.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-muted-foreground">
            Gallery
          </span>
        </div>
        <button
          onClick={openSidebar}
          className="h-9 w-9 rounded-full border border-white/15 bg-secondary p-0.5 flex items-center justify-center overflow-hidden hover:border-white/30 transition-all active:scale-95"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${user?.username}&background=14141a&color=fff&bold=true`}
            alt="User"
            className="h-full w-full object-cover rounded-full"
            loading="eager"
            decoding="async"
          />
        </button>
      </div>
    </header>
  );
}
