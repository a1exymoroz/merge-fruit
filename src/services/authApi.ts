import { AUTH_API_URL } from '../config/api'

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresInMs: number
  email: string
  displayName: string
  role: string
}

interface ErrorResponse {
  message?: string
  error?: string
}

async function parseAuthResponse(response: Response): Promise<AuthResponse> {
  if (!response.ok) {
    let message = 'Authentication failed'
    try {
      const error = (await response.json()) as ErrorResponse
      message = error.message || error.error || message
    } catch {
      // Use default message when response body is not JSON.
    }
    throw new Error(message)
  }

  return response.json() as Promise<AuthResponse>
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  })

  return parseAuthResponse(response)
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return parseAuthResponse(response)
}
