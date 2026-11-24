"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { createCampaignPack } from "@/app/actions/campaign";
import { CAMPAIGN_FORMATS, computePackCost, DEFAULT_CAMPAIGN_FORMATS } from "@/lib/campaign/pack";
import { useUI } from "@/components/context/ui-context";

type Brand = { id: string; name: string; logo_url?: string | null };

export function CampaignForm({
  userCredits,
  brands,
}: {
  userCredits: number;
  brands: Brand[];
}) {
  const router = useRouter();
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [brandId, setBrandId] = useState(brands[0]?.id || "");
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [offer, setOffer] = useState("");
  const [headline, setHeadline] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [formats, setFormats] = useState<string[]>([...DEFAULT_CAMPAIGN_FORMATS]);
  const [includeCarousel, setIncludeCarousel] = useState(false);
  const [lockedColors, setLockedColors] = useState("");
  const [doNotUse, setDoNotUse] = useState("");

  const cost = useMemo(
    () => computePackCost({ formatCount: formats.length, includeCarousel, quality: "hd" }).total,
    [formats.length, includeCarousel],
  );

  const toggleFormat = (key: string) => {
    setFormats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await createCampaignPack({
          brandId,
          title,
          brief,
          offer: offer || undefined,
          headline: headline || undefined,
          ctaText: ctaText || undefined,
          formats,
          includeCarousel,
          lockedColors: lockedColors || undefined,
          doNotUse: doNotUse || undefined,
        });
        for (const jobId of result.jobIds) {
          fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" }).catch(() => {});
        }
        showToast("Campaign pack queued", "success");
        router.push(`/campaigns/${result.campaignId}`);
      } catch (err: any) {
        showToast(err?.message || "Failed to create campaign", "error");
      }
    });
  };

  if (brands.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Create a brand first</h1>
          <Link href="/brand/new" className="text-sm font-bold underline">New brand</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ChevronLeft className="w-4 h-4" /> Campaigns
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">New campaign pack</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Client / brand</span>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm"
              required
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Campaign title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={2} className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brief</span>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} required minLength={8} rows={4} className="w-full rounded-md border border-border bg-secondary text-foreground px-3 py-2 text-sm" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Offer</span>
              <input value={offer} onChange={(e) => setOffer(e.target.value)} className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Headline</span>
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CTA</span>
            <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
          </label>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Formats</span>
            <div className="grid grid-cols-2 gap-2">
              {CAMPAIGN_FORMATS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFormat(f.key)}
                  className={`h-11 rounded-md border text-sm font-medium transition-colors ${formats.includes(f.key) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-foreground"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeCarousel} onChange={(e) => setIncludeCarousel(e.target.checked)} />
            Include carousel (4 slides)
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Locked colors</span>
            <input value={lockedColors} onChange={(e) => setLockedColors(e.target.value)} placeholder="#0B3D2E, gold" className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Do not use</span>
            <input value={doNotUse} onChange={(e) => setDoNotUse(e.target.value)} className="w-full h-11 rounded-md border border-border bg-secondary text-foreground px-3 text-sm" />
          </label>
          <button
            type="submit"
            disabled={isPending || formats.length === 0 || userCredits < cost}
            className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : `Generate pack · ${cost} credits`}
          </button>
        </form>
      </div>
    </main>
  );
}
