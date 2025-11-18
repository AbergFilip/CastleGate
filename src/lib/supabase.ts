import { createClient } from '@supabase/supabase-js'

// Hämta dessa värden från Supabase Dashboard -> Settings -> API
// För säkerhet: Använd miljövariabler i produktion
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Skapa en dummy-klient om värden saknas för att undvika krasch
let supabase: ReturnType<typeof createClient>

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Supabase URL eller Anon Key saknas. Lägg till VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY i .env-filen.'
  console.error(errorMsg)
  console.error('Current env values:', {
    url: supabaseUrl || 'SAKNAS',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'SAKNAS'
  })
  
  // Skapa en dummy-klient med placeholder-värden för att undvika krasch
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
  
  console.warn('Supabase klient skapad med placeholder-värden. Funktioner kommer inte fungera korrekt.')
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  
  // Logga för debugging (ta bort i produktion)
  console.log('Supabase klient initierad:', {
    url: supabaseUrl ? 'OK' : 'SAKNAS',
    key: supabaseAnonKey ? 'OK' : 'SAKNAS'
  })
}

export { supabase }

