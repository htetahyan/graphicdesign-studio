"use client";

import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";

type CampaignRow = {
  id: string;
  title: string;
  status: string;
  formats: string[];
  expectedAssetCount: number;
  createdAt: string;
  brandName: string;
  brandLogo: string | null;
};

export function CampaignList({ campaigns }: { campaigns: CampaignRow[] }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Packs</p>
            <h1 className="text-3xl font-semibold tracking-tight">Campaigns</h1>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            New pack
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="imaging-rise rounded-3xl border border-white/10 bg-[#0e0e13] text-foreground p-10 text-center space-y-3">
            <FolderKanban className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No campaigns yet. Create a brief to generate a format pack.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c, index) => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="imaging-rise flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#0e0e13] text-foreground hover:border-white/25 transition-colors"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {c.brandLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.brandLogo} alt="" className="h-12 w-12 rounded-md object-cover border border-border" />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-muted" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.brandName} · {c.expectedAssetCount} assets · {c.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
