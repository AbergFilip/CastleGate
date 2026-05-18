import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export interface Request {
  id: string
  user_id: string
  title: string
  description?: string
  category?: string
  status: string
  responses_count: number
  created_at: string
  updated_at: string
}

export interface RequestResponse {
  id: string
  request_id: string
  responder_id?: string
  responder_name: string
  responder_type: string
  message?: string
  price?: string
  contact_info?: any
  created_at: string
}

export async function getRequests(options: { status?: string } = {}): Promise<Request[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.status) params.append('status', options.status)

    const url = `${API_URL}/requests${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta förfrågningar')
    }

    const data = await response.json()
    return data.requests || []
  } catch (error: any) {
    console.error('Error fetching requests:', error)
    throw error
  }
}

export async function getRequest(id: string): Promise<{ request: Request; responses: RequestResponse[] }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta förfrågan')
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error fetching request:', error)
    throw error
  }
}

export async function createRequest(request: { title: string; description?: string; category?: string }): Promise<Request> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa förfrågan')
    }

    const data = await response.json()
    return data.request
  } catch (error: any) {
    console.error('Error creating request:', error)
    throw error
  }
}

export async function updateRequest(id: string, updates: Partial<Request>): Promise<Request> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera förfrågan')
    }

    const data = await response.json()
    return data.request
  } catch (error: any) {
    console.error('Error updating request:', error)
    throw error
  }
}

export async function deleteRequest(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort förfrågan')
    }
  } catch (error: any) {
    console.error('Error deleting request:', error)
    throw error
  }
}

export async function createRequestResponse(
  requestId: string,
  response: {
    message?: string
    price?: string
    contact_info?: any
    responder_name?: string
    responder_type?: string
  }
): Promise<RequestResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const res = await fetch(`${API_URL}/requests/${requestId}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Kunde inte skapa svar')
    }

    const data = await res.json()
    return data.response
  } catch (error: any) {
    console.error('Error creating request response:', error)
    throw error
  }
}


