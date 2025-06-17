// src/components/SteamOwnedGames.tsx
'use client'
import { useState } from 'react'
import { useSteamGames } from '@/hooks/useSteamGames'
import { motion } from 'framer-motion'

interface Props {
  steamId: string
}

/**
 * Construye diferentes tipos de URLs de imágenes de Steam
 */
function buildGameImageUrls(appid: number, iconHash?: string, logoHash?: string) {
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

export default function SteamOwnedGames({ steamId }: Props) {
  const { games, isLoading, error } = useSteamGames(steamId)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageType, setImageType] = useState<'header' | 'capsule' | 'logo' | 'icon'>('header')

  const handleImageError = (imageKey: string) => {
    setImageErrors(prev => new Set(prev).add(imageKey))
  }

  if (isLoading) return <p>Cargando juegos…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!games || games.length === 0) return <p>No se encontraron juegos.</p>

  return (
    <div>
      {/* Selector de tipo de imagen */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Tipo de imagen:</span>
        {[
          { key: 'header', label: 'Headers' },
          { key: 'capsule', label: 'Capsules' },
          { key: 'logo', label: 'Logos' },
          { key: 'icon', label: 'Iconos' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setImageType(key as any)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              imageType === key 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.ul
        key={imageType} // Re-animar cuando cambie el tipo
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {games.map(game => {
          const imageUrls = buildGameImageUrls(game.appid, game.img_icon_url, game.img_logo_url)
          
          // Estrategia de fallback inteligente
          const getImageWithFallback = () => {
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

          const imageData = getImageWithFallback()
          
          return (
            <motion.li 
              key={game.appid} 
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Imagen del juego */}
              <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {imageData?.url ? (
                  <img
                    src={imageData.url}
                    alt={game.name || 'Juego'}
                    className={`${
                      imageData.type === 'icon' 
                        ? 'w-12 h-12 object-cover rounded' 
                        : 'w-full h-full object-cover'
                    }`}
                    onError={() => handleImageError(imageData.key)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-lg text-gray-600 font-mono block">
                        {game.name?.slice(0, 2).toUpperCase() || 'NG'}
                      </span>
                      <span className="text-xs text-gray-500">
                        No image
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Badge del tipo de imagen */}
                {imageData && (
                  <span className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                    {imageData.type}
                  </span>
                )}
              </div>

              {/* Información del juego */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2" title={game.name || 'Juego sin nombre'}>
                  {game.name || `Juego ${game.appid}`}
                </h3>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tiempo total:</span> {Math.floor(game.playtime_forever / 60)}h {game.playtime_forever % 60}min
                  </p>
                  
                  {game.rtime_last_played && (
                    <p className="text-xs text-gray-500">
                      Última vez: {new Date(game.rtime_last_played * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
