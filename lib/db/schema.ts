/**
 * Drizzle ORM Schema — Single source of truth for all database tables.
 *
 * This file replaces the old manual SQL files (schema.sql, add-queue-table.sql, etc.).
 * Any schema change should be made here, then run:
 *   npx drizzle-kit generate   → creates a migration SQL file
 *   npx drizzle-kit migrate    → applies it to the database
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const rechargeStatusEnum = pgEnum("recharge_status", [
  "pending",
  "approved",
  "rejected",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "generating",
  "ready",
  "in_review",
  "approved",
  "changes_requested",
  "failed",
]);

// ─── Users ──────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  passphrase: text("passphrase").notNull(),
  credits: integer("credits").default(10),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  signupIp: text("signup_ip"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Brands ─────────────────────────────────────────────────

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  styleContext: jsonb("style_context"),
  contactName: text("contact_name"),
  industry: text("industry"),
  lockedColors: jsonb("locked_colors").$type<string[]>(),
  lockedFonts: jsonb("locked_fonts").$type<string[]>(),
  doNotUse: text("do_not_use"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Brand Images ───────────────────────────────────────────

export const brandImages = pgTable("brand_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Generations ────────────────────────────────────────────

export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  brandId: uuid("brand_id").references(() => brands.id, {
    onDelete: "set null",
  }),
  campaignId: uuid("campaign_id").references(() => campaigns.id, {
    onDelete: "set null",
  }),
  prompt: text("prompt").notNull(),
  resultUrl: text("result_url").notNull(),
  params: jsonb("params"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Design chat sessions (3 hours) ─────────────────────────

export const designSessions = pgTable("design_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  turns: jsonb("turns").$type<unknown[]>().notNull().default([]),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Generation Jobs (Queue) ────────────────────────────────

export const generationJobs = pgTable("generation_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  status: jobStatusEnum("status").default("pending").notNull(),
  prompt: text("prompt").notNull(),
  payload: jsonb("payload").notNull(),
  resultUrl: text("result_url"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// ─── Campaigns (agency pack) ────────────────────────────────

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  brief: text("brief").notNull(),
  offer: text("offer"),
  headline: text("headline"),
  ctaText: text("cta_text"),
  formats: jsonb("formats").$type<string[]>().notNull(),
  includeCarousel: boolean("include_carousel").default(false).notNull(),
  expectedAssetCount: integer("expected_asset_count").notNull(),
  jobIds: jsonb("job_ids").$type<string[]>().notNull(),
  status: campaignStatusEnum("status").default("generating").notNull(),
  reviewToken: text("review_token").notNull().unique(),
  clientNote: text("client_note"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const rechargePackages = pgTable("recharge_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  priceKs: integer("price_ks").notNull(),
  credits: integer("credits").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Recharge Requests ──────────────────────────────────────

export const rechargeRequests = pgTable("recharge_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  packageId: uuid("package_id")
    .references(() => rechargePackages.id)
    .notNull(),
  paymentScreenshotPath: text("payment_screenshot_path"),
  status: text("status").default("pending").notNull(),
  requestedKs: integer("requested_ks"),
  requestedCredits: integer("requested_credits"),
  approvedCredits: integer("approved_credits"),
  adminNote: text("admin_note"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── User Notifications ─────────────────────────────────────

export const userNotifications = pgTable("user_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Inspiration Templates ──────────────────────────────────

export const inspirationTemplates = pgTable("inspiration_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  industryId: text("industry_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  uploadthingKey: text("uploadthing_key"),
  designData: jsonb("design_data"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Type Exports ───────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type BrandImage = typeof brandImages.$inferSelect;
export type Generation = typeof generations.$inferSelect;
export type GenerationJob = typeof generationJobs.$inferSelect;
export type DesignSession = typeof designSessions.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type RechargePackage = typeof rechargePackages.$inferSelect;
export type RechargeRequest = typeof rechargeRequests.$inferSelect;
export type UserNotification = typeof userNotifications.$inferSelect;
export type InspirationTemplate = typeof inspirationTemplates.$inferSelect;
