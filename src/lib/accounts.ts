import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_name: string
  account_number?: string
  account_type?: string
  balance: number
  currency: string
  iban?: string
  swift?: string
  notes?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getBankAccounts(): Promise<{ accounts: BankAccount[], total: number }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/bank-accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'Kunde inte hämta bankkonton'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch (e) {
        // Om response inte är JSON, använd status text
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Okänt fel'}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return { accounts: data.accounts || [], total: data.total || 0 }
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    throw error
  }
}

export async function refreshBankAccountBalance(accountId: string): Promise<{ ok: boolean; balance?: number; currency?: string; message?: string }> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const response = await fetch(`${API_URL}/bank-accounts/refresh-balance/${accountId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return { ok: false, message: data.message || 'Kunde inte uppdatera saldo' }
  return data
}

/** Skapar demo-konton (fake) utan Tink – använd för utveckling/test. */
export async function createDemoBankAccounts(): Promise<{ ok: boolean; created?: number; total?: number; message?: string }> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const response = await fetch(`${API_URL}/bank-accounts/demo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) return { ok: false, message: data.message || 'Kunde inte skapa demo-konton' }
  return data
}

export async function getBankAccount(id: string): Promise<BankAccount> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/bank-accounts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta bankkonto')
    }

    const data = await response.json()
    return data.account
  } catch (error) {
    console.error('Error fetching bank account:', error)
    throw error
  }
}

export async function createBankAccount(account: Partial<BankAccount>): Promise<BankAccount> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/bank-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa bankkonto')
    }

    const data = await response.json()
    return data.account
  } catch (error) {
    console.error('Error creating bank account:', error)
    throw error
  }
}

export async function updateBankAccount(id: string, updates: Partial<BankAccount>): Promise<BankAccount> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/bank-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera bankkonto')
    }

    const data = await response.json()
    return data.account
  } catch (error) {
    console.error('Error updating bank account:', error)
    throw error
  }
}

/**
 * Skickar Tink callback-parametrar till backend så att konton hämtas och sparas.
 */
export async function syncBankAccountsFromTink(params: {
  credentials_id?: string | null
  account_verification_report_id?: string | null
}): Promise<{ ok: boolean; created?: number; total?: number; message?: string; debugReportKeys?: string[]; debugPreview?: string; errorDetail?: { statusCode: number; body: string } }> {
  const token = await getAuthToken()
  if (!token) throw new Error('Ingen autentisering')
  const body: Record<string, string> = {}
  if (params.credentials_id) body.credentials_id = params.credentials_id
  if (params.account_verification_report_id) body.account_verification_report_id = params.account_verification_report_id
  if (!body.credentials_id && !body.account_verification_report_id) {
    return { ok: false, message: 'Ingen credentials_id eller account_verification_report_id' }
  }
  const response = await fetch(`${API_URL}/bank-accounts/tink-callback`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const rawText = await response.text()
  let data: Record<string, unknown> = {}
  try {
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    data = {}
  }
  const errorDetail = {
    statusCode: response.status,
    body: rawText?.slice(0, 2000) || '',
  }
  if (!response.ok) {
    return {
      ok: false,
      message: (data.message as string) || `Server svarade ${response.status}: ${rawText?.slice(0, 200) || response.statusText}`,
      errorDetail,
    }
  }
  if (data.ok === false) {
    return {
      ok: false,
      message: (data.message as string) || 'Kunde inte synka konton',
      total: data.total as number | undefined,
      errorDetail,
    }
  }
  return {
    ok: true,
    created: data.created as number | undefined,
    total: data.total as number | undefined,
    debugReportKeys: data.debugReportKeys as string[] | undefined,
    debugPreview: data.debugPreview as string | undefined,
  }
}

export async function deleteBankAccount(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/bank-accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort bankkonto')
    }
  } catch (error) {
    console.error('Error deleting bank account:', error)
    throw error
  }
}

