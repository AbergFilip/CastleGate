-- Skapa tabell för notifikationer
-- Migrerad från Supabase: RLS policies borttagna
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'Ekonomi', 'Brevlåda', 'Marknad', 'Nätverk', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'friend_request', 'invoice', 'message', 'offer', etc.
  reference_id UUID, -- ID till relaterat objekt (t.ex. user_connection_id, document_id)
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för notifikationer
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
