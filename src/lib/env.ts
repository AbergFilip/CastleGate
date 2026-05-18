function warnIfMissing(name: string, value: string | undefined): string {
  if (!value && import.meta.env.DEV) {
    console.error(`Missing required environment variable: ${name}`)
  }
  return value || ''
}

export const env = {
  supabaseUrl: warnIfMissing('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: warnIfMissing('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  bankidApiUrl: import.meta.env.VITE_BANKID_API_URL || 'http://localhost:3001/api/v1/bankid',
  sessionTimeoutMinutes: Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '15'),
} as const
