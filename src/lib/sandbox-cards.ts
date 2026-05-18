import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export async function syncSandboxCards(bankId: string): Promise<{
  ok: boolean
  created?: number
  total?: number
  bank_name?: string
  message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/cards/sandbox/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bank_id: bankId }),
  })
  return await res.json().catch(() => ({ ok: false, message: 'Serverfel' }))
}
