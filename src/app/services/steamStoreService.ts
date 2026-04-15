// services/steamStoreService.ts
import type { AppDetailsResponse } from '../types/steam'
import { getCachedAppDetails, setCachedAppDetails, getUncachedAppIds } from '../lib/db'

const STEAM_STORE_API_BASE = 'https://store.steampowered.com/api'
const CACHE_TTL_MS = 86400000 // 24 hours
const STORE_CC = process.env.STEAM_STORE_CC ?? 'cl' // country code para precios

/**
 * Obtiene detalles de aplicaciones (incluyendo precios) usando la Steam Store API
 * IMPORTANTE: Hace consultas individuales para mayor estabilidad
 * Usa cache SQLite para evitar consultas repetidas
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

  const numericAppids = validAppids.map(id => parseInt(id))

  // Check cache first
  const cachedResults = getCachedAppDetails(numericAppids, CACHE_TTL_MS)
  const uncachedIds = getUncachedAppIds(numericAppids, CACHE_TTL_MS)

  const cacheHits = numericAppids.length - uncachedIds.length
  console.log(`Cache: ${cacheHits}/${numericAppids.length} hits`)

  // Start with cached results
  const results: AppDetailsResponse = { ...cachedResults }

  // If everything was cached, return early
  if (uncachedIds.length === 0) {
    console.log(`✅ All ${numericAppids.length} apps served from cache`)
    return results
  }

  const uncachedAppids = uncachedIds.map(id => String(id))

  console.log(`🔍 Fetching Steam Store API for ${uncachedAppids.length} apps individually`)

  // Hacer consultas individuales con Promise.allSettled para evitar que un error pare todo
  const promises = uncachedAppids.map(async (appid) => {
    const url = `${STEAM_STORE_API_BASE}/appdetails?appids=${appid}&filters=price_overview,basic&cc=${STORE_CC}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SteamStatsApp/1.0',
          'Accept': 'application/json'
        }
      })

      // 403: juego no disponible (region-locked, removido, restriccion de edad)
      // Cacheamos para no repetir la request en cada visita
      if (response.status === 403) {
        console.warn(`🚫 appid ${appid}: 403 Forbidden (no disponible en esta region o removido)`)
        const unavailableData = {
          steam_appid: parseInt(appid),
          name: `App ${appid}`,
          type: 'unavailable',
          is_free: false,
        }
        results[appid] = {
          success: false,
          error: 'Juego no disponible (region-locked o removido de la tienda)'
        }
        // Cachear como no disponible para evitar requests repetidas
        setCachedAppDetails(parseInt(appid), unavailableData)
        return
      }

      // 429: rate limiting — NO cachear, reintentar en la proxima visita
      if (response.status === 429) {
        console.warn(`⏳ appid ${appid}: 429 Too Many Requests (rate limited)`)
        results[appid] = {
          success: false,
          error: 'Rate limited por Steam — se reintentará en la próxima carga'
        }
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data && data[appid]) {
        const appData = data[appid]
        if (appData.success && appData.data) {
          const gameData = {
            ...appData.data,
            is_free: appData.data.is_free || false,
            price_overview: appData.data.price_overview || (appData.data.is_free ? {
              currency: "CLP",
              initial: 0,
              final: 0,
              discount_percent: 0,
              initial_formatted: "",
              final_formatted: "Gratis"
            } : null)
          }
          results[appid] = {
            success: true,
            data: gameData
          }
          setCachedAppDetails(parseInt(appid), gameData)
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

  console.log(`✅ Steam Store API: ${Object.keys(results).length}/${validAppids.length} apps processed (${cacheHits} cached, ${uncachedAppids.length} fetched)`)
  return results
}