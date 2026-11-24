"use server";

import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";

import { checkAdminSession } from "@/lib/auth";
import { db, inspirationTemplates } from "@/lib/db";
import { analyzeInspirationTemplate } from "@/lib/ai/analyze-inspiration-template";

export async function getInspirationTemplates(params?: {
  industryId?: string;
  limit?: number;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const limit = params?.limit ?? 50;

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
      uploadthingKey: true,
      designData: true,
      createdAt: true,
    },
    orderBy: [desc(inspirationTemplates.createdAt)],
    limit,
  });

  return result.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function analyzeAndInsertInspirationTemplate(params: {
  industryId: string;
  name: string;
  imageUrl: string;
  uploadthingKey?: string | null;
}) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  if (!params.industryId) throw new Error("industryId is required");
  if (!params.name?.trim()) throw new Error("name is required");
  if (!params.imageUrl) throw new Error("imageUrl is required");

  const designData = await analyzeInspirationTemplate({
    industryId: params.industryId,
    imageUrl: params.imageUrl,
  });

  const [result] = await db
    .insert(inspirationTemplates)
    .values({
      industryId: params.industryId,
      name: params.name.trim(),
      imageUrl: params.imageUrl,
      uploadthingKey: params.uploadthingKey ?? null,
      designData: designData,
    })
    .returning();

  return {
    ...result,
    createdAt: result.createdAt.toISOString(),
  };
}
