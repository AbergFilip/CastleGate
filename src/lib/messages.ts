import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Message {
  id: string
  sender_id?: string
  recipient_id: string
  sender_name: string
  sender_type: string
  subject?: string
  content: string
  read: boolean
  category?: string
  created_at: string
  updated_at: string
}

export async function getMessages(options: { read?: boolean; type?: string } = {}): Promise<Message[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.read !== undefined) params.append('read', String(options.read))
    if (options.type) params.append('type', options.type)

    const url = `${API_URL}/messages${params.toString() ? `?${params.toString()}` : ''}`
    
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
        if (import.meta.env.DEV) console.warn('Messages endpoint not found, returning empty array')
        return []
      }
      let error
      try {
        error = await response.json()
      } catch {
        error = { message: 'Kunde inte hämta meddelanden' }
      }
      throw new Error(error.message || 'Kunde inte hämta meddelanden')
    }

    const data = await response.json()
    return data.messages || []
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

export async function sendMessage(message: {
  recipient_id: string
  subject?: string
  content: string
  sender_name?: string
  sender_type?: string
}): Promise<Message> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skicka meddelande')
    }

    const data = await response.json()
    return data.message
  } catch (error: any) {
    console.error('Error sending message:', error)
    throw error
  }
}

export async function markMessageAsRead(id: string): Promise<Message> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/messages/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera meddelande')
    }

    const data = await response.json()
    return data.message
  } catch (error: any) {
    console.error('Error updating message:', error)
    throw error
  }
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort meddelande')
    }
  } catch (error: any) {
    console.error('Error deleting message:', error)
    throw error
  }
}

