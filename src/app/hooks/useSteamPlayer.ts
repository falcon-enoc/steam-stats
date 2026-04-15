// src/hooks/useSteamPlayer.ts
import useSWR from 'swr'
import type { Player } from '../types/steam'
import { useAuthFetcher } from './useAuthFetcher'

export function useSteamPlayer(steamId: string | null) {
  const authFetcher = useAuthFetcher()
  const { data, error } = useSWR<{ players: Player[] }>(
    steamId ? `/api/getPlayerSummaries?steamids=${steamId}` : null,
    authFetcher
  )
  return {
    player: data?.players[0] ?? null,
    isLoading: !error && !data,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}

export function useResolveVanityURL(vanityUrl: string | null) {
  const authFetcher = useAuthFetcher()
  const { data, error } = useSWR<string>(
    vanityUrl ? `/api/resolveVanityURL?vanityurl=${encodeURIComponent(vanityUrl)}` : null,
    authFetcher
  )
  return {
    steamId: data ?? null,
    isLoading: !error && !data,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}
