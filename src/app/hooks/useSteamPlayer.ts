//hooks/useSteamPlayer.ts
import useSWR from 'swr';
import type { Player } from '../types/steam';
import fetcher from '../lib/fetcher';

export function useSteamPlayer(steamId: string) {
  const { data, error } = useSWR<{ players: Player[] }>(
    () => steamId && `/api/steam/getPlayerSummaries?steamids=${steamId}`,
    fetcher
  );

  return {
    player: data?.players[0] as Player | undefined,
    isLoading: !error && !data,
    isError: error,
  };
}
