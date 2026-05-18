-- Förbättra user_connections med relationstyper och taggar
-- Migrerad från Supabase: RLS policies borttagna

-- Lägg till relation_type kolumn (för kategorisering)
ALTER TABLE public.user_connections 
ADD COLUMN IF NOT EXISTS relation_type VARCHAR(50); -- 'friend', 'family', 'colleague', 'neighbor', 'acquaintance', 'custom'

-- Lägg till tags kolumn (array för flera taggar)
ALTER TABLE public.user_connections 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Lägg till relation_strength kolumn (valfritt, för rekommendationer)
ALTER TABLE public.user_connections 
ADD COLUMN IF NOT EXISTS relation_strength VARCHAR(20); -- 'close', 'regular', 'acquaintance'

-- Kommentarer
COMMENT ON COLUMN public.user_connections.relation_type IS 'Typ av relation: friend, family, colleague, neighbor, acquaintance, custom';
COMMENT ON COLUMN public.user_connections.tags IS 'Array av taggar för relationen (t.ex. ["Gymnasiet", "Fotboll"])';
COMMENT ON COLUMN public.user_connections.relation_strength IS 'Relationens styrka: close, regular, acquaintance';

-- Index för relation_type
CREATE INDEX IF NOT EXISTS idx_user_connections_relation_type ON public.user_connections(relation_type);
