-- Skapa users-tabell (ersätter auth.users från Supabase)
-- Detta är grundtabellen för alla användare
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  personal_number TEXT UNIQUE,
  bankid_linked BOOLEAN DEFAULT false,
  bankid_linked_at TIMESTAMP WITH TIME ZONE,
  user_type VARCHAR(50) DEFAULT 'user', -- 'user' eller 'admin'
  metadata JSONB, -- Extra metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_users_personal_number ON public.users(personal_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_bankid_linked ON public.users(bankid_linked);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);

-- Skapa funktion för att automatiskt uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Skapa trigger för att automatiskt uppdatera updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Kommentarer för dokumentation
COMMENT ON TABLE public.users IS 'Användarprofiler med BankID-integration';
COMMENT ON COLUMN public.users.personal_number IS 'Personnummer från BankID (unik)';
COMMENT ON COLUMN public.users.bankid_linked IS 'Om BankID är kopplat till kontot';
COMMENT ON COLUMN public.users.bankid_linked_at IS 'När BankID kopplades till kontot';
