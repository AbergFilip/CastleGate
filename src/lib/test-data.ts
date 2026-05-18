import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export type ClearAllTestDataResult = {
  ok: boolean
  totalRows: number
  byTable: Record<string, number>
}

/**
 * Rensar synkad testdata för inloggad användare (backend måste ha ENABLE_TEST_DATA_TOOLS=true).
 */
export async function clearAllTestData(): Promise<ClearAllTestDataResult> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Ingen autentisering')
  }
  const response = await fetch(`${API_URL}/test-data/clear-all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (response.status === 404) {
    throw new Error('Testfunktionen är inte aktiverad på servern (ENABLE_TEST_DATA_TOOLS).')
  }
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || 'Kunde inte rensa data')
  }
  return response.json()
}

export function isTestDataToolsEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_TEST_DATA_TOOLS === 'true'
}
