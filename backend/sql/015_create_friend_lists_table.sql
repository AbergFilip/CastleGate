-- Skapa tabell för vänlistor
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.friend_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex-färg för listan (t.ex. #1A7498)
  icon VARCHAR(50), -- Emoji eller ikon (t.ex. '👨‍👩‍👧‍👦', '💼')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vänner i listor
CREATE TABLE IF NOT EXISTS public.friend_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.friend_lists(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.user_connections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT friend_list_members_unique UNIQUE (list_id, connection_id)
);

-- Index för vänlistor
CREATE INDEX IF NOT EXISTS idx_friend_lists_user_id ON public.friend_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_list_members_list_id ON public.friend_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_friend_list_members_connection_id ON public.friend_list_members(connection_id);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_friend_lists_updated_at ON public.friend_lists;
CREATE TRIGGER update_friend_lists_updated_at
  BEFORE UPDATE ON public.friend_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
