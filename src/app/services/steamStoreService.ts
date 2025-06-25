// services/steamStoreService.ts
import type { AppDetailsResponse } from '../types/steam'
import fetcher from '../lib/fetcher'

const STEAM_STORE_API_BASE = 'https://store.steampowered.com/api'

/**
 * Obtiene detalles de aplicaciones (incluyendo precios) usando la Steam Store API
 */
export async function getAppDetails(appids: string[]): Promise<AppDetailsResponse> {
  // Steam API permite hasta 50 appids por solicitud
  if (appids.length > 50) {
    throw new Error('Máximo 50 appids por solicitud')
  }

  // La API de Steam Store no requiere API key
  const url = `${STEAM_STORE_API_BASE}/appdetails?appids=${appids.join(',')}&cc=US&l=english`
  
  try {
    // Usar el fetcher personalizado con caché y retry automático
    const steamData = await fetcher<AppDetailsResponse>(
      url, 
      {
        headers: {
          'User-Agent': 'SteamStatsApp/1.0'
        }
      },
      60_000 // TTL de 1 minuto para datos de precios (cambian con frecuencia)
    )

    // Validar y limpiar la respuesta
    const cleanedData: AppDetailsResponse = {}
    
    for (const appid of appids) {
      const appData = steamData[appid]
      if (appData) {
        cleanedData[appid] = {
          success: appData.success,
          data: appData.success ? appData.data : undefined,
          error: !appData.success ? 'Juego no encontrado o no disponible' : undefined
        }
      } else {
        // Si Steam no devolvió datos para este appid
        cleanedData[appid] = {
          success: false,
          error: 'No se encontraron datos para este juego'
        }
      }
    }

    return cleanedData
    
  } catch (error) {
    throw new Error(`Error fetching Steam app details: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}