// servises/SteamServise.ts
import { STEAM_KEY } from '../config';        // cargado desde process.env en build
import type { PlayerSummariesResponse } from '../types/steam';
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
