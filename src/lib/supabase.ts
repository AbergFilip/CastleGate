import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Hämta dessa värden från Supabase Dashboard -> Settings -> API
// För säkerhet: Använd miljövariabler i produktion
const supabaseUrl = env.supabaseUrl
const supabaseAnonKey = env.supabaseAnonKey

// Skapa en dummy-klient om värden saknas för att undvika krasch
let supabase: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL eller Anon Key saknas. Lägg till VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY i .env-filen.'
  )

  // Skapa en dummy-klient med placeholder-värden för att undvika krasch
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export { supabase }

