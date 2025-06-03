// src/components/SteamOwnedGames.tsx
'use client'
import { useState, useEffect } from 'react'
import { useSteamGames } from '@/hooks/useSteamGames'
import { motion } from 'framer-motion'

interface Props {
  steamId: string
}

export default function SteamOwnedGames({ steamId }: Props) {
  const { games, isLoading, error } = useSteamGames(steamId)
  const [images, setImages] = useState({})

  if (isLoading) return <p>Cargando juegos…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!games || games.length === 0) return <p>No se encontraron juegos.</p>

  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {games.map(game => (
        <li key={game.appid} className="border rounded-lg p-4 flex flex-col">
          {/* {game.img_icon_url && (
            <img
              src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`}
              alt={game.name}
              className="w-full h-24 object-cover mb-2 rounded"
            />
          )} */}
          <h3 className="font-semibold text-lg">{game.name}</h3>
          <p className="text-sm mt-auto">
            Tiempo de juego: {Math.floor(game.playtime_forever / 60)}h
          </p>
        </li>
      ))}
    </motion.ul>
  )
}
