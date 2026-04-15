// src/hooks/useSteamGames.ts
'use client'
import useSWR from 'swr'
import { useEffect, useState, useMemo } from 'react'
import type { OwnedGame } from '@/types/steam'
import { useSteamAppDetails } from './useSteamAppDetails'
import { useAuthFetcher } from './useAuthFetcher'

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
  const authFetcher = useAuthFetcher()

  const { data, error, isValidating } = useSWR<{ games: OwnedGame[] }>(
    endpoint,
    authFetcher
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

    // Si hay appids pendientes pero aún no tenemos appDetails,
    // esperar a que el fetch de precios termine
    if (!appDetails) {
      if (!appids || appids.length === 0) {
        // No hay juegos con precio que buscar
        setEnrichedGames(data.games)
      }
      // Si hay appids pero no appDetails, seguimos esperando
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
  }, [data?.games, appDetails, appids])

  return {
    games: data?.games ?? null,
    isLoading: !error && isValidating,
    error: error instanceof Error ? error.message : error ? String(error) : pricesError,
    enrichedGames,
    pricesLoading,
  }
}
