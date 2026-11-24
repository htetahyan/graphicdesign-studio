"use server";

import { eq, and, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { brands, generations, generationJobs } from "@/lib/db/schema";
import { getSessionUser } from "./user-auth";
import type { Brand as BrandType } from "@/app/(authenticated)/generate/types";

export const getBrands = async () => {
  const user = await getSessionUser();
  if (!user) return [];

  logger.debug("Fetching brands for user", { userId: user.id });

  const startTime = performance.now();
  const result = await db.query.brands.findMany({
    where: eq(brands.userId, user.id),
    columns: {
      id: true,
      userId: true,
      name: true,
      description: true,
      logoUrl: true,
      styleContext: true,
      createdAt: true,
    },
    orderBy: (brands, { desc }) => [desc(brands.createdAt)],
  });
  const duration = performance.now() - startTime;

  logger.database("getBrands", duration, {
    userId: user.id,
    count: result.length,
  });

  return result as Array<Record<string, unknown>>;
};

export const getBrandsLite = async () => {
  const user = await getSessionUser();
  if (!user) return [];

  const result = await db.query.brands.findMany({
    where: eq(brands.userId, user.id),
    columns: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      createdAt: true,
    },
    orderBy: (brands, { desc }) => [desc(brands.createdAt)],
  });

  return result.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    logo_url: b.logoUrl,
    created_at: b.createdAt.toISOString(),
  })) as BrandType[];
};

export const getHistory = async (limit = 10) => {
  const user = await getSessionUser();
  if (!user) return [];

  const result = await db.query.generations.findMany({
    where: eq(generations.userId, user.id),
    columns: {
      id: true,
      userId: true,
      brandId: true,
      prompt: true,
      resultUrl: true,
      params: true,
      createdAt: true,
    },
    with: {
      brand: {
        columns: { id: true, name: true, logoUrl: true },
      },
    },
    orderBy: (generations, { desc }) => [desc(generations.createdAt)],
    limit,
  });

  return result.map((g) => {
    const rawParams = (g.params || {}) as Record<string, any>;
    const sanitizedParams = {
      seriesId: rawParams.seriesId || null,
      slideIndex: typeof rawParams.slideIndex === 'number' ? rawParams.slideIndex : null,
      totalSlides: typeof rawParams.totalSlides === 'number' ? rawParams.totalSlides : null,
      speed: rawParams.speed || null,
      quality: rawParams.quality || null,
      cost: typeof rawParams.cost === 'number' ? rawParams.cost : null,
      aspectRatio: rawParams.aspectRatio || rawParams.generation_settings?.aspect_ratio || rawParams.aspect_ratio || null,
    };
    return {
      id: g.id,
      user_id: g.userId,
      brand_id: g.brandId,
      prompt: g.prompt,
      result_url: g.resultUrl,
      params: sanitizedParams,
      created_at: g.createdAt.toISOString(),
      brand_name: g.brand?.name ?? null,
      brand_logo: g.brand?.logoUrl ?? null,
    };
  }) as Array<Record<string, unknown>>;
};

export const getHistoryLite = async (limit = 10) => {
  const user = await getSessionUser();
  if (!user) return [];

  const result = await db.query.generations.findMany({
    where: eq(generations.userId, user.id),
    columns: {
      id: true,
      createdAt: true,
      resultUrl: true,
      prompt: true,
      brandId: true,
      params: true,
    },
    orderBy: (generations, { desc }) => [desc(generations.createdAt)],
    limit,
  });

  return result.map((g) => {
    const rawParams = (g.params || {}) as Record<string, any>;
    const sanitizedParams = {
      seriesId: rawParams.seriesId || null,
      slideIndex: typeof rawParams.slideIndex === 'number' ? rawParams.slideIndex : null,
      totalSlides: typeof rawParams.totalSlides === 'number' ? rawParams.totalSlides : null,
      speed: rawParams.speed || null,
      quality: rawParams.quality || null,
      cost: typeof rawParams.cost === 'number' ? rawParams.cost : null,
      aspectRatio: rawParams.aspectRatio || rawParams.generation_settings?.aspect_ratio || rawParams.aspect_ratio || null,
    };
    return {
      id: g.id,
      created_at: g.createdAt.toISOString(),
      result_url: g.resultUrl,
      prompt: g.prompt,
      brand_id: g.brandId,
      params: sanitizedParams,
    };
  }) as Array<Record<string, unknown>>;
};

export const getActiveJobs = async () => {
  const user = await getSessionUser();
  if (!user) return [];

  const result = await db.query.generationJobs.findMany({
    where: and(
      eq(generationJobs.userId, user.id),
      or(
        eq(generationJobs.status, "pending"),
        eq(generationJobs.status, "processing")
      )
    ),
    orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
  });

  return result.map((j) => ({
    id: j.id,
    status: j.status,
    prompt: j.prompt,
    created_at: j.createdAt.toISOString(),
  }));
};
