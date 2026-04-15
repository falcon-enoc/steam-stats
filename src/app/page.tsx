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

  useEffect(() => {
    if (isDemoMode && demoSteamId) setSteamId(demoSteamId)
    if (!isDemoMode && !apiKey) setSteamId(null)
  }, [isDemoMode, demoSteamId, apiKey])

  const { player, isLoading, error } = useSteamPlayer(steamId)
  const { enrichedGames, isLoading: gamesLoading, pricesLoading } = useSteamGames(steamId)

  const hasAuth = !!apiKey || isDemoMode

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section
        className="hero-grid hero-noise relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d1117 0%, #111a25 60%, #0d1117 100%)',
          padding: steamId ? '48px 24px 40px' : '80px 24px 72px',
          transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(102,192,244,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>

          {/* Banners de auth */}
          {isDemoMode && (
            <div style={{
              background: 'rgba(102,192,244,0.08)', border: '1px solid rgba(102,192,244,0.2)',
              borderRadius: 6, padding: '8px 16px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 13, color: 'rgba(102,192,244,0.8)',
            }}>
              <span>Modo demo — datos de ejemplo</span>
            </div>
          )}

          {apiKey && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={clearApiKey} style={{
                fontSize: 11, color: 'rgba(199,213,224,0.35)',
                background: 'none', border: 'none', cursor: 'pointer',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Limpiar API key
              </button>
            </div>
          )}

          {/* Título — solo sin perfil cargado y con auth */}
          {!steamId && hasAuth && (
            <>
              <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.35em', textTransform: 'uppercase', color: '#66c0f4', opacity: 0.7,
                }}>
                  Steam Profile Analyzer
                </span>
              </div>
              <h1 className="animate-slide-up-delay" style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.05,
                textAlign: 'center', color: '#c7d5e0', marginBottom: '8px',
              }}>
                Tu biblioteca,{' '}
                <span style={{ color: '#66c0f4' }}>analizada</span>
              </h1>
              <p className="animate-slide-up-delay-2" style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                color: 'rgba(199,213,224,0.5)', textAlign: 'center',
                marginBottom: '36px', fontWeight: 300, letterSpacing: '0.01em',
              }}>
                Estadísticas de juegos, valor de biblioteca y más.
              </p>
            </>
          )}

          {/* Búsqueda o setup */}
          {hasAuth && !isDemoMode && (
            <div className={steamId ? '' : 'animate-slide-up-delay-2'}>
              <SteamProfileSearch onProfileFound={setSteamId} />
            </div>
          )}
          {!hasAuth && <ApiKeySetup />}
        </div>
      </section>

      {/* ── Content Section ───────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
        {isLoading && (
          <p style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(199,213,224,0.4)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Cargando datos del jugador…
          </p>
        )}
        {error && <p style={{ color: '#f87171', textAlign: 'center', marginTop: '40px' }}>{error}</p>}

        {player && (
          <div className="mt-8" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
            <SteamPlayerCard player={player} />
            <LibraryStats
              games={enrichedGames}
              isLoading={gamesLoading || pricesLoading}
              pricesReady={!pricesLoading && !!enrichedGames}
            />
          </div>
        )}

        {steamId && (
          <div className="mt-8">
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase', color: '#c7d5e0',
              marginBottom: '20px', paddingBottom: '12px',
              borderBottom: '1px solid rgba(102,192,244,0.12)',
            }}>
              Biblioteca
            </h2>
            <SteamOwnedGames steamId={steamId} />
          </div>
        )}
      </div>
    </>
  )
}
