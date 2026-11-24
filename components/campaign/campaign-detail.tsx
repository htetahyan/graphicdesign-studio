"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { requestCampaignRevision, shareCampaignForReview } from "@/app/actions/campaign";
import { checkJobStatus } from "@/app/actions/generate";
import { useUI } from "@/components/context/ui-context";

type Asset = {
  formatKey: string;
  label: string;
  aspectRatio: string | null;
  id: string;
  resultUrl: string;
  createdAt: string;
};

type Campaign = {
  id: string;
  title: string;
  brief: string;
  status: string;
  jobIds: string[];
  reviewUrl: string;
  clientNote: string | null;
  assets: Asset[];
  brand: { name: string; logoUrl: string | null } | null;
};

export function CampaignDetail({
  campaign,
}: {
  campaign: Campaign;
  credits: number;
}) {
  const router = useRouter();
  const { showToast } = useUI();
  const [copied, setCopied] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [selectedId, setSelectedId] = useState(campaign.assets[0]?.id || "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (campaign.status !== "generating" || campaign.jobIds.length === 0) return;
    campaign.jobIds.forEach((jobId) => {
      fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" }).catch(() => {});
    });
    const timer = setInterval(async () => {
      const results = await Promise.all(campaign.jobIds.map((id) => checkJobStatus(id).catch(() => null)));
      if (results.some((r) => r?.status === "completed" || r?.status === "failed")) {
        router.refresh();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [campaign.jobIds, campaign.status, router]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(campaign.reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = () => {
    startTransition(async () => {
      try {
        const { reviewUrl } = await shareCampaignForReview(campaign.id);
        await navigator.clipboard.writeText(reviewUrl);
        showToast("Review link copied", "success");
        router.refresh();
      } catch (e: any) {
        showToast(e?.message || "Could not share", "error");
      }
    });
  };

  const revise = () => {
    if (!selectedId) return;
    startTransition(async () => {
      try {
        const { jobId } = await requestCampaignRevision({
          campaignId: campaign.id,
          generationId: selectedId,
          instruction,
        });
        fetch(`/api/process-job?jobId=${jobId}`, { method: "POST" }).catch(() => {});
        setInstruction("");
        showToast("Revision queued", "success");
        router.refresh();
      } catch (e: any) {
        showToast(e?.message || "Revision failed", "error");
      }
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <Link href="/campaigns" className="text-sm text-muted-foreground">← Campaigns</Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground capitalize">{campaign.status}</p>
            <h1 className="text-3xl font-semibold tracking-tight">{campaign.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{campaign.brand?.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyLink} className="h-10 px-3.5 rounded-full border border-white/10 bg-white/[0.04] text-sm inline-flex items-center gap-2 hover:bg-white/10 transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy review link
            </button>
            <button onClick={share} disabled={isPending} className="h-10 px-3.5 rounded-full border border-white/10 bg-white/[0.04] text-sm hover:bg-white/10 transition-colors">
              Send to client
            </button>
            <a href={`/api/campaign-pack/${campaign.id}/zip`} className="h-10 px-3.5 rounded-full bg-white text-black text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/90">
              <Download className="w-4 h-4" /> Zip
            </a>
          </div>
        </div>
        <p className="text-sm whitespace-pre-wrap">{campaign.brief}</p>
        {campaign.clientNote && (
          <div className="rounded-md border border-border bg-card text-foreground p-3 text-sm">Client note: {campaign.clientNote}</div>
        )}
        {campaign.status === "generating" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Generating pack…
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {campaign.assets.map((asset, index) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setSelectedId(asset.id)}
              className={`imaging-rise rounded-2xl overflow-hidden border bg-[#0e0e13] text-foreground transition-colors ${selectedId === asset.id ? "border-white" : "border-white/10 hover:border-white/25"}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.resultUrl} alt={asset.label} className="imaging-photo is-ready w-full aspect-square object-cover" />
              <p className="text-[11px] font-semibold p-2.5 text-left">{asset.label}</p>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#0e0e13] text-foreground p-4 space-y-3">
          <p className="text-sm font-semibold">Revise selected design</p>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={3}
            placeholder="Change the price to 15,000 Ks"
            className="w-full rounded-2xl border border-white/10 bg-black/30 text-foreground px-3 py-2 text-sm outline-none focus:border-white/30"
          />
          <button onClick={revise} disabled={isPending || instruction.trim().length < 3} className="h-10 px-4 rounded-full bg-white text-black text-sm font-semibold disabled:opacity-40">
            Apply edit
          </button>
        </div>
      </div>
    </main>
  );
}
