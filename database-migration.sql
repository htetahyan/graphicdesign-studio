-- Migration to add performance indexes for handling 100 concurrent users
-- Run this in your Supabase SQL editor or via CLI

-- Index for faster job status queries (used in throttling and polling)
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs (status);

-- Index for faster user-specific generation queries
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations (user_id);

-- Index for faster brand-specific queries
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs (user_id);
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands (user_id);

-- Composite index for job status and creation time (useful for cleanup and monitoring)
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status_created ON generation_jobs (status, created_at);