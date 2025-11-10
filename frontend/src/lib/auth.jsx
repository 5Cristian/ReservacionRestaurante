// src/lib/auth.js
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // hidratar del localStorage al arrancar
  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) setToken(t)
    if (u) setUser(JSON.parse(u))
    setLoading(false)
  }, [])

  const login = (newToken, newUser) => {
    if (!newToken) return
    localStorage.setItem('token', newToken)
    setToken(newToken)
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  const value = useMemo(() => ({
    isAuth: Boolean(token),
    user, token, loading,
    setUser, setToken,
    login, logout,
  }), [token, user, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
