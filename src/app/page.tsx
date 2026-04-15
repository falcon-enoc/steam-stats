// src/app/page.tsx
'use client'
import { useState } from 'react'
import SteamProfileSearch from './components/SteamProfileSearch'
import SteamPlayerCard from './components/SteamPlayerCard'
import SteamOwnedGames from './components/SteamGameowned'
import LibraryStats from './components/LibraryStats'
import { useSteamPlayer } from './hooks/useSteamPlayer'
import { useSteamGames } from './hooks/useSteamGames'

export default function HomePage() {
  const [steamId, setSteamId] = useState<null | string>(null)
  // hook que llama a tu API getPlayerSummaries a partir de steamId
  const { player, isLoading, error } = useSteamPlayer(steamId)
  // hook que obtiene los juegos con precios
  const { enrichedGames, isLoading: gamesLoading, pricesLoading } = useSteamGames(steamId)
  
  return (
    <main className="p-4">
      <SteamProfileSearch onProfileFound={setSteamId} />

      {isLoading && <p>Cargando datos del jugador…</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Contenedor principal con el perfil y estadísticas */}
      {player && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta del jugador */}
          <div className="lg:col-span-1">
            <SteamPlayerCard player={player} />
          </div>
          
          {/* Estadísticas de la biblioteca */}
          <div className="lg:col-span-2">
            <LibraryStats
              games={enrichedGames}
              isLoading={gamesLoading || pricesLoading}
              pricesReady={!pricesLoading && !!enrichedGames}
            />
          </div>
        </div>
      )}
      
      {/* Mostrar juegos del usuario */}
      {steamId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Juegos del Usuario</h2>
          <SteamOwnedGames steamId={steamId} />
        </div>
      )}
    </main>
  )
}
