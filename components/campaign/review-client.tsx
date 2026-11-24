"use client";

import { useState, useTransition } from "react";
import { submitReviewDecision } from "@/app/actions/campaign";

type ReviewCampaign = {
  status: string;
  title: string;
  brief?: string;
  offer?: string | null;
  brandName: string;
  brandLogo: string | null;
  clientNote: string | null;
  assets: { formatKey: string; label: string; resultUrl: string }[];
};

export function ReviewClient({
  token,
  campaign,
}: {
  token: string;
  campaign: ReviewCampaign;
}) {
  const [note, setNote] = useState("");
  const [done, setDone] = useState<"approved" | "changes_requested" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (decision: "approved" | "changes_requested") => {
    startTransition(async () => {
      try {
        setError(null);
        await submitReviewDecision({ token, decision, note: note || undefined });
        setDone(decision);
      } catch (e: any) {
        setError(e?.message || "Could not submit review");
      }
    });
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{done === "approved" ? "Approved" : "Changes requested"}</h1>
          <p className="text-sm text-muted-foreground">Thank you. The studio has been notified.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {campaign.brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={campaign.brandLogo} alt="" className="h-10 object-contain" />
        ) : null}
        <p className="text-[11px] font-semibold text-muted-foreground">{campaign.brandName}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{campaign.title}</h1>
        {campaign.status === "generating" ? (
          <p className="text-sm text-muted-foreground">This pack is still generating. Refresh in a minute.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {campaign.assets.map((asset, index) => (
                <div
                  key={asset.formatKey}
                  className="imaging-rise rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e13] text-foreground"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.resultUrl} alt={asset.label} className="imaging-photo is-ready w-full object-cover" />
                  <p className="text-[11px] font-semibold p-2.5">{asset.label}</p>
                </div>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Optional notes / requested changes"
              className="w-full rounded-2xl border border-white/10 bg-[#121218] text-foreground px-3 py-2 text-sm outline-none focus:border-white/30"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                disabled={isPending}
                onClick={() => submit("changes_requested")}
                className="flex-1 h-11 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/5"
              >
                Request changes
              </button>
              <button
                disabled={isPending}
                onClick={() => submit("approved")}
                className="flex-1 h-11 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90"
              >
                Approve
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
