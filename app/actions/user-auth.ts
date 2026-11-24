"use server";

import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db, users } from "@/lib/db";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import bcrypt from "bcryptjs";

const SIGNUP_BONUS_CREDITS = 20;

function normalizeIp(val: string | null): string | null {
  const first = val?.trim().split(",")[0]?.trim();
  if (!first) return null;
  const noPort = first.includes(":") && first.includes(".") ? first.split(":")[0] : first;
  return noPort.replace(/^::ffff:/, "");
}

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  return ["cf-connecting-ip", "x-real-ip", "true-client-ip", "x-forwarded-for"]
    .map(key => normalizeIp(h.get(key)))
    .find(Boolean) || null;
}

export async function loginUser(_prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const passphrase = formData.get("passphrase") as string;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true, username: true, passphrase: true, credits: true },
  });

  if (!user || !(await bcrypt.compare(passphrase, user.passphrase))) {
    return { error: "အသုံးပြုသူအမည် သို့မဟုတ် စကားဝှက် မမှန်ပါ (Invalid)" };
  }

  const token = await createSessionToken({
    role: "user",
    userId: user.id,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });

  const cookieStore = await cookies();
  cookieStore.set("user_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/gallery");
}

export async function signupUser(_prevState: unknown, formData: FormData) {
  const username = (formData.get("username") as string | null)?.trim();
  const passphrase = formData.get("passphrase") as string;

  if (!username || username.length < 2) return { error: "အသုံးပြုသူအမည် အနည်းဆုံး 2 လုံးလိုအပ်သည်" };
  if (!passphrase || passphrase.length < 4) return { error: "စကားဝှက် အနည်းဆုံး 4 လုံးလိုအပ်သည်" };

  const signupIp = await getClientIp();
  if (!signupIp) return { error: "IP verification failed. Please try again." };

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });
  if (existing) return { error: "ဒီ username ကို အသုံးပြုပြီးသားပါ (Already taken)" };

  const ipAlreadyUsed = await db.query.users.findFirst({
    where: eq(users.signupIp, signupIp),
    columns: { id: true },
  });
  if (ipAlreadyUsed) return { error: "This IP has already registered an account." };

  const hashedPassphrase = await bcrypt.hash(passphrase, 10);

  try {
    const [user] = await db
      .insert(users)
      .values({
        username,
        passphrase: hashedPassphrase,
        credits: SIGNUP_BONUS_CREDITS,
        signupIp,
      })
      .returning({ id: users.id, username: users.username, credits: users.credits });

    if (!user) return { error: "အကောင့်ဖန်တီးမှု မအောင်မြင်ပါ (Failed)" };

    const token = await createSessionToken({
      role: "user",
      userId: user.id,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    });

    const cookieStore = await cookies();
    cookieStore.set("user_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    redirect("/gallery");
  } catch (error: any) {
    if (error?.code === "23505") return { error: "This IP has already registered an account." };
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: "အကောင့်ဖန်တီးမှု မအောင်မြင်ပါ (Failed)" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  cookieStore.delete("user_id");
  redirect("/signup");
}

export const getSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;
  const legacyUserId = cookieStore.get("user_id")?.value;

  let userId: string | undefined;

  if (token) {
    const payload = await verifySessionToken(token);
    if (!payload || payload.role !== "user" || !payload.userId) return null;
    userId = payload.userId;
  } else if (legacyUserId) {
    userId = legacyUserId;
  } else {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, username: true, credits: true, isBlocked: true },
  });

  return user as { id: string; username: string; credits: number; isBlocked: boolean } | null;
});

// Re-export user data query helpers for backward compatibility as explicit async functions to satisfy Turbopack server action rules
import {
  getBrands as originalGetBrands,
  getBrandsLite as originalGetBrandsLite,
  getHistory as originalGetHistory,
  getHistoryLite as originalGetHistoryLite,
  getActiveJobs as originalGetActiveJobs,
} from "./user-data";

export async function getBrands() {
  return originalGetBrands();
}

export async function getBrandsLite() {
  return originalGetBrandsLite();
}

export async function getHistory(limit?: number) {
  return originalGetHistory(limit);
}

export async function getHistoryLite(limit?: number) {
  return originalGetHistoryLite(limit);
}

export async function getActiveJobs() {
  return originalGetActiveJobs();
}
