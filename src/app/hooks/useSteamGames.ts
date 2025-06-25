// src/hooks/useSteamGames.ts
import useSWR from 'swr'
import type { OwnedGame } from '@/types/steam'

interface UseSteamGames {
  games: OwnedGame[] | null
  isLoading: boolean
  error: string | null
}


/**
 * Hook para obtener los juegos poseídos de un usuario de Steam
 */
export function useSteamGames(steamId: string | null): UseSteamGames {
  const endpoint = steamId ? `/api/getOwnedGames?steamid=${steamId}` : null

  const { data, error, isValidating } = useSWR<{ games: OwnedGame[] }>(
    endpoint,
    (url: string) => fetch(url).then(res => res.json())
  )

  return {
    games: data?.games ?? null,
    isLoading: !error && isValidating,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}
