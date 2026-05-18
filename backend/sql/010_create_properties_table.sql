-- Skapa tabell för fastigheter/hem
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'home', -- 'home', 'apartment', 'house', 'cottage', 'other'
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Sverige',
  property_type VARCHAR(100), -- 'Lägenhet', 'Villa', 'Radhus', 'Fritidshus', etc.
  size_sqm DECIMAL(10, 2), -- Storlek i kvadratmeter
  rooms INTEGER, -- Antal rum
  floor VARCHAR(50), -- Våningsplan (t.ex. '5tr', 'Bottenvåning')
  purchase_date DATE,
  purchase_price DECIMAL(12, 2),
  current_value DECIMAL(12, 2), -- Marknadsvärde
  valuation_date DATE, -- Datum för senaste värdering
  valuation_source VARCHAR(255), -- Källa för värdering (t.ex. 'Hemnet', 'Booli', 'Manuell')
  description TEXT,
  images JSONB, -- Array med bild-URLs
  documents JSONB, -- Array med dokument-URLs och metadata
  metadata JSONB, -- Extra metadata (t.ex. byggår, energiklass, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för properties
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_address ON public.properties USING gin(to_tsvector('swedish', address));

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
