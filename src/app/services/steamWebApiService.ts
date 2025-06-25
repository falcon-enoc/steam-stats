// services/steamWebApiService.ts
import { STEAM_KEY } from '../config'
import type { PlayerSummariesResponse, OwnedGamesResponse } from '../types/steam'
import fetcher from '../lib/fetcher'

const STEAM_WEB_API_BASE = 'https://api.steampowered.com'

/**
 * Obtiene resúmenes de jugadores usando la Steam Web API
 */
export async function getPlayerSummaries(steamIds: string[]) {
  const url = `${STEAM_WEB_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_KEY}&steamids=${steamIds.join(',')}`
  const data = await fetcher<PlayerSummariesResponse>(url)
  return data.response.players
}

/**
 * Resuelve una URL vanity a SteamID usando la Steam Web API
 */
export async function ResolveVanityURL(vanityUrl: string) {
  const url = `${STEAM_WEB_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_KEY}&vanityurl=${vanityUrl}`
  
  try {
    const data = await fetcher<{ response: { steamid?: string; success: number; message?: string } }>(url)
    
    // Steam devuelve success: 1 si encuentra el usuario, 42 si no lo encuentra
    if (data.response.success !== 1) {
      throw new Error(`Usuario no encontrado: ${vanityUrl}. Verifica que el nombre de usuario sea correcto.`)
    }
    
    if (!data.response.steamid) {
      throw new Error('La respuesta de Steam no contiene un SteamID válido')
    }
    
    return data.response.steamid
  } catch (error) {
    if (error instanceof Error && error.message.includes('Usuario no encontrado')) {
      throw error
    }
    throw new Error(`Error al resolver vanity URL "${vanityUrl}": ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

/**
 * Obtiene los juegos que posee un usuario usando la Steam Web API
 */
export async function getOwnedGames(steamId: string): Promise<OwnedGamesResponse['response']['games']> {
  const url = `${STEAM_WEB_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
  const data = await fetcher<OwnedGamesResponse>(url)
  return data.response.games
}