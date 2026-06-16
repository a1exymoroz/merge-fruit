const STORAGE_KEY = 'mergeFruitAuth'

export interface StoredAuth {
  accessToken: string
  expiresAt: number
  email: string
  displayName: string
  role: string
}

export function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const auth = JSON.parse(raw) as StoredAuth
    if (!auth.accessToken || Date.now() >= auth.expiresAt) {
      clearStoredAuth()
      return null
    }

    return auth
  } catch {
    clearStoredAuth()
    return null
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthHeaders(): Record<string, string> {
  const auth = getStoredAuth()
  if (!auth) return {}

  return { Authorization: `Bearer ${auth.accessToken}` }
}
