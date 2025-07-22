// services/steamStoreService.ts
import type { AppDetailsResponse } from '../types/steam'

const STEAM_STORE_API_BASE = 'https://store.steampowered.com/api'

/**
 * Obtiene detalles de aplicaciones (incluyendo precios) usando la Steam Store API
 * IMPORTANTE: Hace consultas individuales para mayor estabilidad
 */
export async function getAppDetails(appids: string[]): Promise<AppDetailsResponse> {
  if (appids.length === 0) {
    return {}
  }

  // Filtrar appids inválidos (deben ser números)
  const validAppids = appids.filter(id => {
    const num = parseInt(id)
    return !isNaN(num) && num > 0 && num < 999999999
  })

  if (validAppids.length === 0) {
    return {}
  }

  console.log(`🔍 Fetching Steam Store API for ${validAppids.length} apps individually`)

  const results: AppDetailsResponse = {}

  // Hacer consultas individuales con Promise.allSettled para evitar que un error pare todo
  const promises = validAppids.map(async (appid) => {
    const url = `${STEAM_STORE_API_BASE}/appdetails?appids=${appid}&filters=price_overview,basic`
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SteamStatsApp/1.0',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data && data[appid]) {
        const appData = data[appid]
        if (appData.success && appData.data) {
          results[appid] = {
            success: true,
            data: {
              ...appData.data,
              // Asegurar que is_free esté presente
              is_free: appData.data.is_free || false,
              // Si es gratuito pero no tiene price_overview, creamos uno
              price_overview: appData.data.price_overview || (appData.data.is_free ? {
                currency: "CLP", // Usar moneda local por defecto
                initial: 0,
                final: 0,
                discount_percent: 0,
                initial_formatted: "",
                final_formatted: "Gratis"
              } : null)
            }
          }
        } else {
          results[appid] = {
            success: false,
            error: 'Juego no encontrado o no disponible'
          }
        }
      } else {
        results[appid] = {
          success: false,
          error: 'No se encontraron datos para este juego'
        }
      }

    } catch (error) {
      console.warn(`⚠️  Error fetching appid ${appid}:`, error)
      results[appid] = {
        success: false,
        error: `Error al obtener datos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }
    }
  })

  // Esperar a que todas las consultas se completen
  await Promise.allSettled(promises)

  console.log(`✅ Steam Store API: ${Object.keys(results).length}/${validAppids.length} apps processed`)
  return results
}