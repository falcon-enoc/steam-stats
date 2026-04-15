'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

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

export function SteamAuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoSteamId, setDemoSteamId] = useState<string | null>(null)

  // La API key vive solo en memoria — nunca en localStorage/sessionStorage.
  // localStorage es accesible por cualquier script JS en la página (XSS = key robada).

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    setIsDemoMode(false)
    setDemoSteamId(null)
  }, [])

  const clearApiKey = useCallback(() => {
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
