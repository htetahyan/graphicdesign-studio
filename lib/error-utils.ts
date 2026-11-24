/**
 * Unified error normalization.
 *
 * Server-side code should call `sanitizeErrorForClient(error)` (English).
 * Client-side code should call `normalizeErrorForUI(message)` (Burmese).
 *
 * This is the single source of truth — do NOT duplicate in other files.
 */

// ── Patterns ──────────────────────────────────────────────

const BUSY_PATTERNS = [
  "429",
  "rate limit",
  "quota",
  "too many",
  "resource",
  "overload",
  "overloaded",
  "busy",
  "temporarily",
  "timeout",
  "timed out",
  "high demand",
  "e003",
] as const;

const INVALID_ARG_PATTERNS = [
  "invalid_argument",
  "invalid argument",
  "400",
  "bad request",
] as const;

const SERVER_ERROR_PATTERNS = [
  "500",
  "502",
  "503",
  "504",
  "internal server",
  "service unavailable",
  "bad gateway",
  "unavailable",
] as const;

const AUTH_ERROR_PATTERNS = [
  "401",
  "403",
  "unauthorized",
  "forbidden",
  "permission",
  "authentication",
] as const;

const SAFE_MESSAGE_PATTERNS = [
  "please log in",
  "insufficient credits",
  "brand not found",
  "brand logo",
  "brand style context",
] as const;

function matchesAny(lower: string, patterns: readonly string[]): boolean {
  return patterns.some((p) => lower.includes(p));
}

function looksLikeRawJson(msg: string): boolean {
  return msg.startsWith("{") || msg.includes('"error"') || msg.includes('"code"');
}

// ── Server-side: sanitize before throwing to client ───────

/**
 * Sanitize raw API/server errors into safe English messages before they
 * cross the server→client boundary.  Used in server actions.
 */
export function sanitizeErrorForClient(error: unknown): string {
  const rawMsg = String((error as any)?.message || "");
  const lower = rawMsg.toLowerCase();

  if (matchesAny(lower, BUSY_PATTERNS)) {
    return "AI server is currently busy. Please try again in a moment.";
  }
  if (matchesAny(lower, INVALID_ARG_PATTERNS)) {
    return "Image generation encountered an issue. Please try again.";
  }
  if (matchesAny(lower, SERVER_ERROR_PATTERNS)) {
    return "AI server is temporarily unavailable. Please try again shortly.";
  }
  if (matchesAny(lower, AUTH_ERROR_PATTERNS)) {
    return "Authentication error. Please log in again.";
  }
  if (looksLikeRawJson(rawMsg)) {
    return "Image generation failed. Please try again.";
  }
  if (matchesAny(lower, SAFE_MESSAGE_PATTERNS)) {
    return rawMsg; // Already user-friendly
  }

  return "Image generation failed. Please try again.";
}

// ── Client-side: normalize into Burmese for UI display ────

/**
 * Convert an error message (possibly already sanitised by the server) into
 * a user-facing Burmese string for toasts / inline errors.
 */
export function normalizeErrorForUI(message: string): string {
  const msg = String(message || "");
  const lower = msg.toLowerCase();

  if (matchesAny(lower, BUSY_PATTERNS)) {
    return "Server မအားလပ်သေးပါ။ ခဏစောင့်ပြီး ပြန်စမ်းကြည့်ပါ။";
  }
  if (matchesAny(lower, INVALID_ARG_PATTERNS)) {
    return "ပုံဖန်တီးရာတွင် ပြဿနာရှိနေပါသည်။ ကျေးဇူးပြု၍ ထပ်စမ်းကြည့်ပါ။";
  }
  if (matchesAny(lower, SERVER_ERROR_PATTERNS)) {
    return "Server ပြဿနာရှိနေပါသည်။ ခဏစောင့်ပြီး ပြန်စမ်းကြည့်ပါ။";
  }
  if (matchesAny(lower, AUTH_ERROR_PATTERNS)) {
    return "ခွင့်ပြုချက်ပြဿနာ ရှိနေပါသည်။ ကျေးဇူးပြု၍ ပြန်လည်ဝင်ရောက်ပါ။";
  }
  if (looksLikeRawJson(msg)) {
    return "ပုံဖန်တီးရာတွင် ပြဿနာရှိနေပါသည်။ ကျေးဇူးပြု၍ ထပ်စမ်းကြည့်ပါ။";
  }
  if (matchesAny(lower, SAFE_MESSAGE_PATTERNS)) {
    return msg; // Already user-friendly English — pass through
  }

  return "ပုံဖန်တီး၍ မရပါ။ ကျေးဇူးပြု၍ ထပ်စမ်းကြည့်ပါ။";
}
