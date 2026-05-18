-- Skapa tabeller för förfrågningar (requests)
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'Försäkring', 'Elavtal', 'Bolån', etc.
  status VARCHAR(50) DEFAULT 'Aktiv', -- 'Aktiv', 'Avslutad', 'Stängd'
  responses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa tabell för svar på förfrågningar
CREATE TABLE IF NOT EXISTS public.request_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL om det är ett företag
  responder_name VARCHAR(255) NOT NULL, -- Namn på den som svarar (användare eller företag)
  responder_type VARCHAR(50) DEFAULT 'user', -- 'user' eller 'company'
  message TEXT,
  price VARCHAR(100), -- T.ex. "299 kr/mån", "0.89 kr/kWh"
  contact_info JSONB, -- E-post, telefon, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för förfrågningar
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_responses_request_id ON public.request_responses(request_id);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_requests_updated_at ON public.requests;
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
