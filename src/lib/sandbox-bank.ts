import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface SandboxBank {
  id: string
  name: string
  logo: string
  bic: string
}

export async function getSandboxBanks(): Promise<SandboxBank[]> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/bank-accounts/sandbox/banks`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const data = await res.json().catch(() => ({ ok: false }))
  if (!res.ok || !data.ok) return []
  return data.banks ?? []
}

export async function connectSandboxBank(bankId: string): Promise<{
  ok: boolean
  session_id?: string
  bank_name?: string
  account_count?: number
  message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/bank-accounts/sandbox/connect`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bank_id: bankId }),
  })
  return await res.json().catch(() => ({ ok: false, message: 'Serverfel' }))
}

export async function syncSandboxAccounts(sessionId: string): Promise<{
  ok: boolean
  created?: number
  skipped?: number
  total?: number
  bank_name?: string
  message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/bank-accounts/sandbox/callback`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  })
  return await res.json().catch(() => ({ ok: false, message: 'Serverfel' }))
}
