-- Skapa tabell för blockering av användare
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_blocks_unique UNIQUE (user_id, blocked_user_id),
  CONSTRAINT user_blocks_no_self CHECK (user_id != blocked_user_id)
);

-- Index för blockering
CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON public.user_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_user_id ON public.user_blocks(blocked_user_id);
