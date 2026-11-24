-- Run this against your Supabase SQL Editor to enable Queuing Support

create type job_status as enum ('pending', 'processing', 'completed', 'failed');

create table public.generation_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  status job_status default 'pending' not null,
  prompt text not null,
  payload jsonb not null, -- Stores base64 images, settings, etc.
  result_url text, -- Populated when completed
  error_message text, -- Populated when failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

alter table public.generation_jobs enable row level security;
create policy "Public read access" on public.generation_jobs for select using (true);
create policy "Public update access" on public.generation_jobs for update using (true);
create policy "Public insert access" on public.generation_jobs for insert using (true);
