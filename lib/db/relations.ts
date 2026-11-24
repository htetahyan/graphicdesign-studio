/**
 * Drizzle Relations — Defines relationships between tables for relational queries.
 *
 * This lets us do things like:
 *   db.query.brands.findMany({ with: { brandImages: true } })
 * instead of manual JOINs or Supabase's `.select("*, brand_images(*)")`.
 */

import { relations } from "drizzle-orm";
import {
  users,
  brands,
  brandImages,
  generations,
  generationJobs,
  campaigns,
  rechargeRequests,
  rechargePackages,
  userNotifications,
} from "./schema";

// ─── User Relations ─────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  brands: many(brands),
  generations: many(generations),
  generationJobs: many(generationJobs),
  campaigns: many(campaigns),
  rechargeRequests: many(rechargeRequests),
  notifications: many(userNotifications),
}));

// ─── Brand Relations ────────────────────────────────────────

export const brandsRelations = relations(brands, ({ one, many }) => ({
  user: one(users, {
    fields: [brands.userId],
    references: [users.id],
  }),
  brandImages: many(brandImages),
  generations: many(generations),
  generationJobs: many(generationJobs),
  campaigns: many(campaigns),
}));

// ─── Brand Image Relations ──────────────────────────────────

export const brandImagesRelations = relations(brandImages, ({ one }) => ({
  brand: one(brands, {
    fields: [brandImages.brandId],
    references: [brands.id],
  }),
}));

// ─── Generation Relations ───────────────────────────────────

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  brand: one(brands, {
    fields: [generations.brandId],
    references: [brands.id],
  }),
  campaign: one(campaigns, {
    fields: [generations.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  brand: one(brands, {
    fields: [campaigns.brandId],
    references: [brands.id],
  }),
  generations: many(generations),
}));

// ─── Generation Job Relations ───────────────────────────────

export const generationJobsRelations = relations(
  generationJobs,
  ({ one }) => ({
    user: one(users, {
      fields: [generationJobs.userId],
      references: [users.id],
    }),
    brand: one(brands, {
      fields: [generationJobs.brandId],
      references: [brands.id],
    }),
  })
);

// ─── Recharge Package Relations ─────────────────────────────

export const rechargePackagesRelations = relations(
  rechargePackages,
  ({ many }) => ({
    requests: many(rechargeRequests),
  })
);

// ─── Recharge Request Relations ─────────────────────────────

export const rechargeRequestsRelations = relations(
  rechargeRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [rechargeRequests.userId],
      references: [users.id],
    }),
    package: one(rechargePackages, {
      fields: [rechargeRequests.packageId],
      references: [rechargePackages.id],
    }),
  })
);

// ─── User Notification Relations ────────────────────────────

export const userNotificationsRelations = relations(
  userNotifications,
  ({ one }) => ({
    user: one(users, {
      fields: [userNotifications.userId],
      references: [users.id],
    }),
  })
);
