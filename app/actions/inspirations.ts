"use server";

import { eq, desc } from "drizzle-orm";
import { db, inspirationTemplates } from "@/lib/db";
import type { InspirationTemplate } from "@/app/(authenticated)/brand/new/templates";

export async function fetchInspirationTemplates(params?: {
  industryId?: string;
  limit?: number;
  offset?: number;
}): Promise<InspirationTemplate[]> {
  const limit = params?.limit ?? 200;
  const offset = params?.offset ?? 0;
  
  const whereClause = params?.industryId
    ? eq(inspirationTemplates.industryId, params.industryId)
    : undefined;

  const result = await db.query.inspirationTemplates.findMany({
    where: whereClause,
    columns: {
      id: true,
      industryId: true,
      name: true,
      imageUrl: true,
      designData: true,
      createdAt: true,
    },
    orderBy: [desc(inspirationTemplates.createdAt)],
    limit,
    offset,
  });

  return result.map((row) => ({
    id: row.id,
    industryId: row.industryId,
    name: row.name,
    imageUrl: row.imageUrl,
    designData: row.designData as any,
  }));
}
