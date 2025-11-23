-- Supabase Database Setup för BankID-integration
-- Kör detta script i Supabase SQL Editor

-- 1. Skapa users-tabell (om den inte redan finns)
-- Denna tabell länkar till auth.users och lagrar BankID-information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  personal_number TEXT UNIQUE,
  bankid_linked BOOLEAN DEFAULT false,
  bankid_linked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skapa index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_users_personal_number ON public.users(personal_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_bankid_linked ON public.users(bankid_linked);

-- 3. Aktivera Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Skapa RLS policies
-- Användare kan läsa sin egen data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Användare kan uppdatera sin egen data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Service role kan göra allt (för backend)
CREATE POLICY "Service role has full access" ON public.users
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. Skapa funktion för att automatiskt uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Skapa trigger för att automatiskt uppdatera updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Skapa funktion för att automatiskt skapa user-profil när auth.users skapas
-- Detta säkerställer att varje användare i auth.users också har en profil i users-tabellen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Skapa trigger för att automatiskt skapa user-profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Kommentarer för dokumentation
COMMENT ON TABLE public.users IS 'Användarprofiler med BankID-integration';
COMMENT ON COLUMN public.users.personal_number IS 'Personnummer från BankID (unik)';
COMMENT ON COLUMN public.users.bankid_linked IS 'Om BankID är kopplat till kontot';
COMMENT ON COLUMN public.users.bankid_linked_at IS 'När BankID kopplades till kontot';

