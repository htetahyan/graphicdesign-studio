import { eq } from "drizzle-orm";
import { users } from "@/lib/db";

export function isRateLimitError(error: any): boolean {
  const msg = String(error?.message || "").toLowerCase();
  return msg.includes("429") || 
         msg.includes("rate limit") || 
         msg.includes("quota") || 
         msg.includes("busy") || 
         msg.includes("overloaded") || 
         msg.includes("503") || 
         msg.includes("unavailable") || 
         msg.includes("deadline") || 
         msg.includes("timeout") || 
         msg.includes("fetch failed");
}

export async function refundUserCredits(db: any, userId: string, amount: number = 10) {
  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { credits: true },
  });
  if (userData) {
    await db
      .update(users)
      .set({ credits: (userData.credits ?? 0) + amount })
      .where(eq(users.id, userId));
  }
}
