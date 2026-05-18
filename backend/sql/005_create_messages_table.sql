-- Skapa tabell för meddelanden (brevlåda)
-- Migrerad från Supabase: RLS policies borttagna (hanteras i backend)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL om det är ett företag
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_name VARCHAR(255) NOT NULL, -- Namn på avsändare (användare eller företag)
  sender_type VARCHAR(50) DEFAULT 'user', -- 'user' eller 'company'
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  category VARCHAR(50), -- 'person', 'company', 'announcement'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för meddelanden
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
