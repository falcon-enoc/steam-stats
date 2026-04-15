// src/hooks/useSteamSearch.ts
'use client'
import { useCallback } from 'react'
import { isSteamID64, extractSteamID, normalizeVanityURL } from '@/utils/steamUtils'
import useSWRMutation from 'swr/mutation'
import { useSteamAuth } from '../context/SteamAuthContext'

export function useSteamSearch() {
  const { apiKey, isDemoMode } = useSteamAuth()

  const resolveVanity = useCallback(
    async (_: string, { arg: vanityUrl }: { arg: string }) => {
      const headers: Record<string, string> = {}
      if (apiKey) headers['X-Steam-Api-Key'] = apiKey
      else if (isDemoMode) headers['X-Demo'] = 'true'

      const res = await fetch(
        `/api/resolveVanityURL?vanityurl=${encodeURIComponent(vanityUrl)}`,
        { headers }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'No se pudo resolver vanity URL')
      return json.steamid as string
    },
    [apiKey, isDemoMode]
  )

  const { trigger, isMutating, error } = useSWRMutation('/api/resolveVanityURL', resolveVanity)

  const searchProfile = async (input: string): Promise<string> => {
    const raw = input.trim()
    if (isSteamID64(raw)) return raw

    const extracted = extractSteamID(raw)
    if (extracted) return extracted

    const normalized = normalizeVanityURL(input)
    return await trigger(normalized)
  }

  return {
    searchProfile,
    isLoading: isMutating,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}
