import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

// Hämta alla dokument
export async function getDocuments(filters?: {
  category?: string
  subcategory?: string
  search?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.subcategory) params.append('subcategory', filters.subcategory)
    if (filters?.search) params.append('search', filters.search)

    const response = await fetch(`${API_URL}/documents?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta dokument')
    }

    const data = await response.json()
    return data.documents || []
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

// Hämta ett specifikt dokument
export async function getDocument(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/documents/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta dokument')
    }

    const data = await response.json()
    return data.document
  } catch (error) {
    console.error('Error fetching document:', error)
    throw error
  }
}

// Skapa nytt dokument
export async function createDocument(document: {
  category: string
  subcategory?: string
  title: string
  description?: string
  file_url?: string
  file_name?: string
  file_type?: string
  file_size?: number
  metadata?: Record<string, any>
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa dokument')
    }

    const data = await response.json()
    return data.document
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

// Uppdatera dokument
export async function updateDocument(id: string, updates: {
  title?: string
  description?: string
  file_url?: string
  file_name?: string
  file_type?: string
  file_size?: number
  metadata?: Record<string, any>
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera dokument')
    }

    const data = await response.json()
    return data.document
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// Ta bort dokument
export async function deleteDocument(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort dokument')
    }

    return true
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

// ICE kontakter
export async function getIceContacts() {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/ice-contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta kontakter')
    }

    const data = await response.json()
    return data.contacts || []
  } catch (error) {
    console.error('Error fetching ICE contacts:', error)
    throw error
  }
}

export async function createIceContact(contact: {
  name: string
  relation?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/ice-contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa kontakt')
    }

    const data = await response.json()
    return data.contact
  } catch (error) {
    console.error('Error creating ICE contact:', error)
    throw error
  }
}

export async function updateIceContact(id: string, updates: {
  name?: string
  relation?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/ice-contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera kontakt')
    }

    const data = await response.json()
    return data.contact
  } catch (error) {
    console.error('Error updating ICE contact:', error)
    throw error
  }
}

export async function deleteIceContact(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/ice-contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort kontakt')
    }

    return true
  } catch (error) {
    console.error('Error deleting ICE contact:', error)
    throw error
  }
}

// Skolor
export async function getSchools(type?: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = type ? `?type=${type}` : ''
    const response = await fetch(`${API_URL}/schools${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta skolor')
    }

    const data = await response.json()
    return data.schools || []
  } catch (error) {
    console.error('Error fetching schools:', error)
    throw error
  }
}

export async function createSchool(school: {
  name: string
  type: string
  address?: string
  phone?: string
  email?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/schools`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(school)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa skola')
    }

    const data = await response.json()
    return data.school
  } catch (error) {
    console.error('Error creating school:', error)
    throw error
  }
}

export async function deleteSchool(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/schools/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort skola')
    }

    return true
  } catch (error) {
    console.error('Error deleting school:', error)
    throw error
  }
}

// Skolkontakter
export async function getSchoolContacts(schoolId: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/schools/${schoolId}/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta kontakter')
    }

    const data = await response.json()
    return data.contacts || []
  } catch (error) {
    console.error('Error fetching school contacts:', error)
    throw error
  }
}

export async function createSchoolContact(
  schoolId: string,
  contact: { name: string; role?: string; phone?: string; email?: string },
) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/schools/${schoolId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa kontakt')
    }

    const data = await response.json()
    return data.contact
  } catch (error) {
    console.error('Error creating school contact:', error)
    throw error
  }
}

export async function deleteSchoolContact(schoolId: string, contactId: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/schools/${schoolId}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort kontakt')
    }

    return true
  } catch (error) {
    console.error('Error deleting school contact:', error)
    throw error
  }
}

// Betyg
export async function getGrades(educationLevel?: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const params = educationLevel ? `?education_level=${educationLevel}` : ''
    const response = await fetch(`${API_URL}/grades${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte hämta betyg')
    }

    const data = await response.json()
    return data.grades || []
  } catch (error) {
    console.error('Error fetching grades:', error)
    throw error
  }
}

export async function createGrade(grade: {
  education_level: string
  school_name?: string
  program?: string
  year?: number
  semester?: string
  courses?: any[]
  document_id?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/grades`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(grade)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte skapa betyg')
    }

    const data = await response.json()
    return data.grade
  } catch (error) {
    console.error('Error creating grade:', error)
    throw error
  }
}

export async function updateGrade(id: string, updates: {
  education_level?: string
  school_name?: string
  program?: string
  year?: number
  semester?: string
  courses?: any[]
  document_id?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/grades/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte uppdatera betyg')
    }

    const data = await response.json()
    return data.grade
  } catch (error) {
    console.error('Error updating grade:', error)
    throw error
  }
}

export async function deleteGrade(id: string) {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Ingen autentisering')
    }

    const response = await fetch(`${API_URL}/grades/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Kunde inte ta bort betyg')
    }

    return true
  } catch (error) {
    console.error('Error deleting grade:', error)
    throw error
  }
}

