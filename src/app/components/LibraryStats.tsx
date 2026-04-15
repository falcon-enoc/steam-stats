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

const card: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(42,71,94,0.45) 0%, rgba(27,40,56,0.9) 100%)',
  border: '1px solid rgba(102,192,244,0.12)',
  borderRadius: '8px',
  padding: '20px 22px',
}

const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '7px 0',
}

const label: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(199,213,224,0.5)',
  fontFamily: 'var(--font-body)',
}

const value: React.CSSProperties = {
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  color: '#c7d5e0',
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(102,192,244,0.08)', margin: '4px 0' }} />
}

export default function LibraryStats({ games, isLoading, pricesReady = false }: LibraryStatsProps) {
  const stats = useLibraryStats(games, pricesReady)

  if (isLoading) {
    return (
      <div style={{ ...card, opacity: 0.6 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ ...row }}>
            <div style={{ height: 12, width: '45%', background: 'rgba(102,192,244,0.06)', borderRadius: 3 }} />
            <div style={{ height: 12, width: '20%', background: 'rgba(102,192,244,0.06)', borderRadius: 3 }} />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={card}>
        <p style={{ ...label }}>No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <motion.div
      style={card}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(102,192,244,0.7)',
        marginBottom: 12,
      }}>
        Biblioteca
      </h3>

      {/* Top stats */}
      <div style={row}>
        <span style={label}>Total de juegos</span>
        <span style={value}>{stats.totalGames.toLocaleString()}</span>
      </div>
      <div style={row}>
        <span style={label}>Tiempo total jugado</span>
        <span style={value}>{formatPlaytime(stats.totalPlaytime)}</span>
      </div>
      <div style={row}>
        <span style={label}>Juegos gratuitos</span>
        <span style={{ ...value, color: '#57cbde' }}>{stats.freeGames}</span>
      </div>
      {stats.freeGamesPlaytime > 0 && (
        <div style={row}>
          <span style={label}>Tiempo en gratuitos</span>
          <span style={{ ...value, color: '#57cbde' }}>{formatPlaytime(stats.freeGamesPlaytime)}</span>
        </div>
      )}

      <Divider />

      {/* Valor */}
      <div style={{ margin: '6px 0 4px' }}>
        <p style={{ ...label, marginBottom: 6 }}>Valor de la biblioteca</p>
        <div style={{ background: 'rgba(27,40,56,0.6)', border: '1px solid rgba(102,192,244,0.08)', borderRadius: 6, padding: '10px 12px' }}>
          <div style={row}>
            <span style={{ ...label, fontSize: 12 }}>Precio base</span>
            <span style={{ ...value, fontSize: 12 }}>{formatPrice(stats.totalFullValue, stats.currency)}</span>
          </div>
          <div style={row}>
            <span style={{ ...label, fontSize: 12 }}>Precio actual</span>
            <span style={{ ...value, fontSize: 12, color: '#66c0f4' }}>{formatPrice(stats.totalLibraryValue, stats.currency)}</span>
          </div>
          {stats.totalFullValue > stats.totalLibraryValue && (
            <div style={row}>
              <span style={{ ...label, fontSize: 12 }}>Ahorro en ofertas</span>
              <span style={{ ...value, fontSize: 12, color: '#57cbde' }}>
                -{formatPrice(stats.totalFullValue - stats.totalLibraryValue, stats.currency)}
              </span>
            </div>
          )}
          <div style={{ height: 1, background: 'rgba(102,192,244,0.08)', margin: '6px 0' }} />
          <div style={row}>
            <span style={{ ...label, fontSize: 12 }}>
              Mejor precio histórico
              {!stats.hasHistoricalData && (
                <span style={{ color: '#c99a2e', marginLeft: 4, fontSize: 11 }}>(acumulando…)</span>
              )}
            </span>
            <span style={{ ...value, fontSize: 12, color: '#a88beb' }}>{formatPrice(stats.totalLowestValue, stats.currency)}</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Cost per hour — highlight */}
      <div style={{ ...row, marginTop: 4 }}>
        <span style={label}>Costo por hora</span>
        <span style={{
          ...value,
          fontSize: 18,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: stats.costPerHour < 200 ? '#57cbde' : stats.costPerHour < 1000 ? '#c99a2e' : '#c6372c',
        }}>
          {formatPrice(Math.round(stats.costPerHour * 100), stats.currency)}/h
        </span>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(199,213,224,0.28)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
        Basado en {stats.gamesWithPriceAndPlaytime} juegos con precio y tiempo
      </p>

      <Divider />

      <div style={row}>
        <span style={label}>Precio promedio por juego</span>
        <span style={value}>{formatPrice(stats.averageGamePrice, stats.currency)}</span>
      </div>
    </motion.div>
  )
}
