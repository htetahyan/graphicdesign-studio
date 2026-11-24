/**
 * Supabase Client — Storage operations only.
 *
 * All database queries have been migrated to Drizzle ORM (see lib/db/).
 * This file is kept solely for Supabase Storage (upload, getPublicUrl).
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

if (!supabaseServiceKey) {
  console.warn(
    "Missing SUPABASE_SERVICE_ROLE_KEY - admin storage operations will use anon key"
  );
}

/** Supabase client for public storage operations */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Supabase admin client for privileged storage operations (uploads) */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;
