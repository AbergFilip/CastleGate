import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface SearchResult {
  type: 'document' | 'inventory' | 'vehicle' | 'boat' | 'insurance'
  id: string
  title: string
  description?: string
  category?: string
  url: string
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte söka')
    }

    const data = await response.json()
    return data.results || []
  } catch (error: any) {
    console.error('Error searching:', error)
    throw error
  }
}


