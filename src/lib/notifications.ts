import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Notification {
  id: string
  user_id: string
  category: string
  title: string
  description?: string
  type?: string
  reference_id?: string
  read: boolean
  created_at: string
  updated_at: string
}

export async function getNotifications(options: { read?: boolean } = {}): Promise<Notification[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.read !== undefined) params.append('read', String(options.read))

    const url = `${API_URL}/notifications${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Om 404, returnera tom array (tabellen kanske inte finns ännu)
      if (response.status === 404) {
        if (import.meta.env.DEV) console.warn('Notifications endpoint not found, returning empty array')
        return []
      }
      let error
      try {
        error = await response.json()
      } catch {
        error = { message: 'Kunde inte hämta notifikationer' }
      }
      throw new Error(error.message || 'Kunde inte hämta notifikationer')
    }

    const data = await response.json()
    return data.notifications || []
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera notifikation')
    }

    const data = await response.json()
    return data.notification
  } catch (error: any) {
    console.error('Error updating notification:', error)
    throw error
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort notifikation')
    }
  } catch (error: any) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

export async function clearAllNotifications(): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/notifications`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte rensa notifikationer')
    }
  } catch (error: any) {
    console.error('Error clearing notifications:', error)
    throw error
  }
}

