-- Database Performance Optimization Script
-- Add indexes and fix N+1 query problems

-- ==========================================================
-- 1. CRITICAL DATABASE INDEXES
-- ==========================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Brands table indexes (most critical)
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON public.brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_created_at ON public.brands(created_at);
CREATE INDEX IF NOT EXISTS idx_brands_user_created ON public.brands(user_id, created_at DESC);

-- Brand images table indexes
CREATE INDEX IF NOT EXISTS idx_brand_images_brand_id ON public.brand_images(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_images_created_at ON public.brand_images(created_at);
CREATE INDEX IF NOT EXISTS idx_brand_images_brand_created ON public.brand_images(brand_id, created_at DESC);

-- Generations table indexes
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_brand_id ON public.generations(brand_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at);
CREATE INDEX IF NOT EXISTS idx_generations_user_created ON public.generations(user_id, created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_generations_user_brand_created ON public.generations(user_id, brand_id, created_at DESC);

-- ==========================================================
-- 2. OPTIMIZED VIEWS TO FIX N+1 QUERIES
-- ==========================================================

-- View for brands with their images (single query instead of N+1)
CREATE OR REPLACE VIEW public.brands_with_images AS
SELECT 
    b.id,
    b.user_id,
    b.name,
    b.description,
    b.logo_url,
    b.style_context,
    b.created_at,
    COALESCE(
        json_agg(
            json_build_object(
                'id', bi.id,
                'url', bi.url,
                'created_at', bi.created_at
            ) ORDER BY bi.created_at DESC
        ) FILTER (WHERE bi.id IS NOT NULL), 
        '[]'::json
    ) as brand_images
FROM public.brands b
LEFT JOIN public.brand_images bi ON b.id = bi.brand_id
GROUP BY b.id, b.user_id, b.name, b.description, b.logo_url, b.style_context, b.created_at;

-- View for generations with brand info
CREATE OR REPLACE VIEW public.generations_with_brand AS
SELECT 
    g.id,
    g.user_id,
    g.brand_id,
    g.prompt,
    g.result_url,
    g.params,
    g.created_at,
    b.name as brand_name,
    b.logo_url as brand_logo
FROM public.generations g
LEFT JOIN public.brands b ON g.brand_id = b.id;

-- ==========================================================
-- 3. PERFORMANCE ANALYSIS QUERIES
-- ==========================================================

-- Query to check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Query to identify slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%brands%' OR query LIKE '%generations%'
ORDER BY mean_time DESC
LIMIT 10;

-- ==========================================================
-- 4. VACUUM AND ANALYSIS FOR OPTIMIZATION
-- ==========================================================

-- Update table statistics for better query planning
ANALYZE public.users;
ANALYZE public.brands;
ANALYZE public.brand_images;
ANALYZE public.generations;

-- ==========================================================
-- 5. MONITORING QUERIES
-- ==========================================================

-- Monitor table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Check for missing indexes (queries that should be indexed)
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'brands', 'brand_images', 'generations')
    AND (attname = 'user_id' OR attname = 'brand_id' OR attname = 'created_at')
ORDER BY tablename, attname;
