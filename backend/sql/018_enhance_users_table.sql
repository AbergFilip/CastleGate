-- Utöka users-tabellen för socialt nätverk och komplett profil
-- Migrerad från Supabase: RLS policies borttagna

-- Lägg till profilfält
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sverige',
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(50) DEFAULT 'public', -- 'public', 'friends', 'private'
  ADD COLUMN IF NOT EXISTS allow_friend_requests BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_address BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS user_type VARCHAR(10) DEFAULT 'B2C' CHECK (user_type IN ('B2C', 'B2B')),
  ADD COLUMN IF NOT EXISTS organization_id UUID,
  ADD COLUMN IF NOT EXISTS organization_name TEXT;

-- Index för sökningar
CREATE INDEX IF NOT EXISTS idx_users_name ON public.users(name);
CREATE INDEX IF NOT EXISTS idx_users_profile_visibility ON public.users(profile_visibility);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON public.users(organization_id) WHERE organization_id IS NOT NULL;

-- Kommentarer
COMMENT ON COLUMN public.users.avatar_url IS 'URL till profilbild';
COMMENT ON COLUMN public.users.bio IS 'Biografi/beskrivning';
COMMENT ON COLUMN public.users.profile_visibility IS 'Synlighet: public, friends, private';
COMMENT ON COLUMN public.users.allow_friend_requests IS 'Om användaren tillåter vänförfrågningar';
COMMENT ON COLUMN public.users.show_email IS 'Om email ska visas för vänner';
COMMENT ON COLUMN public.users.show_phone IS 'Om telefon ska visas för vänner';
COMMENT ON COLUMN public.users.show_address IS 'Om adress ska visas för vänner';
COMMENT ON COLUMN public.users.user_type IS 'User type: B2C (consumer) or B2B (business)';
COMMENT ON COLUMN public.users.organization_id IS 'Organization ID for B2B users';
COMMENT ON COLUMN public.users.organization_name IS 'Organization name for B2B users';
