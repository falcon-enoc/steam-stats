'use client'
import { useCallback } from 'react'
import { useSteamAuth } from '../context/SteamAuthContext'
import fetcher from '../lib/fetcher'

/**
 * Retorna un fetcher compatible con SWR que inyecta
 * el header de autenticación correcto según el estado actual:
 *  - X-Steam-Api-Key  si el usuario tiene su propia key
 *  - X-Demo: true     si está en modo demo
 */
export function useAuthFetcher() {
  const { apiKey, isDemoMode } = useSteamAuth()

  return useCallback((url: string): Promise<any> => {
    const headers: Record<string, string> = {}
    if (apiKey) {
      headers['X-Steam-Api-Key'] = apiKey
    } else if (isDemoMode) {
      headers['X-Demo'] = 'true'
    }
    return fetcher(url, { headers })
  }, [apiKey, isDemoMode])
}
