import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface GCInstitution {
  id: string
  name: string
  logo: string
  countries: string[]
}

/**
 * Fetch available banks/institutions from GoCardless.
 */
export async function getGoCardlessInstitutions(): Promise<GCInstitution[]> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/bank-accounts/gocardless/institutions`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const data = await res.json().catch(() => ({ ok: false }))
  if (!res.ok || !data.ok) return []
  return data.institutions ?? []
}

/**
 * Create a GoCardless requisition (bank connection).
 * Returns a link the user should be redirected to.
 */
export async function createGoCardlessConnection(institutionId?: string): Promise<{
  ok: boolean
  link?: string
  requisition_id?: string
  message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const redirectUri = `${origin}/connect-bank/callback`

  const res = await fetch(`${API_URL}/bank-accounts/gocardless/connect`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      institution_id: institutionId || 'SANDBOXFINANCE_SFIN0000',
      redirect_uri: redirectUri,
    }),
  })
  const data = await res.json().catch(() => ({ ok: false }))
  if (!res.ok) return { ok: false, message: data.message || 'Kunde inte skapa bankanslutning' }
  return data
}

/**
 * After GoCardless redirect, sync the accounts to our backend.
 */
export async function syncGoCardlessAccounts(requisitionId: string): Promise<{
  ok: boolean
  created?: number
  total?: number
  message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')

  const res = await fetch(`${API_URL}/bank-accounts/gocardless/callback`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requisition_id: requisitionId }),
  })
  const data = await res.json().catch(() => ({ ok: false }))
  if (!res.ok) return { ok: false, message: data.message || 'Kunde inte synka konton' }
  return data
}
