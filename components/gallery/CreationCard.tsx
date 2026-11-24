import React, { useState } from "react";
import Image from "next/image";
import { Layers, Film } from "lucide-react";

interface CreationCardProps {
  gen: any;
  index?: number;
  setSelectedGen: (gen: any) => void;
}

export function CreationCard({ gen, index = 0, setSelectedGen }: CreationCardProps) {
  const [hasError, setHasError] = useState(false);
  const [ready, setReady] = useState(false);
  const isVideo = typeof gen?.result_url === "string" && gen.result_url.endsWith(".mp4");

  if (hasError) return null;

  return (
    <button
      type="button"
      onClick={() => setSelectedGen(gen)}
      className="imaging-rise mb-1 w-full text-left bg-[#0e0e13] rounded-2xl overflow-hidden relative group border border-white/10 hover:border-white/25 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors"
      style={{ animationDelay: `${Math.min(index, 14) * 42}ms` }}
    >
      <div className="absolute inset-0 bg-white/[0.04] animate-pulse" />
      {gen.isCarousel && (
        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-semibold border border-white/20 flex items-center gap-1 z-10 select-none">
          <Layers className="w-3 h-3" />
          <span>{gen.slides?.length} slides</span>
        </div>
      )}
      {isVideo && (
        <div className="absolute top-2.5 right-2.5 bg-indigo-500/85 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-semibold border border-white/20 flex items-center gap-1 z-10 select-none">
          <Film className="w-3 h-3" />
          <span>VIDEO</span>
        </div>
      )}
      {isVideo ? (
        <video
          src={gen.result_url}
          muted
          loop
          playsInline
          autoPlay
          className={`imaging-photo relative w-full h-auto object-contain ${ready ? "is-ready" : ""}`}
          onLoadedData={() => setReady(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <Image
          src={gen.result_url}
          width={600}
          height={600}
          className={`imaging-photo relative w-full h-auto object-contain ${ready ? "is-ready" : ""}`}
          alt={gen.prompt || "Design"}
          loading="lazy"
          decoding="async"
          unoptimized
          onLoad={() => setReady(true)}
          onError={() => setHasError(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 pt-10 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <p className="text-white text-[11px] font-medium leading-relaxed line-clamp-2">
          {gen.prompt}
        </p>
      </div>
    </button>
  );
}
