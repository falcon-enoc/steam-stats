
import { STEAM_KEY } from '../config';        // cargado desde process.env en build
import type { PlayerSummariesResponse } from '../types/steam';

const BASE = 'https://api.steampowered.com';

export async function getPlayerSummaries(steamIds: string[]) {
  const url = `${BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_KEY}&steamids=${steamIds.join(',')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);
  const json: PlayerSummariesResponse = await res.json();
  return json.response.players;
}
