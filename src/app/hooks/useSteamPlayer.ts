// src/hooks/useSteamPlayer.ts
import useSWR from 'swr'
import type { Player } from '../types/steam'

export function useSteamPlayer(steamId: string | null) {
  const { data, error } = useSWR<{ players: Player[] }>(
    steamId ? `/api/getPlayerSummaries?steamids=${steamId}` : null,
    (url: string) => fetch(url).then(res => res.json())
  )

  return {
    player: data?.players[0] ?? null,
    isLoading: !error && !data,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}

export function useResolveVanityURL(vanityUrl: string | null) {
  const { data, error } = useSWR<string>(
    vanityUrl ? `/api/resolveVanityURL?vanityurl=${encodeURIComponent(vanityUrl)}` : null,
    (url: string) => fetch(url).then(res => res.json())
  )

  return {
    steamId: data ?? null,
    isLoading: !error && !data,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}
