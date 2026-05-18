import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

// Properties (Hem/Fastigheter)
export interface Property {
  id: string
  user_id: string
  type: string
  address: string
  city?: string
  postal_code?: string
  country?: string
  property_type?: string
  size_sqm?: number
  rooms?: number
  floor?: string
  purchase_date?: string
  purchase_price?: number
  current_value?: number
  valuation_date?: string
  valuation_source?: string
  description?: string
  images?: string[]
  documents?: any[]
  metadata?: any
  created_at?: string
  updated_at?: string
}

export async function getProperties(type?: string): Promise<Property[]> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = type ? `?type=${type}` : ''
    const response = await fetch(`${API_URL}/properties${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta fastigheter')
    }

    const data = await response.json()
    return data.properties || []
  } catch (error) {
    console.error('Error fetching properties:', error)
    throw error
  }
}

export async function getProperty(id: string): Promise<Property> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/properties/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta fastighet')
    }

    const data = await response.json()
    return data.property
  } catch (error) {
    console.error('Error fetching property:', error)
    throw error
  }
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(property)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa fastighet')
    }

    const data = await response.json()
    return data.property
  } catch (error) {
    console.error('Error creating property:', error)
    throw error
  }
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera fastighet')
    }

    const data = await response.json()
    return data.property
  } catch (error) {
    console.error('Error updating property:', error)
    throw error
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort fastighet')
    }
  } catch (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

// Sandbox-synkronisering (simulerad Lantmäteriet-hämtning)
export async function syncSandboxProperties(): Promise<{
  ok: boolean
  created?: number
  total?: number
  message?: string
}> {
  try {
    const token = await getAuthToken()
    if (!token) throw new Error('Ingen autentisering')
    const urls = [
      `${API_URL}/assets/properties/sandbox/sync`,
      `${API_URL}/properties/sandbox/sync`,
    ]
    let lastError = ''
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          lastError = data?.message || data?.error?.message || `Serverfel (${res.status})`
          continue
        }
        return data
      } catch {
        continue
      }
    }
    return { ok: false, message: lastError || 'Kunde inte nå backend' }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Något gick fel' }
  }
}

// Adresssökning via Lantmäteriet (för "Lägg till hem")
export interface AddressSearchResult {
  label: string
  address?: string
  postal_code?: string
  city?: string
  street?: string
  objectId?: string
}

export async function searchAddress(query: string, maxHits = 15): Promise<AddressSearchResult[]> {
  try {
    const token = await getAuthToken()
    if (!token) return []

    const params = new URLSearchParams()
    params.set('q', query)
    if (maxHits) params.set('maxHits', String(maxHits))

    const response = await fetch(`${API_URL}/properties/address-search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching address:', error)
    return []
  }
}

// Sök över alla properties
export async function searchProperties(query: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/properties/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte söka')
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching properties:', error)
    throw error
  }
}

// Hjälpfunktion för att formatera värde
export function formatPropertyValue(value?: number): string {
  if (!value) return 'Ej angivet'
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(value)
}

// Inventories
export async function getInventories(filters?: { type?: string; category?: string }) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.category) params.append('category', filters.category)

    const response = await fetch(`${API_URL}/inventories?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta inventarier')
    }

    const data = await response.json()
    return data.inventories || []
  } catch (error) {
    console.error('Error fetching inventories:', error)
    throw error
  }
}

export async function createInventory(inventory: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/inventories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inventory)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa inventarie')
    }

    const data = await response.json()
    return data.inventory
  } catch (error) {
    console.error('Error creating inventory:', error)
    throw error
  }
}

export async function updateInventory(id: string, updates: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/inventories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera inventarie')
    }

    const data = await response.json()
    return data.inventory
  } catch (error) {
    console.error('Error updating inventory:', error)
    throw error
  }
}

export async function deleteInventory(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/inventories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort inventarie')
    }

    return true
  } catch (error) {
    console.error('Error deleting inventory:', error)
    throw error
  }
}

// Vehicles
export async function getVehicles(type?: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = type ? `?type=${type}` : ''
    const response = await fetch(`${API_URL}/vehicles${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta fordon')
    }

    const data = await response.json()
    return data.vehicles || []
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
}

export async function createVehicle(vehicle: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicle)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa fordon')
    }

    const data = await response.json()
    return data.vehicle
  } catch (error) {
    console.error('Error creating vehicle:', error)
    throw error
  }
}

export async function updateVehicle(id: string, updates: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera fordon')
    }

    const data = await response.json()
    return data.vehicle
  } catch (error) {
    console.error('Error updating vehicle:', error)
    throw error
  }
}

export async function deleteVehicle(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort fordon')
    }

    return true
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    throw error
  }
}

// Boats
export async function getBoats(type?: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = type ? `?type=${type}` : ''
    const response = await fetch(`${API_URL}/boats${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta båtar')
    }

    const data = await response.json()
    return data.boats || []
  } catch (error) {
    console.error('Error fetching boats:', error)
    throw error
  }
}

export async function createBoat(boat: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/boats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(boat)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa båt')
    }

    const data = await response.json()
    return data.boat
  } catch (error) {
    console.error('Error creating boat:', error)
    throw error
  }
}

export async function updateBoat(id: string, updates: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/boats/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera båt')
    }

    const data = await response.json()
    return data.boat
  } catch (error) {
    console.error('Error updating boat:', error)
    throw error
  }
}

export async function deleteBoat(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/boats/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort båt')
    }

    return true
  } catch (error) {
    console.error('Error deleting boat:', error)
    throw error
  }
}

// Insurances
export async function getInsurances(category?: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = category ? `?category=${category}` : ''
    const response = await fetch(`${API_URL}/insurances${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta försäkringar')
    }

    const data = await response.json()
    return data.insurances || []
  } catch (error) {
    console.error('Error fetching insurances:', error)
    throw error
  }
}

export async function createInsurance(insurance: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/insurances`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(insurance)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa försäkring')
    }

    const data = await response.json()
    return data.insurance
  } catch (error) {
    console.error('Error creating insurance:', error)
    throw error
  }
}

export async function updateInsurance(id: string, updates: any) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/insurances/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera försäkring')
    }

    const data = await response.json()
    return data.insurance
  } catch (error) {
    console.error('Error updating insurance:', error)
    throw error
  }
}

export async function deleteInsurance(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/insurances/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort försäkring')
    }

    return true
  } catch (error) {
    console.error('Error deleting insurance:', error)
    throw error
  }
}

// ── Sandbox sync functions ──

export async function syncSandboxVehicles(): Promise<{ ok: boolean; created?: number; skipped?: number; total?: number; message?: string }> {
  const token = await getAuthToken()
  const res = await fetch(`${API_URL}/vehicles/sandbox/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({}),
  })
  return res.json()
}

export async function syncSandboxBoats(): Promise<{ ok: boolean; created?: number; skipped?: number; total?: number; message?: string }> {
  const token = await getAuthToken()
  const res = await fetch(`${API_URL}/boats/sandbox/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({}),
  })
  return res.json()
}

export async function getInsuranceCompanies(): Promise<{ ok: boolean; companies: Array<{ id: string; name: string }> }> {
  const res = await fetch(`${API_URL}/insurances/sandbox/companies`)
  return res.json()
}

export async function syncSandboxInsurances(companyId: string): Promise<{ ok: boolean; created?: number; skipped?: number; total?: number; message?: string }> {
  const token = await getAuthToken()
  const res = await fetch(`${API_URL}/insurances/sandbox/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ company_id: companyId }),
  })
  return res.json()
}

