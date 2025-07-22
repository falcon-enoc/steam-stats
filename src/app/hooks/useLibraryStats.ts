// src/hooks/useLibraryStats.ts
import { useMemo } from 'react'
import type { OwnedGame } from '../types/steam'

export interface LibraryStatistics {
  totalGames: number
  totalPlaytime: number // en minutos
  totalLibraryValue: number // en céntimos
  gamesWithPrice: number
  gamesWithPlaytime: number
  gamesWithPriceAndPlaytime: number
  hoursPerDollar: number
  averageGamePrice: number
  freeGames: number
  freeGamesPlaytime: number // tiempo total en juegos gratuitos
  currency: string
}

/**
 * Hook para calcular estadísticas de la biblioteca de juegos
 */
export function useLibraryStats(games: OwnedGame[] | null): LibraryStatistics | null {
  return useMemo(() => {
    if (!games || games.length === 0) return null

    let totalPlaytime = 0
    let totalLibraryValue = 0
    let gamesWithPrice = 0
    let gamesWithPlaytime = 0
    let gamesWithPriceAndPlaytime = 0
    let freeGames = 0
    let freeGamesPlaytime = 0
    let currency = 'USD'

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
        totalLibraryValue += game.price_overview!.final
        currency = game.price_overview!.currency
        
        if (hasPlaytime) {
          gamesWithPriceAndPlaytime++
        }
      }
    })

    const hoursPerDollar = totalLibraryValue > 0 
      ? (totalPlaytime / 60) / (totalLibraryValue / 100) 
      : 0

    return {
      totalGames: games.length,
      totalPlaytime,
      totalLibraryValue,
      gamesWithPrice,
      gamesWithPlaytime,
      gamesWithPriceAndPlaytime,
      hoursPerDollar,
      averageGamePrice: gamesWithPrice > 0 ? totalLibraryValue / gamesWithPrice : 0,
      freeGames,
      freeGamesPlaytime,
      currency,
    }
  }, [games])
}
