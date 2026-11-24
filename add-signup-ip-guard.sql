-- Signup anti-abuse guard:
-- 1) store signup IP
-- 2) allow only one account per IP

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS signup_ip text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_signup_ip_unique
ON public.users(signup_ip)
WHERE signup_ip IS NOT NULL;
