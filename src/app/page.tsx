// src/app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import SteamProfileSearch from './components/SteamProfileSearch'
import SteamPlayerCard from './components/SteamPlayerCard'
import SteamOwnedGames from './components/SteamGameowned'
import LibraryStats from './components/LibraryStats'
import ApiKeySetup from './components/ApiKeySetup'
import { useSteamPlayer } from './hooks/useSteamPlayer'
import { useSteamGames } from './hooks/useSteamGames'
import { useSteamAuth } from './context/SteamAuthContext'

export default function HomePage() {
  const { apiKey, isDemoMode, demoSteamId, clearApiKey } = useSteamAuth()
  const [steamId, setSteamId] = useState<string | null>(null)

  // En modo demo cargamos el perfil demo automáticamente
  useEffect(() => {
    if (isDemoMode && demoSteamId) setSteamId(demoSteamId)
    if (!isDemoMode && !apiKey) setSteamId(null)
  }, [isDemoMode, demoSteamId, apiKey])

  const { player, isLoading, error } = useSteamPlayer(steamId)
  const { enrichedGames, isLoading: gamesLoading, pricesLoading } = useSteamGames(steamId)

  const hasAuth = !!apiKey || isDemoMode

  return (
    <main className="p-4 max-w-7xl mx-auto">

      {/* Banner modo demo */}
      {isDemoMode && (
        <div style={{
          background: 'rgba(102,192,244,0.08)',
          border: '1px solid rgba(102,192,244,0.2)',
          borderRadius: 6,
          padding: '8px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          color: 'rgba(102,192,244,0.8)',
        }}>
          <span>Modo demo — datos de ejemplo</span>
        </div>
      )}

      {/* Banner key activa con opción de limpiar */}
      {apiKey && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 12,
        }}>
          <button
            onClick={clearApiKey}
            style={{
              fontSize: 11,
              color: 'rgba(199,213,224,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Limpiar API key
          </button>
        </div>
      )}

      {/* Búsqueda — solo si tiene auth y no está en demo */}
      {hasAuth && !isDemoMode && (
        <SteamProfileSearch onProfileFound={setSteamId} />
      )}

      {/* Setup si no hay auth */}
      {!hasAuth && <ApiKeySetup />}

      {isLoading && <p className="mt-8 text-center" style={{ color: 'rgba(199,213,224,0.4)', fontSize: 14 }}>Cargando datos del jugador…</p>}
      {error && <p className="mt-4 text-center" style={{ color: '#f87171', fontSize: 14 }}>{error}</p>}

      {player && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SteamPlayerCard player={player} />
          </div>
          <div className="lg:col-span-2">
            <LibraryStats
              games={enrichedGames}
              isLoading={gamesLoading || pricesLoading}
              pricesReady={!pricesLoading && !!enrichedGames}
            />
          </div>
        </div>
      )}

      {steamId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Biblioteca</h2>
          <SteamOwnedGames steamId={steamId} />
        </div>
      )}
    </main>
  )
}
