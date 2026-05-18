import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Asset {
  id: string
  user_id: string
  asset_type: 'property' | 'vehicle' | 'movable'
  name: string
  description?: string
  value: number
  currency: string
  purchase_date?: string
  purchase_price?: number
  current_value?: number
  valuation_date?: string
  notes?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getAssets(): Promise<{ assets: Asset[], total: number }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/assets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'Kunde inte hämta tillgångar'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText || 'Okänt fel'}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return { assets: data.assets || [], total: data.total || 0 }
  } catch (error) {
    console.error('Error fetching assets:', error)
    throw error
  }
}

export async function createAsset(asset: Partial<Asset>): Promise<Asset> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(asset)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa tillgång')
    }

    const data = await response.json()
    return data.asset
  } catch (error) {
    console.error('Error creating asset:', error)
    throw error
  }
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera tillgång')
    }

    const data = await response.json()
    return data.asset
  } catch (error) {
    console.error('Error updating asset:', error)
    throw error
  }
}

export async function deleteAsset(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort tillgång')
    }
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw error
  }
}

