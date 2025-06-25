// src/components/SteamOwnedGames.tsx
'use client'
import { useState } from 'react'
import { useSteamGames } from '@/hooks/useSteamGames'
import { motion } from 'framer-motion'
import { 
  sortGames, 
  getImageWithFallback,
  formatPlaytime,
  formatLastPlayed,
  type SortField, 
  type SortOrder,
  type ImageType 
} from '@/utils/steamGamesUtils'

interface Props {
  steamId: string
}

export default function SteamOwnedGames({ steamId }: Props) {
  const { games, isLoading, error } = useSteamGames(steamId)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageType, setImageType] = useState<ImageType>('header')
  const [sortField, setSortField] = useState<SortField>('playtime')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleImageError = (imageKey: string) => {
    setImageErrors(prev => new Set(prev).add(imageKey))
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Si es el mismo campo, cambiar el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Si es un campo diferente, establecer campo y orden por defecto
      setSortField(field)
      setSortOrder(field === 'playtime' ? 'desc' : 'asc') // Por tiempo: mayor a menor por defecto
    }
  }

  if (isLoading) return <p>Cargando juegos…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!games || games.length === 0) return <p>No se encontraron juegos.</p>

  return (
    <div>
      {/* Controles de ordenamiento */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('playtime')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              sortField === 'playtime'
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tiempo jugado
            {sortField === 'playtime' && (
              <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
          
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              sortField === 'name'
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nombre
            {sortField === 'name' && (
              <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
          
          <button
            onClick={() => handleSort('lastPlayed')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              sortField === 'lastPlayed'
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Última vez jugado
            {sortField === 'lastPlayed' && (
              <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        </div>
      </div>
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
        key={`${imageType}-${sortField}-${sortOrder}`} // Re-animar cuando cambie el tipo o ordenamiento
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {sortGames(games, sortField, sortOrder).map(game => {
          const imageData = getImageWithFallback(game, imageType, imageErrors)
          
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
                    <span className="font-medium">Tiempo total:</span> {formatPlaytime(game.playtime_forever)}
                  </p>
                  
                  {game.rtime_last_played && (
                    <p className="text-xs text-gray-500">
                      Última vez: {formatLastPlayed(game.rtime_last_played)}
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
