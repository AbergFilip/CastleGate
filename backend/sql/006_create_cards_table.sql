-- Skapa tabell för kort och krediter
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  card_type VARCHAR(50) NOT NULL, -- 'debit', 'credit', 'other_credit'
  bank_name VARCHAR(255),
  card_name VARCHAR(255) NOT NULL,
  last_four VARCHAR(4),
  card_number VARCHAR(19), -- Maskerat, endast sista 4 siffrorna visas normalt
  balance DECIMAL(15, 2) DEFAULT 0, -- För debitkort
  credit_limit DECIMAL(15, 2), -- För kreditkort
  available_credit DECIMAL(15, 2), -- För kreditkort
  currency VARCHAR(10) DEFAULT 'SEK',
  expiry_date DATE,
  cvv VARCHAR(4), -- Krypterad i produktion
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_card_type ON public.cards(user_id, card_type);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON public.cards(user_id, is_active);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_cards_updated_at ON public.cards;
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
