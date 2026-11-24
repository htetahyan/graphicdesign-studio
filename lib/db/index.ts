/**
 * Drizzle DB Connection — Single database instance for the entire app.
 *
 * Uses `postgres.js` driver to connect directly to Supabase's PostgreSQL.
 * This bypasses the PostgREST API layer for better performance.
 *
 * Connection goes through Supabase's connection pooler (Transaction mode),
 * so prepared statements are disabled (`prepare: false`).
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import * as relations from "./relations";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL environment variable. " +
      "Get it from Supabase Dashboard → Settings → Database → Connection String (URI)."
  );
}

// postgres.js client — uses connection pooler in transaction mode
const client = postgres(connectionString, {
  prepare: false, // Required for Supabase Transaction pooler mode
});

// Drizzle ORM instance with full schema + relations
export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

// Re-export schema types for convenience
export * from "./schema";
