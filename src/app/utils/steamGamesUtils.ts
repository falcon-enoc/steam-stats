// src/utils/steamGameUtils.ts
import useSWR from 'swr'
import type { OwnedGame } from '@/types/steam'

/**
 * Suma el playtime (en minutos) de todos los juegos y lo convierte a horas.
 */
export function totalPlaytimeHours(games: OwnedGame[]): number {
  const totalMinutes = games.reduce((sum, g) => sum + g.playtime_forever, 0)
  return Math.round((totalMinutes / 60) * 100) / 100  // con 2 decimales
}

/**
 * Filtra sólo los N juegos con más tiempo de juego.
 */
export function topPlayedGames(games: OwnedGame[], topN: number): OwnedGame[] {
  return [...games]
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, topN)
}

/**
 * Agrupa juegos por rango de horas jugadas (ej: “0–10h”, “10–50h”, “50+h”).
 */
export function groupByPlaytimeBracket(
  games: OwnedGame[],
  brackets: { label: string; minHours: number; maxHours?: number }[]
): Record<string, OwnedGame[]> {
  const result: Record<string, OwnedGame[]> = {}
  for (const { label, minHours, maxHours } of brackets) {
    result[label] = games.filter((g) => {
      const h = g.playtime_forever / 60
      return h >= minHours && (maxHours == null || h < maxHours)
    })
  }
  return result
}

interface UseSteamGames {
  games: OwnedGame[] | null
  isLoading: boolean
  error: string | null
}

/**
 * Construye la URL de la imagen del juego desde Steam
 */
function buildGameImageUrl(appid: number, hash: string, type: 'icon' | 'logo'): string {
  if (!hash) return ''
  
  // URLs oficiales de Steam para imágenes de juegos
  const baseUrl = 'https://media.steampowered.com/steamcommunity/public/images/apps'
  
  if (type === 'icon') {
    return `${baseUrl}/${appid}/${hash}.jpg`
  } else {
    return `${baseUrl}/${appid}/${hash}.jpg`
  }
}

/**
 * Hook para obtener los juegos poseídos de un usuario de Steam
 * Utiliza SWR para cache y revalidación al consultar nuestra API interna
 */
export function useSteamGames(steamId: string | null): UseSteamGames {
  const endpoint = steamId ? `/api/getOwnedGames?steamid=${steamId}` : null

  const { data, error, isValidating } = useSWR<{ games: OwnedGame[] }>(
    endpoint,
    (url: string) => fetch(url).then(res => res.json())
  )

  // Procesar los juegos para agregar URLs de imágenes completas
  const processedGames = data?.games?.map(game => ({
    ...game,
    iconUrl: game.img_icon_url ? buildGameImageUrl(game.appid, game.img_icon_url, 'icon') : '',
    logoUrl: game.img_logo_url ? buildGameImageUrl(game.appid, game.img_logo_url, 'logo') : '',
  })) ?? null

  return {
    games: processedGames,
    isLoading: !error && isValidating,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  }
}
