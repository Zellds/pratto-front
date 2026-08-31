import { createContext, useContext, useState, type ReactNode } from 'react'

type AuthContextValue = {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

const STORAGE_KEY = 'pratto-token'

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(readStoredToken)

  function setToken(newToken: string) {
    try {
      localStorage.setItem(STORAGE_KEY, newToken)
    } catch {
      // localStorage unavailable (e.g. blocked storage) — token still works in-memory
    }
    setTokenState(newToken)
  }

  function clearToken() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable (e.g. blocked storage) — token still works in-memory
    }
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook live together intentionally
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
