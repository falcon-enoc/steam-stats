// src/components/LibraryStats.tsx
'use client'
import { motion } from 'framer-motion'
import type { OwnedGame } from '../types/steam'
import { useLibraryStats } from '../hooks/useLibraryStats'
import { formatPrice, formatPlaytime, formatHoursPerDollar } from '../utils/formatters'

interface LibraryStatsProps {
  games: OwnedGame[] | null
  isLoading: boolean
}

export default function LibraryStats({ games, isLoading }: LibraryStatsProps) {
  const stats = useLibraryStats(games)

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
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Valor de la biblioteca:</span>
          <span className="font-medium">{formatPrice(stats.totalLibraryValue, stats.currency)}</span>
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
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Horas por dólar:</span>
            <span className={`font-bold text-lg ${
              stats.hoursPerDollar > 50 ? 'text-green-600' : 
              stats.hoursPerDollar > 20 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {formatHoursPerDollar(stats.hoursPerDollar)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
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
