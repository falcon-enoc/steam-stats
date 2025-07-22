// src/hooks/useSteamGames.ts
import useSWR from 'swr'
import { useEffect, useState, useMemo } from 'react'
import type { OwnedGame } from '@/types/steam'
import { useSteamAppDetails } from './useSteamAppDetails'
import fetcher from '../lib/fetcher'

interface UseSteamGames {
  games: OwnedGame[] | null
  isLoading: boolean
  error: string | null
  enrichedGames: OwnedGame[] | null
  pricesLoading: boolean
}

/**
 * Hook para obtener los juegos poseídos de un usuario de Steam con precios de la tienda
 */
export function useSteamGames(steamId: string | null): UseSteamGames {
  const endpoint = steamId ? `/api/getOwnedGames?steamid=${steamId}` : null
  const [enrichedGames, setEnrichedGames] = useState<OwnedGame[] | null>(null)

  const { data, error, isValidating } = useSWR<{ games: OwnedGame[] }>(
    endpoint,
    fetcher
  )

  // Memoizar los appids para evitar re-renders innecesarios
  const appids = useMemo(() => {
    return data?.games?.map(game => game.appid) ?? null
  }, [data?.games])
  
  // Obtener detalles de la tienda Steam
  const { appDetails, isLoading: pricesLoading, error: pricesError } = useSteamAppDetails(appids)

  // Combinar datos de juegos con precios cuando ambos estén disponibles
  useEffect(() => {
    if (!data?.games) {
      setEnrichedGames(null)
      return
    }

    if (!appDetails) {
      // Solo mostrar juegos sin precios si no está cargando
      if (!pricesLoading) {
        setEnrichedGames(data.games)
      }
      return
    }

    const gamesWithPrices = data.games.map(game => {
      const details = appDetails[game.appid.toString()]
      const gameDetails = details?.success ? details.data : undefined
      
      return {
        ...game,
        game_details: gameDetails,
        price_overview: gameDetails?.price_overview,
        is_free: gameDetails?.is_free ?? false,
      }
    })

    setEnrichedGames(gamesWithPrices)
  }, [data?.games, appDetails, pricesLoading])

  return {
    games: data?.games ?? null,
    isLoading: !error && isValidating,
    error: error instanceof Error ? error.message : error ? String(error) : pricesError,
    enrichedGames,
    pricesLoading,
  }
}
