// src/hooks/useLibraryStats.ts
import { useMemo } from 'react'
import useSWR from 'swr'
import type { OwnedGame } from '../types/steam'

interface HistoricalPriceSummary {
  appid: number
  initial_price: number
  final_price: number
  lowest_price: number
  lowest_date: number
  currency: string
}

export interface LibraryStatistics {
  totalGames: number
  totalPlaytime: number // en minutos
  totalLibraryValue: number // en céntimos — precio actual (con descuento si aplica)
  totalFullValue: number // en céntimos — precio base sin descuento
  totalLowestValue: number // en céntimos — precio histórico más bajo
  gamesWithPrice: number
  gamesWithPlaytime: number
  gamesWithPriceAndPlaytime: number
  hoursPerDollar: number
  costPerHour: number // costo por hora en unidades de moneda
  averageGamePrice: number
  freeGames: number
  freeGamesPlaytime: number
  currency: string
  hasHistoricalData: boolean
}

/**
 * Hook para obtener precios históricos desde la API
 * Hace múltiples requests si hay más de 50 appids (límite del endpoint)
 */
function useHistoricalPrices(appids: number[] | null) {
  // Crear una key estable para SWR basada en los appids ordenados
  const stableKey = useMemo(() => {
    if (!appids || appids.length === 0) return null
    return `price-history:${[...appids].sort().join(',')}`
  }, [appids])

  const { data } = useSWR<Record<string, HistoricalPriceSummary>>(
    stableKey,
    async () => {
      if (!appids || appids.length === 0) return {}
      const batchSize = 50
      const result: Record<string, HistoricalPriceSummary> = {}

      for (let i = 0; i < appids.length; i += batchSize) {
        const batch = appids.slice(i, i + batchSize)
        const res = await fetch(`/api/getPriceHistory?appids=${batch.join(',')}`)
        if (res.ok) {
          const batchData = await res.json()
          Object.assign(result, batchData)
        }
      }
      return result
    },
  )

  return data ?? null
}

/**
 * Hook para calcular estadísticas de la biblioteca de juegos
 * Incluye 3 valoraciones: precio base, precio actual, precio histórico mínimo
 */
export function useLibraryStats(games: OwnedGame[] | null, pricesReady = false): LibraryStatistics | null {
  const appids = useMemo(() => {
    if (!games) return null
    return games
      .filter(g => g.price_overview && !g.is_free)
      .map(g => g.appid)
  }, [games])

  // Solo consultar precios históricos cuando los precios actuales ya se guardaron en la DB
  const historicalPrices = useHistoricalPrices(pricesReady ? appids : null)

  return useMemo(() => {
    if (!games || games.length === 0) return null

    let totalPlaytime = 0
    let totalLibraryValue = 0
    let totalFullValue = 0
    let totalLowestValue = 0
    let gamesWithPrice = 0
    let gamesWithPlaytime = 0
    let gamesWithPriceAndPlaytime = 0
    let freeGames = 0
    let freeGamesPlaytime = 0
    let currency = 'USD'
    let hasHistoricalData = false

    games.forEach(game => {
      const hasPlaytime = game.playtime_forever > 0
      const hasPrice = game.price_overview && !game.is_free
      const isFree = game.is_free || game.price_overview?.final === 0

      if (hasPlaytime) {
        totalPlaytime += game.playtime_forever
        gamesWithPlaytime++
      }

      if (isFree) {
        freeGames++
        if (hasPlaytime) {
          freeGamesPlaytime += game.playtime_forever
        }
      } else if (hasPrice) {
        gamesWithPrice++
        const currentPrice = game.price_overview!.final
        const fullPrice = game.price_overview!.initial
        currency = game.price_overview!.currency

        totalLibraryValue += currentPrice
        totalFullValue += fullPrice

        // Precio histórico mínimo: usar el dato de la DB si existe, sino usar el precio actual
        const historical = historicalPrices?.[String(game.appid)]
        if (historical) {
          totalLowestValue += historical.lowest_price
          hasHistoricalData = true
        } else {
          totalLowestValue += currentPrice
        }

        if (hasPlaytime) {
          gamesWithPriceAndPlaytime++
        }
      }
    })

    const totalHours = totalPlaytime / 60
    const totalValueUnits = totalLibraryValue / 100 // precio en unidades de moneda

    const hoursPerUnit = totalValueUnits > 0 ? totalHours / totalValueUnits : 0
    const costPerHour = totalHours > 0 ? totalValueUnits / totalHours : 0

    return {
      totalGames: games.length,
      totalPlaytime,
      totalLibraryValue,
      totalFullValue,
      totalLowestValue,
      gamesWithPrice,
      gamesWithPlaytime,
      gamesWithPriceAndPlaytime,
      hoursPerDollar: hoursPerUnit,
      costPerHour,
      averageGamePrice: gamesWithPrice > 0 ? totalLibraryValue / gamesWithPrice : 0,
      freeGames,
      freeGamesPlaytime,
      currency,
      hasHistoricalData,
    }
  }, [games, historicalPrices])
}
