"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "./user-auth";
import { revalidatePath } from "next/cache";
import { processBrandAnalysis } from "./brand/analysis";
import { uploadBrandLogo } from "./brand/assets";
import { eq, and, sql } from "drizzle-orm";
import { db, brands, brandImages, generations } from "@/lib/db";
import { z } from "zod";

const CreateBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100, "Brand name is too long"),
  description: z.string().nullable().optional(),
  preferredCtas: z.string().nullable().optional(),
  brandVoice: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  designSource: z.string().default("my_brand"),
});

export async function createBrand(formData: FormData) {
  try {
    const user = (await getSessionUser()) as { id: string; username: string; credits: number } | null;
    if (!user) return { success: false as const, error: "Unauthorized" };

    const brandCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(brands)
      .where(eq(brands.userId, user.id));

    if ((brandCountResult[0]?.count ?? 0) >= 5) {
      return { success: false as const, error: "Brand အရေအတွက် ၅ ခု ပြည့်သွားပါပြီ။ အသစ်ထပ်မံဖန်တီးရန် အဟောင်းများကို ဖျက်ပါ။ (Limit reached: 5 brands)" };
    }

    const parsed = CreateBrandSchema.safeParse({
      name: formData.get("name") as string,
      description: formData.get("description") as string | null,
      preferredCtas: formData.get("preferredCtas") as string | null,
      brandVoice: formData.get("brandVoice") as string | null,
      industry: formData.get("industry") as string | null,
      designSource: (formData.get("designSource") as string | null) || "my_brand",
    });

    if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message };

    const { name, description: manualDescription = null, preferredCtas = null, brandVoice = null, industry = null, designSource } = parsed.data;
    const logo = formData.get("logo") as File | null;
    const images = formData.getAll("images") as File[];
    const referenceImages = formData.getAll("referenceImages") as File[];

    let inspirationTemplateIds: string[] | null = null;
    const rawIds = formData.get("inspirationTemplateIds") as string | null;
    if (rawIds) {
      try {
        const parsedIds = JSON.parse(rawIds);
        if (Array.isArray(parsedIds)) inspirationTemplateIds = parsedIds;
      } catch (e) { console.warn("Invalid template ids:", rawIds); }
    }

    const styleContext = await processBrandAnalysis({
      userId: user.id, images, referenceImages, logo, designSource,
      industry, brandVoice, manualDescription, preferredCtas, inspirationTemplateIds,
    });

    const description = styleContext?.brand_summary || manualDescription || "Brand style context ready for AI generation.";
    let logoUrl: string | null = null;
    if (logo && logo.size > 0) logoUrl = await uploadBrandLogo(user.id, logo);

    const enrichedStyleContext = styleContext
      ? {
          ...styleContext, design_source: designSource, _manualInput: !!(manualDescription || preferredCtas),
          preferred_ctas: preferredCtas, brand_voice: brandVoice, industry, inspiration_template_ids: inspirationTemplateIds,
        }
      : manualDescription || preferredCtas
      ? {
          _manualInput: true, design_source: designSource, preferred_ctas: preferredCtas,
          brand_voice: brandVoice, industry, inspiration_template_ids: inspirationTemplateIds, brand_summary: manualDescription,
        }
      : null;

    const [brand] = await db
      .insert(brands)
      .values({ userId: user.id, name, description, logoUrl, styleContext: enrichedStyleContext })
      .returning({
        id: brands.id,
        userId: brands.userId,
        name: brands.name,
        description: brands.description,
        logoUrl: brands.logoUrl,
        styleContext: brands.styleContext,
        createdAt: brands.createdAt,
      });

    if (!brand) return { success: false as const, error: "Failed to create brand: Unknown DB error" };

    revalidatePath("/profile");
    revalidatePath("/gallery");
    return { success: true as const, brand };
  } catch (e: any) {
    return { success: false as const, error: e?.message || "Failed to create brand" };
  }
}

const UpdateBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100, "Brand name is too long"),
});

export async function updateBrand(brandId: string, formData: FormData) {
  const user = (await getSessionUser()) as { id: string; username: string; credits: number } | null;
  if (!user) throw new Error("Unauthorized");

  const parsed = UpdateBrandSchema.safeParse({ name: formData.get("name") as string });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { name } = parsed.data;
  const logo = formData.get("logo") as File | null;

  const existingBrand = await db.query.brands.findFirst({
    where: and(eq(brands.id, brandId)),
    columns: { userId: true, logoUrl: true },
  });

  if (!existingBrand || existingBrand.userId !== user.id) {
    throw new Error("Unauthorized: You can only edit your own brands");
  }

  let logoUrl: string | null = existingBrand.logoUrl;
  if (logo && logo.size > 0) {
    logoUrl = await uploadBrandLogo(user.id, logo);
  }

  const [brand] = await db
    .update(brands)
    .set({ name, logoUrl })
    .where(eq(brands.id, brandId))
    .returning({
      id: brands.id,
      userId: brands.userId,
      name: brands.name,
      description: brands.description,
      logoUrl: brands.logoUrl,
      styleContext: brands.styleContext,
      createdAt: brands.createdAt,
    });

  if (!brand) throw new Error("Failed to update brand: Unknown DB error");

  revalidatePath("/profile");
  revalidatePath("/gallery");
  return { success: true, brand };
}

export async function deleteBrand(brandId: string) {
  const user = (await getSessionUser()) as { id: string; username: string; credits: number } | null;
  if (!user) throw new Error("Unauthorized");

  const existingBrand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
    columns: { userId: true },
  });

  if (!existingBrand || existingBrand.userId !== user.id) {
    throw new Error("Unauthorized: You can only delete your own brands");
  }

  await db.update(generations).set({ brandId: null }).where(eq(generations.brandId, brandId));
  await db.delete(brandImages).where(eq(brandImages.brandId, brandId));
  await db.delete(brands).where(eq(brands.id, brandId));

  revalidatePath("/profile");
  revalidatePath("/gallery");
  return { success: true };
}
