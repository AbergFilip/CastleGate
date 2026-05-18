import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Investment {
  id: string
  user_id: string
  provider: string
  account_name: string
  investment_type: 'stock' | 'fund' | 'etf' | 'bond' | 'other'
  symbol?: string
  amount: number
  quantity?: number
  purchase_price?: number
  current_price?: number
  currency: string
  growth_percent?: number
  account_type?: string
  external_url?: string
  notes?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getInvestments(): Promise<{ investments: Investment[], total: number, totalGrowth: number }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/investments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'Kunde inte hämta investeringar'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Okänt fel'}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return { investments: data.investments || [], total: data.total || 0, totalGrowth: data.totalGrowth || 0 }
  } catch (error) {
    console.error('Error fetching investments:', error)
    throw error
  }
}

export async function createInvestment(investment: Partial<Investment>): Promise<Investment> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investment)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa investering')
    }

    const data = await response.json()
    return data.investment
  } catch (error) {
    console.error('Error creating investment:', error)
    throw error
  }
}

export async function updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/investments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera investering')
    }

    const data = await response.json()
    return data.investment
  } catch (error) {
    console.error('Error updating investment:', error)
    throw error
  }
}

export async function deleteInvestment(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/investments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort investering')
    }
  } catch (error) {
    console.error('Error deleting investment:', error)
    throw error
  }
}

export async function syncSandboxInvestments(bankId: string): Promise<{
  ok: boolean
  created?: number
  skipped?: number
  total?: number
  message?: string
}> {
  try {
    const token = await getAuthToken()
    if (!token) throw new Error('Ingen autentisering')
    const res = await fetch(`${API_URL}/investments/sandbox/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bank_id: bankId }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, message: data?.message || `Serverfel (${res.status})` }
    }
    return data
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Något gick fel' }
  }
}
