// src/components/LibraryStats.tsx
'use client'
import { motion } from 'framer-motion'
import type { OwnedGame } from '../types/steam'
import { useLibraryStats } from '../hooks/useLibraryStats'
import { formatPrice, formatPlaytime } from '../utils/formatters'

interface LibraryStatsProps {
  games: OwnedGame[] | null
  isLoading: boolean
  pricesReady?: boolean
}

export default function LibraryStats({ games, isLoading, pricesReady = false }: LibraryStatsProps) {
  const stats = useLibraryStats(games, pricesReady)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Estadísticas de la Biblioteca</h3>
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📊 Estadísticas de la Biblioteca
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total de juegos:</span>
          <span className="font-medium">{stats.totalGames.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tiempo total jugado:</span>
          <span className="font-medium">{formatPlaytime(stats.totalPlaytime)}</span>
        </div>
        
        {/* Tres valoraciones de la biblioteca */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <span className="text-sm font-medium text-gray-700">Valor de la biblioteca:</span>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Precio base (sin oferta):</span>
            <span className="font-medium text-gray-800">{formatPrice(stats.totalFullValue, stats.currency)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Precio actual:</span>
            <span className="font-medium text-blue-600">{formatPrice(stats.totalLibraryValue, stats.currency)}</span>
          </div>

          {stats.totalFullValue > stats.totalLibraryValue && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Ahorro por ofertas activas:</span>
              <span className="font-medium text-green-600">
                -{formatPrice(stats.totalFullValue - stats.totalLibraryValue, stats.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span className="text-xs text-gray-500">
              Mejor precio historico:
              {!stats.hasHistoricalData && (
                <span className="text-yellow-600 ml-1" title="Se irá completando a medida que se registren precios">(acumulando datos...)</span>
              )}
            </span>
            <span className="font-medium text-purple-600">{formatPrice(stats.totalLowestValue, stats.currency)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Juegos gratuitos:</span>
          <span className="font-medium text-green-600">{stats.freeGames}</span>
        </div>
        
        {/* Tiempo en juegos gratuitos */}
        {stats.freeGamesPlaytime > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tiempo en juegos gratuitos:</span>
            <span className="font-medium text-green-600">{formatPlaytime(stats.freeGamesPlaytime)}</span>
          </div>
        )}
        
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Costo por hora de juego:</span>
            <span className={`font-bold text-lg ${
              stats.costPerHour < 200 ? 'text-green-600' :
              stats.costPerHour < 1000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {formatPrice(Math.round(stats.costPerHour * 100), stats.currency)}/h
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Basado en {stats.gamesWithPriceAndPlaytime} juegos con precio y tiempo de juego
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Precio promedio por juego:</span>
          <span className="font-medium">{formatPrice(stats.averageGamePrice, stats.currency)}</span>
        </div>
      </div>
    </motion.div>
  )
}
