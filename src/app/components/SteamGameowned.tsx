// src/components/SteamOwnedGames.tsx
'use client'
import { useState } from 'react'
import { useSteamGames } from '@/hooks/useSteamGames'
import { motion } from 'framer-motion'
import { formatPlaytime, formatLastPlayed, calculateHoursPerDollar } from '../utils/formatters'
import { 
  sortGames, 
  getImageWithFallback,
  type SortField, 
  type SortOrder,
  type ImageType 
} from '../utils/steamGamesUtils'

const GAMES_PER_PAGE = 24

interface Props {
  steamId: string
}

export default function SteamOwnedGames({ steamId }: Props) {
  const { enrichedGames, isLoading, error, pricesLoading } = useSteamGames(steamId)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageType, setImageType] = useState<ImageType>('header')
  const [sortField, setSortField] = useState<SortField>('playtime')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE)

  const handleImageError = (key: string) => {
    setImageErrors(prev => new Set(prev).add(key))
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(field === 'playtime' ? 'desc' : 'asc')
    }
    setVisibleCount(GAMES_PER_PAGE)
  }

  if (isLoading) return <p>Cargando juegos…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!enrichedGames || enrichedGames.length === 0) return <p>No se encontraron juegos.</p>

  return (
    <div>
      {/* Indicador de carga de precios */}
      {pricesLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Cargando precios de la tienda Steam...</span>
          </div>
        </div>
      )}
      
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
            onClick={() => { setImageType(key as ImageType); setVisibleCount(GAMES_PER_PAGE) }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {sortGames(enrichedGames, sortField, sortOrder).slice(0, visibleCount).map(game => {
          const imageData = getImageWithFallback(game, imageType, imageErrors)
          
          return (
            <motion.li
              key={game.appid}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              layout
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
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2" title={game.name || 'Juego sin nombre'}>
                    {game.name || `Juego ${game.appid}`}
                  </h3>
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                    ID: {game.appid}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tiempo total:</span> {formatPlaytime(game.playtime_forever)}
                  </p>
                  
                  {game.rtime_last_played && (
                    <p className="text-xs text-gray-500">
                      Última vez: {formatLastPlayed(game.rtime_last_played)}
                    </p>
                  )}
                  
                  {/* Información de precio */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    {pricesLoading ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : game.is_free ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-600 font-medium">💚 Gratis</span>
                          {game.playtime_forever > 0 && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              {formatPlaytime(game.playtime_forever)} jugadas
                            </span>
                          )}
                        </div>
                        
                        {/* Mostrar valor del tiempo invertido en juegos gratuitos */}
                        {game.playtime_forever > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Tiempo invertido:</span>
                            <span className="text-xs font-medium text-green-600">
                              {formatPlaytime(game.playtime_forever)} de diversión gratis
                            </span>
                          </div>
                        )}
                      </div>
                    ) : game.price_overview ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Precio:</span>
                          <div className="text-right">
                            {game.price_overview.discount_percent > 0 ? (
                              <div className="space-x-2">
                                <span className="text-xs line-through text-gray-500">
                                  {game.price_overview.initial_formatted}
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  {game.price_overview.final_formatted}
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                                  -{game.price_overview.discount_percent}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-medium">
                                {game.price_overview.final_formatted}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Horas por dólar individual */}
                        {game.playtime_forever > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Horas/$:</span>
                            <span className="text-xs font-medium text-blue-600">
                              {calculateHoursPerDollar(game.playtime_forever, game.price_overview.final).toFixed(1)} h/$
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <span className="text-sm">Sin información de precio</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>

      {visibleCount < enrichedGames.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(c => c + GAMES_PER_PAGE)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mostrar más ({enrichedGames.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  )
}
