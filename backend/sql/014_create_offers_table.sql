-- Skapa tabell för erbjudanden
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'Försäkring', 'Elavtal', 'Bolån', etc.
  badge VARCHAR(50), -- 'Rabatt', 'Nytt', 'Populärt'
  price VARCHAR(100), -- T.ex. "Från 299 kr/mån", "Från 0.89 kr/kWh"
  type VARCHAR(100), -- 'Försäkring', 'Elavtal', 'Bolån', etc.
  link_url TEXT, -- URL till erbjudandet
  viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Index för erbjudanden
CREATE INDEX IF NOT EXISTS idx_offers_user_id ON public.offers(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_viewed ON public.offers(user_id, viewed);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON public.offers(created_at DESC);
