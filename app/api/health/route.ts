import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Health check endpoint for load balancers, monitoring, and container orchestration.
 */
export async function GET() {
    let isHealthy = false;
    let duration = 0;
    let errorMsg: string | undefined = undefined;

    try {
        const start = performance.now();
        await db.execute(sql`SELECT 1`);
        duration = performance.now() - start;
        isHealthy = true;
    } catch (e: any) {
        errorMsg = e?.message || "Unknown DB error";
    }

    const status = isHealthy ? 200 : 503;

    return NextResponse.json(
        {
            status: isHealthy ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    healthy: isHealthy,
                    durationMs: Math.round(duration),
                    error: errorMsg,
                },
            },
        },
        { status }
    );
}
