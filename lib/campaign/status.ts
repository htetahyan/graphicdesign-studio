import "server-only";

import { eq, and, inArray } from "drizzle-orm";
import { db, campaigns, generations, generationJobs } from "@/lib/db";

export async function refreshCampaignStatus(campaignId: string) {
  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.id, campaignId),
    columns: { id: true, jobIds: true, status: true },
  });
  if (!campaign) return;

  const jobIds = campaign.jobIds || [];
  if (jobIds.length === 0) return;

  const jobs = await db.query.generationJobs.findMany({
    where: inArray(generationJobs.id, jobIds),
    columns: { id: true, status: true },
  });

  const completed = jobs.filter((j) => j.status === "completed").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  const pending = jobs.filter((j) => j.status === "pending" || j.status === "processing").length;

  let next: typeof campaign.status | null = null;
  if (pending > 0) {
    next = "generating";
  } else if (completed === 0) {
    next = "failed";
  } else if (campaign.status === "generating" || campaign.status === "failed") {
    next = "ready";
  }

  if (next && next !== campaign.status) {
    await db.update(campaigns).set({ status: next }).where(eq(campaigns.id, campaignId));
  }

  return { completed, failed, pending, total: jobs.length };
}

export async function latestAssetsForCampaign(campaignId: string) {
  const rows = await db.query.generations.findMany({
    where: eq(generations.campaignId, campaignId),
    orderBy: (generations, { desc }) => [desc(generations.createdAt)],
    columns: {
      id: true,
      resultUrl: true,
      prompt: true,
      params: true,
      createdAt: true,
      brandId: true,
    },
  });

  const byFormat = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const params = (row.params || {}) as Record<string, unknown>;
    const key = typeof params.formatKey === "string" ? params.formatKey : `asset-${row.id}`;
    if (!byFormat.has(key)) byFormat.set(key, row);
  }
  return Array.from(byFormat.entries()).map(([formatKey, generation]) => ({
    formatKey,
    generation,
  }));
}

export async function countCampaignAssets(campaignId: string) {
  const rows = await db
    .select({ id: generations.id })
    .from(generations)
    .where(eq(generations.campaignId, campaignId));
  return rows.length;
}
