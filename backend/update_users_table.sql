-- Uppdatera users-tabellen för att inkludera alla profilfält
-- Kör detta script i Supabase SQL Editor

-- Lägg till kolumner som saknas (om de inte redan finns)
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sverige',
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Kommentarer för dokumentation
COMMENT ON COLUMN public.users.phone IS 'Telefonnummer';
COMMENT ON COLUMN public.users.address IS 'Gatuadress';
COMMENT ON COLUMN public.users.postal_code IS 'Postnummer';
COMMENT ON COLUMN public.users.city IS 'Stad';
COMMENT ON COLUMN public.users.country IS 'Land';
COMMENT ON COLUMN public.users.onboarding_completed IS 'Om onboarding är slutförd';

-- Om du har en profiles-tabell och vill migrera data:
-- INSERT INTO public.users (id, email, name, phone, address, postal_code, city, country, onboarding_completed)
-- SELECT id, email, name, phone, address, postal_code, city, country, onboarding_completed
-- FROM public.profiles
-- ON CONFLICT (id) DO UPDATE SET
--   phone = EXCLUDED.phone,
--   address = EXCLUDED.address,
--   postal_code = EXCLUDED.postal_code,
--   city = EXCLUDED.city,
--   country = EXCLUDED.country,
--   onboarding_completed = EXCLUDED.onboarding_completed;

