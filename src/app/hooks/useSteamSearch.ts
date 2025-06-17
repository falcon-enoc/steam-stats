// src/hooks/useSteamSearch.ts
import { isSteamID64, extractSteamID, normalizeVanityURL } from '@/utils/steamUtils'
import useSWRMutation from 'swr/mutation'

async function resolveVanity(_: string, { arg: vanityUrl }: { arg: string }) {
  const res = await fetch(`/api/resolveVanityURL?vanityurl=${encodeURIComponent(vanityUrl)}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'No se pudo resolver vanity URL')
  return json.steamid as string
}

export function useSteamSearch() {
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
