import { createContext, useContext, useState, type ReactNode } from 'react'

type AuthContextValue = {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

const STORAGE_KEY = 'pratto-token'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  function setToken(newToken: string) {
    localStorage.setItem(STORAGE_KEY, newToken)
    setTokenState(newToken)
  }

  function clearToken() {
    localStorage.removeItem(STORAGE_KEY)
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
