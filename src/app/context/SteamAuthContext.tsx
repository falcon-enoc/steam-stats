'use client'
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface SteamAuthState {
  apiKey: string | null
  isDemoMode: boolean
  demoSteamId: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  enableDemo: () => Promise<{ error?: string }>
  disableDemo: () => void
}

const SteamAuthContext = createContext<SteamAuthState | null>(null)

const LS_KEY = 'steam_api_key'

export function SteamAuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoSteamId, setDemoSteamId] = useState<string | null>(null)

  // Leer key de localStorage solo en cliente
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) setApiKeyState(stored)
  }, [])

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem(LS_KEY, key)
    setApiKeyState(key)
    setIsDemoMode(false)
    setDemoSteamId(null)
  }, [])

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setApiKeyState(null)
    setIsDemoMode(false)
    setDemoSteamId(null)
  }, [])

  const enableDemo = useCallback(async (): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/demo/init', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) return { error: body.error ?? 'Demo no disponible' }
      setIsDemoMode(true)
      setDemoSteamId(body.steamId)
      return {}
    } catch {
      return { error: 'Error al iniciar el demo' }
    }
  }, [])

  const disableDemo = useCallback(() => {
    setIsDemoMode(false)
    setDemoSteamId(null)
  }, [])

  return (
    <SteamAuthContext.Provider value={{
      apiKey, isDemoMode, demoSteamId,
      setApiKey, clearApiKey, enableDemo, disableDemo,
    }}>
      {children}
    </SteamAuthContext.Provider>
  )
}

export function useSteamAuth(): SteamAuthState {
  const ctx = useContext(SteamAuthContext)
  if (!ctx) throw new Error('useSteamAuth must be used inside SteamAuthProvider')
  return ctx
}
