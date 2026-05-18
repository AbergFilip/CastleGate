ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS personal_number_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS personal_number_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_personal_number_hash
  ON public.users(personal_number_hash);
