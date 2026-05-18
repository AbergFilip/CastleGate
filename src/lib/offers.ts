import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Offer {
  id: string
  user_id: string
  title: string
  description?: string
  category?: string
  badge?: string
  price?: string
  type?: string
  link_url?: string
  viewed: boolean
  created_at: string
  expires_at?: string
}

export async function getOffers(options: { viewed?: boolean } = {}): Promise<Offer[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.viewed !== undefined) params.append('viewed', String(options.viewed))

    const url = `${API_URL}/offers${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta erbjudanden')
    }

    const data = await response.json()
    return data.offers || []
  } catch (error: any) {
    console.error('Error fetching offers:', error)
    throw error
  }
}

export async function createOffer(offer: {
  title: string
  description?: string
  category?: string
  badge?: string
  price?: string
  type?: string
  link_url?: string
  expires_at?: string
}): Promise<Offer> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/offers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offer),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa erbjudande')
    }

    const data = await response.json()
    return data.offer
  } catch (error: any) {
    console.error('Error creating offer:', error)
    throw error
  }
}

export async function updateOffer(id: string, updates: { viewed?: boolean }): Promise<Offer> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/offers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera erbjudande')
    }

    const data = await response.json()
    return data.offer
  } catch (error: any) {
    console.error('Error updating offer:', error)
    throw error
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort erbjudande')
    }
  } catch (error: any) {
    console.error('Error deleting offer:', error)
    throw error
  }
}


