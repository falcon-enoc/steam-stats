// src/app/page.tsx
'use client'
import { useState } from 'react'
import SteamProfileSearch from './components/SteamProfileSearch'
import SteamPlayerCard from './components/SteamPlayerCard'
import SteamOwnedGames from './components/SteamGameowned'
import { useSteamPlayer } from './hooks/useSteamPlayer'

export default function HomePage() {
  const [steamId, setSteamId] = useState<null | string>(null)
  // hook que llama a tu API getPlayerSummaries a partir de steamId
  const { player, isLoading, error } = useSteamPlayer(steamId)
  return (
    <main className="p-4">
      <p className='text-red-600'>76561198078447643</p>
      <p className='text-red-600'>www.steampowder.com/prifle/id/InsaPro</p>
      <SteamProfileSearch onProfileFound={setSteamId} />

      {isLoading && <p>Cargando datos del jugador…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {player && <SteamPlayerCard player={player} />}
      
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
