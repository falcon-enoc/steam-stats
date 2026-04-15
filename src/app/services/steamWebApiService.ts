// services/steamWebApiService.ts
import type { PlayerSummariesResponse, OwnedGamesResponse } from '../types/steam'
import fetcher from '../lib/fetcher'

const STEAM_WEB_API_BASE = 'https://api.steampowered.com'

export async function getPlayerSummaries(steamIds: string[], apiKey: string) {
  const url = `${STEAM_WEB_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamIds.join(',')}`
  const data = await fetcher<PlayerSummariesResponse>(url)
  return data.response.players
}

export async function ResolveVanityURL(vanityUrl: string, apiKey: string) {
  const url = `${STEAM_WEB_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${vanityUrl}`
  try {
    const data = await fetcher<{ response: { steamid?: string; success: number; message?: string } }>(url)
    if (data.response.success !== 1) {
      throw new Error(`Usuario no encontrado: ${vanityUrl}. Verifica que el nombre de usuario sea correcto.`)
    }
    if (!data.response.steamid) {
      throw new Error('La respuesta de Steam no contiene un SteamID válido')
    }
    return data.response.steamid
  } catch (error) {
    if (error instanceof Error && error.message.includes('Usuario no encontrado')) throw error
    throw new Error(`Error al resolver vanity URL "${vanityUrl}": ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

export async function getOwnedGames(steamId: string, apiKey: string): Promise<OwnedGamesResponse['response']['games']> {
  const url = `${STEAM_WEB_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
  const data = await fetcher<OwnedGamesResponse>(url)
  return data.response.games
}
