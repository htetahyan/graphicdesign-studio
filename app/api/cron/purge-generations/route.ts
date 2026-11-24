import { type NextRequest } from "next/server";
import { lte, inArray } from "drizzle-orm";
import { db, generations, generationJobs } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Security Gate check
    if (process.env.NODE_ENV !== "development") {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const retentionHours = Number(process.env.RETENTION_HOURS || "48");
    const cutoff = new Date(Date.now() - retentionHours * 60 * 60 * 1000);

    logger.info(`Starting automatic purge for data older than ${retentionHours} hours (cutoff: ${cutoff.toISOString()})`);

    // 1. Retrieve all target candidate generations older than cutoff (no limit bottleneck)
    const oldGenerations = await db
      .select({ id: generations.id, resultUrl: generations.resultUrl })
      .from(generations)
      .where(lte(generations.createdAt, cutoff));

    const genIds = oldGenerations.map((g) => g.id);

    // 2. Parse relative paths from public URLs for Supabase Storage removal
    const filesToDelete: string[] = [];
    for (const gen of oldGenerations) {
      const match = gen.resultUrl.match(/\/brand-assets\/(.+)$/);
      if (match) {
        filesToDelete.push(decodeURIComponent(match[1]));
      }
    }

    let storageDeletedCount = 0;
    if (filesToDelete.length > 0) {
      // Chunk filesToDelete in batches of 100 to prevent API payload limits
      const chunkSize = 100;
      for (let i = 0; i < filesToDelete.length; i += chunkSize) {
        const chunk = filesToDelete.slice(i, i + chunkSize);
        const { data, error } = await supabaseAdmin.storage
          .from("brand-assets")
          .remove(chunk);

        if (error) {
          logger.error("Supabase Storage purge deletion encountered issues", error);
        } else {
          storageDeletedCount += data?.length || 0;
        }
      }
      logger.info(`Successfully purged ${storageDeletedCount} images from Supabase Storage.`);
    }

    // 3. Atomically purge generations rows by ID batches
    let dbGenerationsDeletedCount = 0;
    if (genIds.length > 0) {
      const deletedGenerations = await db
        .delete(generations)
        .where(inArray(generations.id, genIds))
        .returning({ id: generations.id });
      dbGenerationsDeletedCount = deletedGenerations.length;
    }

    // 4. Purge background jobs older than cutoff
    let dbJobsDeletedCount = 0;
    const deletedJobs = await db
      .delete(generationJobs)
      .where(lte(generationJobs.createdAt, cutoff))
      .returning({ id: generationJobs.id });
    dbJobsDeletedCount = deletedJobs.length;

    logger.info(`Database purge complete. Deleted ${dbGenerationsDeletedCount} generations and ${dbJobsDeletedCount} jobs.`);

    return Response.json({
      success: true,
      cutoff: cutoff.toISOString(),
      retentionHours,
      generationsFound: oldGenerations.length,
      storageFilesAttempted: filesToDelete.length,
      storageFilesDeleted: storageDeletedCount,
      dbGenerationsDeleted: dbGenerationsDeletedCount,
      dbJobsDeleted: dbJobsDeletedCount,
    });
  } catch (error: any) {
    // Let Next.js dynamic/prerender bailout exceptions bubble up naturally to mark route as dynamic
    if (
      error instanceof Error &&
      (error.message.includes("bail out") ||
        error.message.includes("dynamic server usage") ||
        (error as any).digest === "NEXT_DYNAMIC_NO_SSR_CODE")
    ) {
      throw error;
    }

    logger.error("Failed to run automated purging cron job", error);
    return Response.json({ success: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
