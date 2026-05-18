-- Skapa tabell för aktier och fonder
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider VARCHAR(255) NOT NULL, -- 'Avanza', 'Nordnet', 'Carnegie Fonder', etc.
  account_name VARCHAR(255) NOT NULL, -- 'ISK', 'Strategifond A', etc.
  investment_type VARCHAR(50) NOT NULL, -- 'stock', 'fund', 'etf', 'bond', 'other'
  symbol VARCHAR(50), -- Aktiesymbol eller fondkod
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0, -- Innehavsvärde
  quantity DECIMAL(15, 4), -- Antal aktier/fonder
  purchase_price DECIMAL(15, 4), -- Köpkurs
  current_price DECIMAL(15, 4), -- Nuvarande kurs
  currency VARCHAR(10) DEFAULT 'SEK',
  growth_percent DECIMAL(10, 2), -- Tillväxt i procent
  account_type VARCHAR(50), -- 'ISK', 'Konto', 'Depå', etc.
  external_url TEXT, -- Länk till providers webbplats
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_provider ON public.investments(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_investments_is_active ON public.investments(user_id, is_active);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_investments_updated_at ON public.investments;
CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
