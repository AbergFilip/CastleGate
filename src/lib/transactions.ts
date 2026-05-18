import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Transaction {
  id: string
  user_id: string
  bank_account_id?: string
  transaction_date: string
  amount: number
  currency: string
  merchant?: string
  description?: string
  category?: string
  transaction_type?: string
  reference?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export async function getTransactions(accountId: string, limit: number = 50, offset: number = 0): Promise<{ transactions: Transaction[], total: number }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/transactions/bank-accounts/${accountId}?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta transaktioner')
    }

    const data = await response.json()
    return { transactions: data.transactions || [], total: data.total || 0 }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

export async function createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa transaktion')
    }

    const data = await response.json()
    return data.transaction
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera transaktion')
    }

    const data = await response.json()
    return data.transaction
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort transaktion')
    }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}

