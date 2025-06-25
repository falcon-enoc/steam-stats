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

// Tipos para ordenamiento
export type SortField = 'playtime' | 'name' | 'lastPlayed'
export type SortOrder = 'asc' | 'desc'
export type ImageType = 'header' | 'capsule' | 'logo' | 'icon'

/**
 * Ordena un array de juegos según el campo y orden especificados
 */
export function sortGames(games: OwnedGame[], field: SortField, order: SortOrder): OwnedGame[] {
  const sorted = [...games].sort((a, b) => {
    let comparison = 0
    
    switch (field) {
      case 'playtime':
        comparison = a.playtime_forever - b.playtime_forever
        break
      case 'name':
        const nameA = a.name || `Juego ${a.appid}`
        const nameB = b.name || `Juego ${b.appid}`
        comparison = nameA.localeCompare(nameB)
        break
      case 'lastPlayed':
        const lastPlayedA = a.rtime_last_played || 0
        const lastPlayedB = b.rtime_last_played || 0
        comparison = lastPlayedA - lastPlayedB
        break
      default:
        return 0
    }
    
    return order === 'asc' ? comparison : -comparison
  })
  
  return sorted
}

/**
 * Formatea el tiempo de juego de minutos a un string legible
 */
export function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (remainingHours > 0) {
    return `${days}d ${remainingHours}h`
  }
  
  return `${days}d`
}

/**
 * Formatea la fecha de última vez jugado
 */
export function formatLastPlayed(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `Hace ${years} año${years > 1 ? 's' : ''}`
  }
}

/**
 * Construye URLs de imágenes con fallbacks inteligentes
 */
export function buildGameImageUrls(appid: number, iconHash?: string, logoHash?: string) {
  return {
    header: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    capsule: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_231x87.jpg`,
    logo: logoHash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${logoHash}.jpg` : '',
    icon: iconHash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg` : ''
  }
}

/**
 * Obtiene la imagen con sistema de fallback
 */
export function getImageWithFallback(
  game: OwnedGame, 
  imageType: ImageType, 
  imageErrors: Set<string>
) {
  const imageUrls = buildGameImageUrls(game.appid, game.img_icon_url, game.img_logo_url)
  const imageKey = `${game.appid}-${imageType}`
  
  // Si la imagen principal falló, usar fallbacks
  if (imageErrors.has(imageKey)) {
    const fallbacks = {
      'header': ['capsule', 'logo', 'icon'],
      'capsule': ['header', 'logo', 'icon'], 
      'logo': ['header', 'capsule', 'icon'],
      'icon': ['logo', 'header', 'capsule']
    }
    
    for (const fallback of fallbacks[imageType]) {
      const fallbackKey = `${game.appid}-${fallback}`
      if (!imageErrors.has(fallbackKey) && imageUrls[fallback as keyof typeof imageUrls]) {
        return {
          url: imageUrls[fallback as keyof typeof imageUrls],
          type: fallback,
          key: fallbackKey
        }
      }
    }
    return null
  }
  
  return {
    url: imageUrls[imageType],
    type: imageType,
    key: imageKey
  }
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
