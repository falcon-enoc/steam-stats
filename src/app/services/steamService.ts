// servises/SteamServise.ts
import { STEAM_KEY } from '../config';        // cargado desde process.env en build
import type { PlayerSummariesResponse, OwnedGamesResponse} from '../types/steam';
import fetcher from '../lib/fetcher';
const BASE = 'https://api.steampowered.com';

export async function getPlayerSummaries(steamIds: string[]) {
  const url = `${BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_KEY}&steamids=${steamIds.join(',')}`;
  const data = await fetcher<PlayerSummariesResponse>(url);
  return data.response.players;
}

export async function ResolveVanityURL(vanityUrl: string) {
  const url = `${BASE}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_KEY}&vanityurl=${vanityUrl}`;
  const data = await fetcher<{ response: { steamid: string } }>(url);
  return data.response.steamid;
}

export async function getOwnedGames(steamId: string): Promise<OwnedGamesResponse['response']['games']> {
  const url = `${BASE}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
  const data = await fetcher<OwnedGamesResponse>(url)
  return data.response.games
}