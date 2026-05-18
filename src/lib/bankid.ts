import { supabase } from './supabase'
import { getAuthToken } from './auth'

/**
 * BankID API Client
 *
 * OBS: BankID-integration kräver en backend-server med FP-certifikat.
 *
 * För att implementera BankID behöver du:
 * 1. Teckna avtal med BankID eller en återförsäljare
 * 2. Skaffa FP-certifikat
 * 3. Skapa en backend-server som hanterar BankID-autentisering
 * 4. Uppdatera API_BASE_URL till din backend
 */

const API_BASE_URL =
  import.meta.env.VITE_BANKID_API_URL || 'http://localhost:3001/api/v1/bankid'

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 1000

/** BankID API-fel (bas) */
export class BankIDError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'BankIDError'
    Object.setPrototypeOf(this, BankIDError.prototype)
  }
}

/** Nätverksfel (transient – kan försöka igen) */
export class BankIDNetworkError extends BankIDError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR')
    this.name = 'BankIDNetworkError'
  }
}

/** Timeout */
export class BankIDTimeoutError extends BankIDError {
  constructor(message: string) {
    super(message, 'TIMEOUT')
    this.name = 'BankIDTimeoutError'
  }
}

function isTransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : ''
  if (err instanceof TypeError && /fetch|network/i.test(msg)) return true
  if (/CONNECTION_REFUSED|Failed to fetch|NetworkError/i.test(msg)) return true
  return false
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, init)
    } catch (err) {
      lastError = err
      if (attempt < retries && isTransientError(err)) {
        await delay(RETRY_DELAY_MS)
        continue
      }
      throw err instanceof Error
        ? new BankIDNetworkError(err.message || 'Nätverksfel')
        : new BankIDNetworkError('Nätverksfel')
    }
  }
  throw lastError instanceof Error
    ? new BankIDNetworkError((lastError as Error).message || 'Nätverksfel')
    : new BankIDNetworkError('Nätverksfel')
}

export interface BankIDStatus {
  linked: boolean
  verified?: boolean
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
    // Use default IP on fetch failure
  }
  
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/auth`, {
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

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
      console.error('❌ Auth error:', error)
      throw new Error(error.message || 'Kunde inte initiera BankID-autentisering')
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (isTransientError(error)) {
      throw new BankIDNetworkError('Backend-servern körs inte. Kontrollera att backend-servern är startad på port 3001.')
    }
    if (error instanceof BankIDError) throw error
    throw new BankIDError(error instanceof Error ? error.message : 'Kunde inte initiera BankID-autentisering')
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
 * Avbryt pågående BankID-order (t.ex. när användaren trycker Avbryt eller vid timeout)
 */
export async function cancelBankIDAuth(orderRef: string): Promise<void> {
  try {
    await fetchWithRetry(`${API_BASE_URL}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderRef }),
    })
  } catch {
    // Ignorera – ordern kan redan vara slutförd eller ogiltig
  }
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
  userId?: string
}): Promise<{ success: boolean; message?: string }> {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    } as Record<string, string>,
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
export async function checkBankIDStatus(signal?: AbortSignal): Promise<BankIDStatus> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const token = await getAuthToken()
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetchWithRetry(`${API_BASE_URL}/user-status`, {
      method: 'GET',
      headers,
      credentials: 'include',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404 || response.status === 500) {
        return { linked: false }
      }
      throw new BankIDError('Kunde inte kontrollera BankID-status', undefined, response.status)
    }

    return response.json()
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new BankIDTimeoutError('Timeout vid kontroll av BankID-status')
    }
    if (err instanceof BankIDError) throw err
    if (isTransientError(err)) {
      throw new BankIDNetworkError(err instanceof Error ? err.message : 'Nätverksfel vid BankID-status')
    }
    throw err
  }
}

/**
 * Ta bort BankID-koppling
 */
export async function unlinkBankID(): Promise<{ success: boolean }> {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(`${API_BASE_URL}/unlink`, {
    method: 'POST',
    headers: { ...authHeaders } as Record<string, string>,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ett fel uppstod' }))
    throw new Error(error.message || 'Kunde inte ta bort BankID-koppling')
  }

  return response.json()
}

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

