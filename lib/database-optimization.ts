/**
 * Database optimization utilities — Drizzle ORM version
 *
 * Most of the old optimization utilities are no longer needed because:
 * - SQL views (brands_with_images, generations_with_brand) are replaced
 *   by Drizzle relational queries with `with: { ... }`
 * - N+1 query problems are solved at the ORM level
 * - Direct PostgreSQL connection eliminates PostgREST overhead
 *
 * This file is kept for the performance monitoring class only.
 */

// Performance monitoring for database queries
export class DatabasePerformanceMonitor {
  private static queryTimes: Map<string, number[]> = new Map();

  static trackQuery(queryName: string, durationMs: number) {
    if (!this.queryTimes.has(queryName)) {
      this.queryTimes.set(queryName, []);
    }
    this.queryTimes.get(queryName)!.push(durationMs);

    if (durationMs > 1000) {
      console.warn(
        `Slow query detected: ${queryName} took ${durationMs.toFixed(2)}ms`
      );
    }
  }

  static getAverageQueryTime(queryName: string): number {
    const times = this.queryTimes.get(queryName) || [];
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  static getAllQueryStats(): Record<
    string,
    { avg: number; count: number; max: number }
  > {
    const stats: Record<
      string,
      { avg: number; count: number; max: number }
    > = {};

    this.queryTimes.forEach((times, queryName) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const max = Math.max(...times);
      stats[queryName] = { avg, count: times.length, max };
    });

    return stats;
  }
}

// Export performance monitor for global access
export { DatabasePerformanceMonitor as performanceMonitor };
