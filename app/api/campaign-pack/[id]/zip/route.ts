import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, campaigns } from "@/lib/db";
import { getSessionUser } from "@/app/actions/user-auth";
import { latestAssetsForCampaign } from "@/lib/campaign/status";
import { formatByKey } from "@/lib/campaign/pack";
import { createStoreZip } from "@/lib/zip-store";

export const maxDuration = 60;

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, id), eq(campaigns.userId, user.id)),
    columns: { id: true, title: true, status: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const assets = await latestAssetsForCampaign(campaign.id);
  if (assets.length === 0) {
    return NextResponse.json({ error: "No assets ready yet" }, { status: 409 });
  }

  const files: { name: string; data: Uint8Array }[] = [];
  for (const { formatKey, generation } of assets) {
    const res = await fetch(generation.resultUrl);
    if (!res.ok) continue;
    const buf = new Uint8Array(await res.arrayBuffer());
    const ext = generation.resultUrl.toLowerCase().includes(".jpg") ? "jpg" : "png";
    const label = (formatByKey(formatKey)?.key || formatKey).replace(/[^a-z0-9_-]/gi, "-");
    files.push({ name: `${label}.${ext}`, data: buf });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "Could not download assets" }, { status: 502 });
  }

  const zip = createStoreZip(files);
  const safeTitle = campaign.title.replace(/[^a-z0-9]+/gi, "-").slice(0, 40) || "campaign";
  return new NextResponse(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeTitle}-pack.zip"`,
    },
  });
}
