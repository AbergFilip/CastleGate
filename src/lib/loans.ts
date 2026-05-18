import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Loan {
  id: string
  user_id: string
  loan_type: 'mortgage' | 'personal' | 'car' | 'student' | 'other'
  loan_name: string
  bank_name?: string
  amount: number
  remaining_amount?: number
  interest_rate?: number
  monthly_payment?: number
  currency: string
  start_date?: string
  end_date?: string
  notes?: string
  is_active: boolean
}

export async function getLoans(): Promise<{ loans: Loan[]; totalDebt: number; totalMonthly: number }> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/loans`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Kunde inte hämta lån')
  return await res.json()
}

export async function deleteLoan(id: string): Promise<void> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/loans/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Kunde inte ta bort lån')
}

export async function syncSandboxLoans(bankId: string): Promise<{
  ok: boolean; created?: number; total?: number; bank_name?: string; message?: string
}> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const res = await fetch(`${API_URL}/loans/sandbox/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bank_id: bankId }),
  })
  return await res.json().catch(() => ({ ok: false, message: 'Serverfel' }))
}
