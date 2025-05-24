//hooks/useSteamPlayer.ts
import useSWR from 'swr';
import type { Player } from '../types/steam';
import fetcher from '../lib/fetcher';

export function useSteamPlayer(steamId: string | null) {
  const { data, error } = useSWR<{ players: Player[] }>(
    () => steamId && `/api/getPlayerSummaries?steamids=${steamId}`,
    fetcher
  );

  return {
    player: data?.players[0] as Player | undefined,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useReolveVanityURL(vanityUrl: string) {
  const { data, error } = useSWR<string>(
    () => vanityUrl && `/api/resolveVanityURL?vanityurl=${vanityUrl}`,
    fetcher
  );
  return {
    steamId: data,
    isError: error,
  }
}