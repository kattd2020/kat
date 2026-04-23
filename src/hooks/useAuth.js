import { useState, useCallback, useEffect } from 'react'

const API = '/api/auth'
const TOKEN_KEY = 'plateful365_token'

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function useAuth() {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(!!getStoredToken())

  // On mount, validate stored token and load user
  useEffect(() => {
    const t = getStoredToken()
    if (!t) { setLoading(false); return }
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setUser(u); else { localStorage.removeItem(TOKEN_KEY); setToken(null) } })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback((t, u) => {
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
  }, [])

  const signup = useCallback(async (email, password) => {
    const r = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Signup failed')
    persist(data.token, data.user)
    return data.user
  }, [persist])

  const login = useCallback(async (email, password) => {
    const r = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Login failed')
    persist(data.token, data.user)
    return data.user
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback(async (patch) => {
    const t = getStoredToken()
    if (!t) return
    const r = await fetch(`${API}/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify(patch),
    })
    if (r.ok) {
      const updated = await r.json()
      setUser(updated)
      return updated
    }
  }, [])

  return { user, token, loading, signup, login, logout, updateUser, isLoggedIn: !!user }
}
