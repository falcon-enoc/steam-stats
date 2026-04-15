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

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 4,
        fontSize: 12,
        fontFamily: 'var(--font-display)',
        fontWeight: active ? 700 : 400,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: active ? '1px solid rgba(102,192,244,0.5)' : '1px solid rgba(102,192,244,0.12)',
        background: active ? 'rgba(102,192,244,0.12)' : 'rgba(27,40,56,0.5)',
        color: active ? '#66c0f4' : 'rgba(199,213,224,0.45)',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(102,192,244,0.25)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(102,192,244,0.12)' }}
    >
      {children}
    </button>
  )
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

  if (isLoading) return (
    <p style={{ color: 'rgba(199,213,224,0.4)', fontFamily: 'var(--font-body)', fontSize: 14 }}>Cargando juegos…</p>
  )
  if (error) return (
    <p style={{ color: '#f87171', fontFamily: 'var(--font-body)', fontSize: 14 }}>Error: {error}</p>
  )
  if (!enrichedGames || enrichedGames.length === 0) return (
    <p style={{ color: 'rgba(199,213,224,0.4)', fontFamily: 'var(--font-body)', fontSize: 14 }}>No se encontraron juegos.</p>
  )

  return (
    <div>
      {/* Prices loading banner */}
      {pricesLoading && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          background: 'rgba(102,192,244,0.06)',
          border: '1px solid rgba(102,192,244,0.15)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid rgba(102,192,244,0.3)',
            borderTopColor: '#66c0f4',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, color: 'rgba(102,192,244,0.7)', fontFamily: 'var(--font-body)' }}>
            Cargando precios de Steam…
          </span>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(199,213,224,0.3)', marginRight: 2 }}>
            Orden
          </span>
          {(['playtime', 'name', 'lastPlayed'] as SortField[]).map(f => (
            <SortButton key={f} active={sortField === f} onClick={() => handleSort(f)}>
              {f === 'playtime' ? `Tiempo ${sortField === f ? (sortOrder === 'desc' ? '↓' : '↑') : ''}` :
               f === 'name' ? `Nombre ${sortField === f ? (sortOrder === 'desc' ? '↓' : '↑') : ''}` :
               `Última vez ${sortField === f ? (sortOrder === 'desc' ? '↓' : '↑') : ''}`}
            </SortButton>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(199,213,224,0.3)', marginRight: 2 }}>
            Imagen
          </span>
          {([['header', 'Header'], ['capsule', 'Capsule'], ['logo', 'Logo'], ['icon', 'Ícono']] as [ImageType, string][]).map(([key, lbl]) => (
            <SortButton key={key} active={imageType === key} onClick={() => { setImageType(key); setVisibleCount(GAMES_PER_PAGE) }}>
              {lbl}
            </SortButton>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, listStyle: 'none', margin: 0, padding: 0 }}
      >
        {sortGames(enrichedGames, sortField, sortOrder).slice(0, visibleCount).map(game => {
          const imageData = getImageWithFallback(game, imageType, imageErrors)

          return (
            <motion.li
              key={game.appid}
              layout
              style={{
                background: 'linear-gradient(180deg, rgba(42,71,94,0.4) 0%, rgba(20,32,44,0.95) 100%)',
                border: '1px solid rgba(102,192,244,0.1)',
                borderRadius: 8,
                overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              whileHover={{ scale: 1.01 }}
              onMouseEnter={e => (e.currentTarget as HTMLLIElement).style.borderColor = 'rgba(102,192,244,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLLIElement).style.borderColor = 'rgba(102,192,244,0.1)'}
            >
              {/* Image */}
              <div style={{ width: '100%', height: 112, background: 'rgba(13,17,23,0.8)', overflow: 'hidden', position: 'relative' }}>
                {imageData?.url ? (
                  <img
                    src={imageData.url}
                    alt={game.name || 'Juego'}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: imageData.type === 'icon' ? 'contain' : 'cover',
                    }}
                    onError={() => handleImageError(imageData.key)}
                    loading="lazy"
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, rgba(27,40,56,1) 0%, rgba(42,71,94,0.6) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'rgba(102,192,244,0.3)', letterSpacing: '0.1em' }}>
                      {game.name?.slice(0, 2).toUpperCase() || 'NG'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: '#c7d5e0',
                  marginBottom: 6,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                }}>
                  {game.name || `Juego ${game.appid}`}
                </h3>

                <p style={{ fontSize: 12, color: 'rgba(199,213,224,0.5)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                  {formatPlaytime(game.playtime_forever)}
                </p>

                {game.rtime_last_played ? (
                  <p style={{ fontSize: 11, color: 'rgba(199,213,224,0.3)', fontFamily: 'var(--font-body)' }}>
                    {formatLastPlayed(game.rtime_last_played)}
                  </p>
                ) : null}

                {/* Price section */}
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(102,192,244,0.08)' }}>
                  {pricesLoading ? (
                    <div style={{ height: 12, width: '70%', background: 'rgba(102,192,244,0.06)', borderRadius: 3 }} />
                  ) : game.is_free ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#57cbde', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.05em' }}>
                        GRATIS
                      </span>
                      {game.playtime_forever > 0 && (
                        <span style={{ fontSize: 11, color: 'rgba(87,203,222,0.6)', fontFamily: 'var(--font-body)' }}>
                          {formatPlaytime(game.playtime_forever)}
                        </span>
                      )}
                    </div>
                  ) : game.price_overview ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        {game.price_overview.discount_percent > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 10, color: 'rgba(199,213,224,0.3)', textDecoration: 'line-through', fontFamily: 'var(--font-body)' }}>
                              {game.price_overview.initial_formatted}
                            </span>
                            <span style={{ fontSize: 12, color: '#57cbde', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                              {game.price_overview.final_formatted}
                            </span>
                            <span style={{ fontSize: 10, background: 'rgba(87,203,222,0.15)', color: '#57cbde', padding: '1px 4px', borderRadius: 3, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                              -{game.price_overview.discount_percent}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#c7d5e0', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                            {game.price_overview.final_formatted}
                          </span>
                        )}
                      </div>
                      {game.playtime_forever > 0 && (
                        <span style={{ fontSize: 11, color: '#66c0f4', fontFamily: 'var(--font-body)', opacity: 0.7 }}>
                          {calculateHoursPerDollar(game.playtime_forever, game.price_overview.final).toFixed(1)} h/$
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: 'rgba(199,213,224,0.25)', fontFamily: 'var(--font-body)' }}>
                      Sin precio
                    </span>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>

      {/* Load more */}
      {visibleCount < enrichedGames.length && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => setVisibleCount(c => c + GAMES_PER_PAGE)}
            style={{
              padding: '10px 28px',
              background: 'rgba(27,40,56,0.8)',
              border: '1px solid rgba(102,192,244,0.25)',
              borderRadius: 6,
              color: '#66c0f4',
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(42,71,94,0.6)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(102,192,244,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(27,40,56,0.8)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(102,192,244,0.25)';
            }}
          >
            Mostrar más — {enrichedGames.length - visibleCount} restantes
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
