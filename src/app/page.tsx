// src/app/page.tsx
'use client'
import { useState } from 'react'
import SteamProfileSearch from './components/SteamProfileSearch'
import SteamPlayerCard from './components/SteamPlayerCard'
import { useSteamPlayer } from './hooks/useSteamPlayer'

export default function HomePage() {
  const [steamId, setSteamId] = useState<null | string>(null)
  // hook que llama a tu API getPlayerSummaries a partir de steamId
  const { player, isLoading, isError } = useSteamPlayer(steamId)
  return (
    <main className="p-4">
      <p className='text-red-600'>76561198078447643</p>
      <SteamProfileSearch onProfileFound={setSteamId} />

      {isLoading && <p>Cargando datos del jugador…</p>}
      {isError && <p className="text-red-500">{isError}</p>}
      {player && <SteamPlayerCard player={player} />}
    </main>
  )
}
