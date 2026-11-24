"use client";

import React from "react";

export function InspirationSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="aspect-[3/4] rounded-2xl bg-muted/40 animate-pulse overflow-hidden border border-border/40"
        >
          <div className="w-full h-full bg-gradient-to-t from-muted/50 to-muted/10 opacity-60" />
        </div>
      ))}
    </div>
  );
}

export function LoadingMoreSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <div
          key={`loading-more-${i}`}
          className="aspect-[3/4] rounded-2xl bg-muted/40 animate-pulse overflow-hidden border border-border/40"
        >
          <div className="w-full h-full bg-gradient-to-t from-muted/50 to-muted/10 opacity-60" />
        </div>
      ))}
    </div>
  );
}
