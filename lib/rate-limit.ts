/**
 * In-memory rate limiter for server actions and API routes.
 * Keys are hashed to avoid storing raw identifiers in memory.
 */

import { createHash } from "node:crypto";

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 60_000; // 1 minute

// Simple periodic cleanup to prevent memory leaks
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
            if (entry.resetAt <= now) {
                store.delete(key);
            }
        }
    }, CLEANUP_INTERVAL_MS);
}

startCleanup();

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
}

/**
 * Check if an action is allowed under the rate limit.
 * @param identifier - Raw identifier (e.g., IP, username, userId)
 * @param action - Action name (e.g., "login", "signup")
 * @param maxRequests - Max requests in the window
 * @param windowMs - Window in milliseconds
 */
export function rateLimit(
    identifier: string,
    action: string,
    maxRequests: number = 5,
    windowMs: number = 60_000
): RateLimitResult {
    const rawKey = `${action}:${identifier}`;
    const key = hashKey(rawKey);
    const now = Date.now();

    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        // First request or window expired
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + windowMs,
        };
        store.set(key, newEntry);
        return {
            success: true,
            limit: maxRequests,
            remaining: maxRequests - 1,
            resetAt: newEntry.resetAt,
        };
    }

    if (existing.count >= maxRequests) {
        return {
            success: false,
            limit: maxRequests,
            remaining: 0,
            resetAt: existing.resetAt,
        };
    }

    existing.count += 1;
    return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - existing.count,
        resetAt: existing.resetAt,
    };
}

/**
 * Async wrapper that throws a user-friendly error when rate limited.
 */
export function checkRateLimit(
    identifier: string,
    action: string,
    maxRequests: number = 5,
    windowMs: number = 60_000
): void {
    const result = rateLimit(identifier, action, maxRequests, windowMs);
    if (!result.success) {
        const seconds = Math.ceil((result.resetAt - Date.now()) / 1000);
        throw new Error(
            `Too many attempts. Please try again in ${seconds} second${seconds === 1 ? "" : "s"}.`
        );
    }
}

/**
 * Get a stable identifier from request headers (IP or forwarded IP).
 * Use in API routes.
 */
export function getClientIdentifier(headers: Headers): string {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }
    return "unknown";
}
