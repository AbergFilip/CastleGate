/**
 * BankID API Client
 * 
 * OBS: BankID-integration kräver en backend-server med FP-certifikat.
 * Denna klient är en placeholder som förbereder strukturen.
 * 
 * För att implementera BankID behöver du:
 * 1. Teckna avtal med BankID eller en återförsäljare
 * 2. Skaffa FP-certifikat
 * 3. Skapa en backend-server som hanterar BankID-autentisering
 * 4. Uppdatera API_BASE_URL till din backend
 */

const API_BASE_URL = import.meta.env.VITE_BANKID_API_URL || 'http://localhost:3001/api/bankid'

export interface BankIDStatus {
  linked: boolean
  personalNumber?: string
  linkedAt?: string
}

export interface BankIDAuthRequest {
  personalNumber?: string // Optional - om inte angivet, användaren väljer i BankID-appen
  endUserIp: string
}

export interface BankIDAuthResponse {
  orderRef: string
  autoStartToken: string
  qrStartToken: string
  qrStartSecret: string
  qrStartTime?: number // Starttid för QR-kodgenerering (när BankID's QrGenerator konstruerades)
}

export interface BankIDCollectResponse {
  orderRef: string
  status: 'pending' | 'complete' | 'failed'
  hintCode?: string
  completionData?: {
    user: {
      personalNumber: string
      name: string
      givenName: string
      surname: string
    }
    device: {
      ipAddress: string
    }
    cert: {
      notBefore: string
      notAfter: string
    }
  }
}

/**
 * Initiera BankID-autentisering
 */
export async function initiateBankIDAuth(personalNumber?: string): Promise<BankIDAuthResponse> {
  console.log('🚀 Initiating BankID auth, API URL:', API_BASE_URL)
  
  // Hämta användarens IP-adress (via backend)
  let endUserIp = '127.0.0.1'
  try {
    const ipResponse = await fetch(`${API_BASE_URL}/ip`, {
      credentials: 'include',
    })
    if (ipResponse.ok) {
      const ipData = await ipResponse.json()
      endUserIp = ipData.ip || '127.0.0.1'
    }
  } catch (error) {
    console.warn('Could not fetch IP, using default:', error)
  }
  
  console.log('📤 Sending auth request:', { personalNumber, endUserIp })
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        personalNumber,
        endUserIp,
      } as BankIDAuthRequest),
    })

    console.log('📥 Response status:', response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
      console.error('❌ Auth error:', error)
      throw new Error(error.message || 'Kunde inte initiera BankID-autentisering')
    }

    const data = await response.json()
    console.log('✅ Auth successful:', data)
    return data
  } catch (error: any) {
    console.error('❌ Fetch error:', error)
    console.error('❌ Error type:', error.constructor.name)
    console.error('❌ Error message:', error.message)
    if (error.message.includes('CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
      throw new Error('Backend-servern körs inte. Kontrollera att backend-servern är startad på port 3001.')
    }
    throw error
  }
}

/**
 * Generera QR-kod sträng (via backend för korrekt HMAC-generering)
 * Använder BankID's egen QrGenerator-instans
 */
export async function generateQRCode(orderRef: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      orderRef
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte generera QR-kod')
  }

  const data = await response.json()
  return data.qrCode
}

/**
 * Kontrollera status för BankID-autentisering
 */
export async function collectBankIDAuth(orderRef: string): Promise<BankIDCollectResponse> {
  const response = await fetch(`${API_BASE_URL}/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ orderRef }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte hämta autentiseringsstatus')
  }

  return response.json()
}

/**
 * Skapa konto med BankID (signup)
 */
export async function signUpWithBankID(bankIDData: {
  personalNumber: string
  name: string
  email?: string
}): Promise<{ 
  success: boolean
  userId?: string
  email?: string
  name?: string
  token?: string
  tokenHash?: string
  actionLink?: string
  message?: string 
}> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bankIDData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte skapa konto med BankID')
  }

  return response.json()
}

/**
 * Logga in med BankID
 */
export async function signInWithBankID(bankIDData: {
  personalNumber: string
  name: string
}): Promise<{ 
  success: boolean
  userId?: string
  email?: string
  name?: string
  token?: string
  tokenHash?: string
  actionLink?: string
  message?: string 
}> {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bankIDData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte logga in med BankID')
  }

  return response.json()
}

/**
 * Koppla BankID till användarkonto (för befintliga konton)
 */
export async function linkBankIDToAccount(bankIDData: {
  personalNumber: string
  name: string
}): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_BASE_URL}/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bankIDData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte koppla BankID')
  }

  return response.json()
}

/**
 * Kolla om användaren har kopplat BankID
 */
export async function checkBankIDStatus(): Promise<BankIDStatus> {
  const response = await fetch(`${API_BASE_URL}/status`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    // Om backend inte är implementerad än, returnera false
    if (response.status === 404 || response.status === 500) {
      return { linked: false }
    }
    throw new Error('Kunde inte kontrollera BankID-status')
  }

  return response.json()
}

/**
 * Ta bort BankID-koppling
 */
export async function unlinkBankID(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/unlink`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte ta bort BankID-koppling')
  }

  return response.json()
}

/**
 * Hämta användarens IP-adress (via backend)
 */
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ip`, {
      credentials: 'include',
    })
    if (response.ok) {
      const data = await response.json()
      return data.ip || '127.0.0.1'
    }
  } catch (error) {
    console.warn('Kunde inte hämta IP-adress:', error)
  }
  return '127.0.0.1' // Fallback
}

