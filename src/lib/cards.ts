import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Card {
  id: string
  user_id: string
  card_type: 'debit' | 'credit' | 'other_credit'
  bank_name?: string
  card_name: string
  last_four?: string
  card_number?: string
  balance?: number
  credit_limit?: number
  available_credit?: number
  currency: string
  expiry_date?: string
  notes?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getCards(): Promise<Card[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/cards`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta kort')
    }

    const data = await response.json()
    return data.cards || []
  } catch (error) {
    console.error('Error fetching cards:', error)
    throw error
  }
}

export async function getCard(id: string): Promise<Card> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/cards/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta kort')
    }

    const data = await response.json()
    return data.card
  } catch (error) {
    console.error('Error fetching card:', error)
    throw error
  }
}

export async function createCard(card: Partial<Card>): Promise<Card> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa kort')
    }

    const data = await response.json()
    return data.card
  } catch (error) {
    console.error('Error creating card:', error)
    throw error
  }
}

export async function updateCard(id: string, updates: Partial<Card>): Promise<Card> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera kort')
    }

    const data = await response.json()
    return data.card
  } catch (error) {
    console.error('Error updating card:', error)
    throw error
  }
}

export async function deleteCard(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort kort')
    }
  } catch (error) {
    console.error('Error deleting card:', error)
    throw error
  }
}

