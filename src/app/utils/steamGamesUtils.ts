// src/utils/steamGameUtils.ts
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

/**
 * Tipos para ordenamiento de juegos
 */
export type SortField = 'playtime'
export type SortOrder = 'asc' | 'desc'

/**
 * Ordena una lista de juegos según el campo y orden especificados
 */
export function sortGames(
  games: OwnedGame[],
  sortField: SortField,
  sortOrder: SortOrder = 'desc'
): OwnedGame[] {
  return [...games].sort((a, b) => {
    // Solo ordenamiento por tiempo de juego
    const aValue = a.playtime_forever
    const bValue = b.playtime_forever

    return sortOrder === 'asc' 
      ? aValue - bValue
      : bValue - aValue
  })
}

/**
 * Filtra juegos que han sido jugados (tienen tiempo de juego > 0)
 */
export function getPlayedGames(games: OwnedGame[]): OwnedGame[] {
  return games.filter(game => game.playtime_forever > 0)
}

/**
 * Filtra juegos que nunca han sido jugados
 */
export function getUnplayedGames(games: OwnedGame[]): OwnedGame[] {
  return games.filter(game => game.playtime_forever === 0)
}

/**
 * Obtiene juegos jugados recientemente (en los últimos N días)
 */
export function getRecentlyPlayedGames(games: OwnedGame[], days: number = 30): OwnedGame[] {
  const cutoffDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60)
  return games.filter(game => 
    game.rtime_last_played && game.rtime_last_played > cutoffDate
  )
}

/**
 * Tipo para tipos de imagen
 */
export type ImageType = 'header' | 'capsule' | 'logo' | 'icon'

/**
 * Construye diferentes tipos de URLs de imágenes de Steam
 */
export function buildGameImageUrls(appid: number, iconHash?: string, logoHash?: string) {
  return {
    // Imágenes estáticas (no requieren hash)
    header: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    capsule: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_231x87.jpg`,
    library: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
    
    // Imágenes dinámicas (requieren hash de la API)
    logo: logoHash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${logoHash}.jpg` : '',
    icon: iconHash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg` : ''
  }
}

/**
 * Estrategia de fallback inteligente para imágenes
 */
export function getImageWithFallback(
  game: OwnedGame,
  imageType: ImageType,
  imageErrors: Set<string>
): { url: string; type: string; key: string } | null {
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
 * Formatea el tiempo de juego en un formato legible
 */
export function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Formatea la fecha de última vez jugado
 */
export function formatLastPlayed(timestamp?: number): string {
  if (!timestamp) return 'Nunca'
  return new Date(timestamp * 1000).toLocaleDateString()
}
