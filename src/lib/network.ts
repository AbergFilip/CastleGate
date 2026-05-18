import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

interface NetworkConnection {
  id?: string
  name: string
  relation?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  status?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

interface GetNetworkOptions {
  relation?: string
  status?: string
}

export async function getNetworkConnections(options: GetNetworkOptions = {}): Promise<NetworkConnection[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.relation) params.append('relation', options.relation)
    if (options.status) params.append('status', options.status)

    const url = `${API_URL}/network${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta nätverk')
    }

    const data = await response.json()
    return data.connections || []
  } catch (error: any) {
    console.error('Error fetching network connections:', error)
    throw error
  }
}

export async function createNetworkConnection(connection: NetworkConnection): Promise<NetworkConnection> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/network`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connection),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa relation')
    }

    const data = await response.json()
    return data.connection
  } catch (error: any) {
    console.error('Error creating network connection:', error)
    throw error
  }
}

export async function updateNetworkConnection(id: string, connection: Partial<NetworkConnection>): Promise<NetworkConnection> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/network/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connection),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera relation')
    }

    const data = await response.json()
    return data.connection
  } catch (error: any) {
    console.error('Error updating network connection:', error)
    throw error
  }
}

export async function deleteNetworkConnection(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/network/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort relation')
    }
  } catch (error: any) {
    console.error('Error deleting network connection:', error)
    throw error
  }
}

// Användarrelationer (connections mellan användare)
export interface UserConnection {
  id: string
  user_id: string
  connected_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  relation?: string
  notes?: string
  message?: string
  relation_type?: string
  tags?: string[]
  relation_strength?: string
  connected_user?: {
    id: string
    email: string
    name?: string
  }
  user?: {
    id: string
    email: string
    name?: string
  }
  is_sender?: boolean
  created_at?: string
  updated_at?: string
}

export async function searchUsers(query: string, filter?: string, sort?: string): Promise<any[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    params.append('q', query)
    if (filter) params.append('filter', filter)
    if (sort) params.append('sort', sort)

    const response = await fetch(`${API_URL}/users/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte söka efter användare')
    }

    const data = await response.json()
    return data.users || []
  } catch (error: any) {
    console.error('Error searching users:', error)
    throw error
  }
}

export async function getUserConnections(options: { status?: string } = {}): Promise<UserConnection[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (options.status) params.append('status', options.status)

    const url = `${API_URL}/user-connections${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta användarrelationer')
    }

    const data = await response.json()
    return data.connections || []
  } catch (error: any) {
    console.error('Error fetching user connections:', error)
    throw error
  }
}

export async function createUserConnection(
  connectedUserId: string, 
  relation?: string, 
  notes?: string, 
  message?: string,
  relationType?: string,
  tags?: string[],
  relationStrength?: string
): Promise<UserConnection> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const body: any = {
      connected_user_id: connectedUserId,
    }
    if (relation !== undefined) body.relation = relation
    if (notes !== undefined) body.notes = notes
    if (message !== undefined) body.message = message
    if (relationType !== undefined) body.relation_type = relationType
    if (tags !== undefined) body.tags = tags
    if (relationStrength !== undefined) body.relation_strength = relationStrength

    const response = await fetch(`${API_URL}/user-connections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa relation')
    }

    const data = await response.json()
    return data.connection
  } catch (error: any) {
    console.error('Error creating user connection:', error)
    throw error
  }
}

export async function updateUserConnection(
  id: string, 
  status: 'accepted' | 'blocked', 
  relation?: string, 
  notes?: string,
  relationType?: string,
  tags?: string[],
  relationStrength?: string
): Promise<UserConnection> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const body: any = { status }
    if (relation !== undefined) body.relation = relation
    if (notes !== undefined) body.notes = notes
    if (relationType !== undefined) body.relation_type = relationType
    if (tags !== undefined) body.tags = tags
    if (relationStrength !== undefined) body.relation_strength = relationStrength

    const response = await fetch(`${API_URL}/user-connections/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera relation')
    }

    const data = await response.json()
    return data.connection
  } catch (error: any) {
    console.error('Error updating user connection:', error)
    throw error
  }
}

export async function deleteUserConnection(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/user-connections/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort relation')
    }
  } catch (error: any) {
    console.error('Error deleting user connection:', error)
    throw error
  }
}

// Hämta användarprofil
export interface UserProfile {
  id: string
  name?: string
  email?: string
  avatar_url?: string
  bio?: string
  created_at?: string
  profile_visibility?: string
  can_send_request?: boolean
  connection_status?: string | null
  is_friend?: boolean
  friends_count?: number
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = 'Kunde inte hämta profil'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // Om vi inte kan parsa JSON, använd status text
        if (response.status === 404) {
          errorMessage = 'Användare hittades inte'
        } else if (response.status === 403) {
          errorMessage = 'Du har inte behörighet att se denna profil'
        } else {
          errorMessage = response.statusText || errorMessage
        }
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.user
  } catch (error: any) {
    // Logga bara om det inte är ett 404-fel (för att undvika spam)
    if (!error.message?.includes('hittades inte') && !error.message?.includes('404')) {
      console.error('Error fetching user profile:', error)
    }
    throw error
  }
}

// Hämta gemensamma vänner
export async function getMutualFriends(userId: string): Promise<any[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/${userId}/mutual-friends`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta gemensamma vänner')
    }

    const data = await response.json()
    return data.mutual_friends || []
  } catch (error: any) {
    console.error('Error fetching mutual friends:', error)
    throw error
  }
}

// Hämta rekommenderade användare
export interface NetworkStats {
  friends_count: number
  pending_received_count: number
  pending_sent_count: number
  contacts_count: number
  lists_count: number
}

export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/network/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta statistik')
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error fetching network stats:', error)
    // Returnera tom statistik vid fel
    return {
      friends_count: 0,
      pending_received_count: 0,
      pending_sent_count: 0,
      contacts_count: 0,
      lists_count: 0
    }
  }
}

export async function getRecommendedUsers(): Promise<any[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/recommended`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Om 404, returnera tom array istället för att kasta fel
      if (response.status === 404) {
        return []
      }
      let error
      try {
        error = await response.json()
      } catch {
        error = { message: 'Kunde inte hämta rekommenderade användare' }
      }
      throw new Error(error.message || 'Kunde inte hämta rekommenderade användare')
    }

    const data = await response.json()
    return data.recommended || []
  } catch (error: any) {
    console.error('Error fetching recommended users:', error)
    throw error
  }
}

// Uppdatera profilinställningar
export interface ProfileSettings {
  avatar_url?: string
  bio?: string
  profile_visibility?: 'public' | 'friends' | 'private'
  allow_friend_requests?: boolean
  show_email?: boolean
  show_phone?: boolean
  show_address?: boolean
}

// Hämta användarens egen profil
export async function getMyProfile(): Promise<any> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 sekunder timeout

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Kunde inte hämta profil' }))
        throw new Error(error.message || 'Kunde inte hämta profil')
      }

      const data = await response.json()
      return data.user
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      if (fetchErr.name === 'AbortError') {
        throw new Error('Timeout vid hämtning av profil')
      }
      throw fetchErr
    }
  } catch (error: any) {
    // Inte logga varning för vanliga nätverksfel
    if (!error.message?.includes('ERR_INSUFFICIENT_RESOURCES') && 
        !error.message?.includes('Failed to fetch')) {
      console.error('Error fetching my profile:', error)
    }
    throw error
  }
}

// Uppdatera användarens egen profil
export async function updateMyProfile(profileData: any): Promise<any> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 sekunder timeout

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = 'Kunde inte uppdatera profil'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch (parseError) {
          // Om vi inte kan parsa JSON, använd status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data.user
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      if (fetchErr.name === 'AbortError') {
        throw new Error('Timeout vid uppdatering av profil. Försök igen.')
      }
      throw fetchErr
    }
  } catch (error: any) {
    // Logga bara om det inte är ett vanligt nätverksfel
    if (!error.message?.includes('Timeout') && 
        !error.message?.includes('Failed to fetch') &&
        !error.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
      console.error('Error updating my profile:', error)
    }
    throw error
  }
}

export async function updateProfileSettings(settings: ProfileSettings): Promise<any> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/profile-settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera inställningar')
    }

    const data = await response.json()
    return data.user
  } catch (error: any) {
    console.error('Error updating profile settings:', error)
    throw error
  }
}

// Blockering av användare
export interface BlockedUser {
  blocked_user_id: string
  reason?: string
  created_at?: string
  user?: {
    id: string
    name?: string
    email?: string
    avatar_url?: string
  }
}

export async function blockUser(userId: string, reason?: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/${userId}/block`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte blockera användare')
    }
  } catch (error: any) {
    console.error('Error blocking user:', error)
    throw error
  }
}

export async function unblockUser(userId: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/${userId}/block`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte avblockera användare')
    }
  } catch (error: any) {
    console.error('Error unblocking user:', error)
    throw error
  }
}

export async function getBlockedUsers(): Promise<BlockedUser[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/users/blocked`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta blockerade användare')
    }

    const data = await response.json()
    return data.blocked_users || []
  } catch (error: any) {
    console.error('Error fetching blocked users:', error)
    throw error
  }
}

// Vänlistor
export interface FriendList {
  id: string
  user_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  member_count?: number
  created_at?: string
  updated_at?: string
}

export interface FriendListMember {
  connection_id: string
  user: {
    id: string
    name?: string
    email?: string
    avatar_url?: string
  }
  relation?: string
  relation_type?: string
  tags?: string[]
}

export async function getFriendLists(): Promise<FriendList[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta vänlistor')
    }

    const data = await response.json()
    return data.lists || []
  } catch (error: any) {
    console.error('Error fetching friend lists:', error)
    throw error
  }
}

export async function createFriendList(name: string, description?: string, color?: string, icon?: string): Promise<FriendList> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, color, icon }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa vänlista')
    }

    const data = await response.json()
    return data.list
  } catch (error: any) {
    console.error('Error creating friend list:', error)
    throw error
  }
}

export async function updateFriendList(id: string, name?: string, description?: string, color?: string, icon?: string): Promise<FriendList> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const body: any = {}
    if (name !== undefined) body.name = name
    if (description !== undefined) body.description = description
    if (color !== undefined) body.color = color
    if (icon !== undefined) body.icon = icon

    const response = await fetch(`${API_URL}/friend-lists/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera vänlista')
    }

    const data = await response.json()
    return data.list
  } catch (error: any) {
    console.error('Error updating friend list:', error)
    throw error
  }
}

export async function deleteFriendList(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort vänlista')
    }
  } catch (error: any) {
    console.error('Error deleting friend list:', error)
    throw error
  }
}

export async function getFriendListMembers(listId: string): Promise<FriendListMember[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists/${listId}/members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta medlemmar')
    }

    const data = await response.json()
    return data.members || []
  } catch (error: any) {
    console.error('Error fetching friend list members:', error)
    throw error
  }
}

export async function addMemberToList(listId: string, connectionId: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists/${listId}/members/${connectionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte lägga till medlem i lista')
    }
  } catch (error: any) {
    console.error('Error adding member to list:', error)
    throw error
  }
}

export async function removeMemberFromList(listId: string, connectionId: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/friend-lists/${listId}/members/${connectionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort medlem från lista')
    }
  } catch (error: any) {
    console.error('Error removing member from list:', error)
    throw error
  }
}

