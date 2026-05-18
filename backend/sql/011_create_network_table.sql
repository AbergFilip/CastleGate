-- Skapa tabeller för användarrelationer och nätverk
-- Migrerad från Supabase: RLS policies borttagna

-- Användarrelationer (connections mellan användare)
CREATE TABLE IF NOT EXISTS public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  relation VARCHAR(100), -- 'Vän', 'Familj', 'Kollega', etc. (valfritt)
  notes TEXT, -- Anteckningar om relationen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_connections_unique UNIQUE (user_id, connected_user_id),
  CONSTRAINT user_connections_no_self CHECK (user_id != connected_user_id)
);

-- Index för användarrelationer
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id ON public.user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_connected_user_id ON public.user_connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON public.user_connections(status);
CREATE INDEX IF NOT EXISTS idx_user_connections_both_users ON public.user_connections(user_id, connected_user_id);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_user_connections_updated_at ON public.user_connections;
CREATE TRIGGER update_user_connections_updated_at
  BEFORE UPDATE ON public.user_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Nätverk/connections (för icke-användare, t.ex. kontakter utanför appen)
CREATE TABLE IF NOT EXISTS public.network_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relation VARCHAR(100), -- 'Vän', 'Familj', 'Kollega', etc.
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Aktiv', -- 'Aktiv', 'Inaktiv', etc.
  avatar TEXT, -- Emoji eller URL till avatar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för nätverk
CREATE INDEX IF NOT EXISTS idx_network_connections_user_id ON public.network_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_network_connections_relation ON public.network_connections(relation);
CREATE INDEX IF NOT EXISTS idx_network_connections_status ON public.network_connections(status);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_network_connections_updated_at ON public.network_connections;
CREATE TRIGGER update_network_connections_updated_at
  BEFORE UPDATE ON public.network_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
