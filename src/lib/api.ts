import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public traceId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiErrorBody {
  error?: { message?: string; code?: string; traceId?: string }
  message?: string
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: ApiErrorBody = {}
    try {
      errorData = (await response.json()) as ApiErrorBody
    } catch {
      /* ignore parse error */
    }
    const message = errorData?.error?.message || errorData?.message || `HTTP ${response.status}`
    throw new ApiError(message, response.status, errorData?.error?.code, errorData?.error?.traceId)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}
