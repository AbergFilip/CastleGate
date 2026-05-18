-- Lägg till message-fält i user_connections-tabellen
-- Migrerad från Supabase: RLS policies borttagna

ALTER TABLE public.user_connections 
ADD COLUMN IF NOT EXISTS message TEXT;

-- Kommentar för fältet
COMMENT ON COLUMN public.user_connections.message IS 'Meddelande som skickas med vänförfrågan';
