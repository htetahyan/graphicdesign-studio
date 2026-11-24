"use server";

import { and, eq, gt } from "drizzle-orm";
import { db, designSessions } from "@/lib/db";
import { getSessionUser } from "@/app/actions/user-auth";
import type { ChatTurn } from "@/app/(authenticated)/generate/types";

const SESSION_MS = 3 * 60 * 60 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function keepUrl(value: unknown) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function persistableTurns(turns: ChatTurn[]) {
  return turns.slice(-30).flatMap((turn) => {
    if (!turn?.id || !turn.userPrompt) return [];
    return [{
      id: turn.id,
      createdAt: turn.createdAt,
      userPrompt: turn.userPrompt.slice(0, 4000),
      brandId: turn.brandId,
      aspectRatio: turn.aspectRatio,
      designType: turn.designType,
      quality: turn.quality,
      speed: turn.speed,
      customHeadline: turn.customHeadline,
      ctaText: turn.ctaText,
      carouselMode: Boolean(turn.carouselMode),
      slideCount: turn.slideCount || 1,
      editSourceUrl: keepUrl(turn.editSourceUrl) ? turn.editSourceUrl : undefined,
      subjectPreviews: (turn.subjectPreviews || []).filter(keepUrl).slice(0, 4),
      referencePreviews: (turn.referencePreviews || []).filter(keepUrl).slice(0, 4),
      jobIds: (turn.jobIds || []).slice(0, 12),
      status: turn.status,
      error: turn.error?.slice(0, 500),
      results: (turn.results || []).slice(0, 8).flatMap((result) => {
        if (!keepUrl(result?.result_url)) return [];
        return [{
          id: result.id,
          result_url: result.result_url,
          prompt: result.prompt,
          aspect_ratio: result.aspect_ratio,
          status: result.status,
          brand_id: result.brand_id,
          created_at: result.created_at,
        }];
      }),
    }];
  });
}

export async function resolveDesignSession(requestedId?: string | null) {
  const user = await getSessionUser();
  if (!user || user.isBlocked) throw new Error("Please log in.");

  const now = new Date();
  if (requestedId && UUID_RE.test(requestedId)) {
    const existing = await db.query.designSessions.findFirst({
      where: and(
        eq(designSessions.id, requestedId),
        eq(designSessions.userId, user.id),
        gt(designSessions.expiresAt, now),
      ),
    });
    if (existing) {
      await db
        .update(designSessions)
        .set({ lastActiveAt: now })
        .where(eq(designSessions.id, existing.id));
      return {
        id: existing.id,
        expiresAt: existing.expiresAt.toISOString(),
        turns: Array.isArray(existing.turns) ? existing.turns : [],
      };
    }
  }

  const expiresAt = new Date(now.getTime() + SESSION_MS);
  const [created] = await db
    .insert(designSessions)
    .values({
      userId: user.id,
      turns: [],
      expiresAt,
      lastActiveAt: now,
    })
    .returning({ id: designSessions.id, expiresAt: designSessions.expiresAt });

  return {
    id: created.id,
    expiresAt: created.expiresAt.toISOString(),
    turns: [] as unknown[],
  };
}

export async function saveDesignSession(sessionId: string, turns: ChatTurn[]) {
  const user = await getSessionUser();
  if (!user || user.isBlocked) return { ok: false as const, expired: true };
  if (!UUID_RE.test(sessionId)) return { ok: false as const, expired: true };

  const now = new Date();
  const existing = await db.query.designSessions.findFirst({
    where: and(
      eq(designSessions.id, sessionId),
      eq(designSessions.userId, user.id),
      gt(designSessions.expiresAt, now),
    ),
    columns: { id: true },
  });
  if (!existing) return { ok: false as const, expired: true };

  await db
    .update(designSessions)
    .set({
      turns: persistableTurns(turns),
      lastActiveAt: now,
    })
    .where(eq(designSessions.id, sessionId));

  return { ok: true as const, expired: false };
}
