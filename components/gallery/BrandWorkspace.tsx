"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, ChevronRight, Wand2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandWorkspaceProps {
  brands: any[];
  hasBrands: boolean;
  openEditBrand: (brand: any) => void;
}

export function BrandWorkspace({ brands, hasBrands, openEditBrand }: BrandWorkspaceProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Brands
          </h2>
        </div>
        {!hasBrands || brands.length < 5 ? (
          <Link
            href="/brand/new"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-95"
          >
            New brand
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : null}
      </div>

      {hasBrands ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className="imaging-rise group relative bg-[#0e0e13] rounded-2xl p-4 border border-white/10 hover:border-white/25 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                    onClick={() => {
                      window.location.href = `/generate?brand=${brand.id}`;
                    }}
                  >
                    <div className="h-12 w-12 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center overflow-hidden transition-all group-hover:border-white/25">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain p-1.5"
                          alt={brand.name}
                          loading="lazy"
                          decoding="async"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground uppercase">
                          {brand.name.substring(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base leading-tight truncate text-foreground">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        Brand Identity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      window.location.href = `/generate?brand=${brand.id}`;
                    }}
                    className="flex-1 rounded-full h-9 bg-white text-black hover:bg-white/90 font-semibold text-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-2" />
                    Generate
                  </Button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openEditBrand(brand);
                    }}
                    className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                    title="Edit brand"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="imaging-rise py-16 text-center border border-dashed border-white/15 rounded-3xl bg-white/[0.03]">
          <div className="max-w-xs mx-auto space-y-4">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground font-medium">
              သင့် Workspace တွင် Brand များမရှိသေးပါ။ AI Design များစတင်ဖန်တီးရန် Brand အသစ်တစ်ခုအရင်ဖန်တီးပါ။
            </p>
            <Link href="/brand/new">
              <Button className="rounded-full bg-white text-black px-8 font-semibold h-11 hover:bg-white/90">
                Brand အသစ်ဖန်တီးမည်
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
