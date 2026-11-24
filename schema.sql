-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS (Custom Auth Table)
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  passphrase text not null, -- Storing plain text/simple auth as requested
  credits int default 10,
  signup_ip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists idx_users_signup_ip_unique
  on public.users(signup_ip)
  where signup_ip is not null;

-- 2. BRANDS
create table public.brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  logo_url text, -- URL to uploaded brand logo
  style_context jsonb, -- Persisted Gemini analysis (style, colors, patterns)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BRAND IMAGES (Assets uploaded for reference)
create table public.brand_images (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references public.brands(id) on delete cascade not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. GENERATIONS (History)
create table public.generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  brand_id uuid references public.brands(id) on delete set null,
  prompt text not null,
  result_url text not null,
  params jsonb, -- Store specific JSON params used
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Optional for MVP if using server-side admin client, 
-- but good practice. For now, we enable read access for all to simplify default policies if needed.
alter table public.users enable row level security;
alter table public.brands enable row level security;
alter table public.brand_images enable row level security;
alter table public.generations enable row level security;

-- POLICIES (Simplified for MVP custom auth)
-- Ideally you match auth.uid() but we are using custom `public.users`.
-- For MVP, we will mostly bypass RLS by using the Service Role key on the backend 
-- or by creating policies that match the passed user_id if we were using Supabase Auth.
-- Since we use `public.users` with custom logic, our backend code (`lib/supabase.ts` etc) 
-- will likely use the Service Role key (Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` usage).
-- IF creating policies for Client Side access:
create policy "Public read access" on public.brands for select using (true);
create policy "Public read access" on public.brand_images for select using (true);
create policy "Public read access" on public.generations for select using (true);


-- ---------------------------------------------------------
-- STORAGE SETUP INSTRUCTIONS
-- ---------------------------------------------------------
-- Go to Storage in Supabase Dashboard.
-- Create a new PUBLIC bucket named: 'brand-assets'
-- Create a new PUBLIC bucket named: 'generated-images'

-- Storage Policies (SQL for Storage, if supported in editor, otherwise do in UI)
-- Allow public read for 'brand-assets'
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'brand-assets' );

-- Allow public insert for 'brand-assets' (or restrict to auth)
create policy "Public Upload"
on storage.objects for insert
using ( bucket_id = 'brand-assets' );

-- Repeat for 'generated-images'
create policy "Public Access Generated"
on storage.objects for select
using ( bucket_id = 'generated-images' );

create policy "Public Upload Generated"
on storage.objects for insert
using ( bucket_id = 'generated-images' );
