-- ============================================
-- Uppdatera profiles tabell för onboarding
-- ============================================
-- Kör detta i Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/srygynccnzdzftvadshj/sql
--
-- Detta skript lägger till nya kolumner för onboarding-data
-- och uppdaterar trigger-funktionen för nya användare.
-- ============================================

-- Steg 1: Lägg till nya kolumner om de inte redan finns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sverige',
  ADD COLUMN IF NOT EXISTS personal_number TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Steg 2: Uppdatera befintliga rader (sätt onboarding_completed till FALSE för användare som inte har slutfört onboarding)
-- Detta är säkert eftersom vi bara uppdaterar NULL-värden
UPDATE public.profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;

-- Steg 3: Uppdatera trigger-funktionen för att inkludera onboarding_completed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    FALSE  -- Nya användare börjar med onboarding_completed = FALSE
  )
  ON CONFLICT (id) DO NOTHING;  -- Förhindra fel om profilen redan finns
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Steg 4: Verifiera att kolumnerna skapades korrekt
-- (Kör detta separat för att se resultatet)
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'profiles'
--   AND column_name IN ('phone', 'address', 'city', 'postal_code', 'country', 'personal_number', 'onboarding_completed')
-- ORDER BY column_name;

