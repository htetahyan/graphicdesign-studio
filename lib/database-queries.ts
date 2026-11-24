/**
 * Optimized database query utilities — Drizzle ORM version
 *
 * With Drizzle, most of the old query wrappers are unnecessary because:
 * - Relational queries replace the N+1 workarounds and SQL views
 * - Type safety removes the need for manual error checking
 * - Direct PostgreSQL connection eliminates PostgREST overhead
 *
 * This file is kept for backward compatibility (cache invalidation API)
 * and the performance monitoring wrapper.
 */

import { logger } from "./logger";

// Generic query wrapper with performance monitoring
export async function executeQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<{ data: T; performanceTime?: number }> {
  const startTime = performance.now();

  try {
    const data = await queryFn();
    const endTime = performance.now();
    const performanceTime = endTime - startTime;

    // Log performance
    logger.database(queryName, performanceTime, {
      success: true,
      hasData: !!data,
    });

    // Log slow queries
    if (performanceTime > 1000) {
      logger.warn(`Slow query detected: ${queryName}`, {
        duration: performanceTime,
        threshold: 1000,
      });
    }

    return { data, performanceTime };
  } catch (error) {
    const endTime = performance.now();
    const performanceTime = endTime - startTime;

    logger.error(`Query failed: ${queryName}`, error as Error, {
      duration: performanceTime,
    });

    throw error;
  }
}

// Cache utilities (kept for API compatibility)
export const cacheKeys = {
  userBrands: (userId: string) => `user-brands-${userId}`,
  userHistory: (userId: string) => `user-history-${userId}`,
};

// Query invalidation helpers (no-ops — Drizzle queries are direct, no caching layer)
export const invalidateCache = {
  userBrands: (_userId: string) => {},
  userHistory: (_userId: string) => {},
};
