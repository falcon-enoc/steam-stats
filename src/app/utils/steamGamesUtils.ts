// src/utils/steamGameUtils.ts
import type { OwnedGame } from '@/types/steam'

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
      case 'name': {
        const nameA = a.name || `Juego ${a.appid}`
        const nameB = b.name || `Juego ${b.appid}`
        comparison = nameA.localeCompare(nameB)
        break
      }
      case 'lastPlayed': {
        const lastPlayedA = a.rtime_last_played || 0
        const lastPlayedB = b.rtime_last_played || 0
        comparison = lastPlayedA - lastPlayedB
        break
      }
      default:
        return 0
    }

    return order === 'asc' ? comparison : -comparison
  })

  return sorted
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
    const fallbacks: Record<ImageType, ImageType[]> = {
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
