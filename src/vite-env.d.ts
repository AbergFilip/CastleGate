/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_BANKID_API_URL: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_AUDIENCE: string
  readonly VITE_SESSION_TIMEOUT_MINUTES: string
  readonly VITE_SKIP_BANKID?: string
  readonly VITE_ENABLE_TEST_DATA_TOOLS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
