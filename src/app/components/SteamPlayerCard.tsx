'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Player } from '../types/steam';
import { useSteamPlayer } from '../hooks/useSteamPlayer';

interface SteamPlayerCardProps {
  steamId?: string;
  player?: Player;
}

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Offline',          color: 'rgba(199,213,224,0.3)' },
  1: { label: 'Online',           color: '#57cbde' },
  2: { label: 'Busy',             color: '#c6372c' },
  3: { label: 'Away',             color: '#8b9bb4' },
  4: { label: 'Snooze',           color: '#8b9bb4' },
  5: { label: 'Looking to Trade', color: '#66c0f4' },
  6: { label: 'Looking to Play',  color: '#66c0f4' },
};

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(42,71,94,0.5) 0%, rgba(27,40,56,0.9) 100%)',
  border: '1px solid rgba(102,192,244,0.12)',
  borderRadius: '8px',
  padding: '20px',
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
};

function Skeleton() {
  return (
    <div style={{ ...cardStyle, opacity: 0.6 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(102,192,244,0.08)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 16, width: '60%', background: 'rgba(102,192,244,0.08)', borderRadius: 4 }} />
        <div style={{ height: 12, width: '40%', background: 'rgba(102,192,244,0.06)', borderRadius: 4 }} />
        <div style={{ height: 12, width: '50%', background: 'rgba(102,192,244,0.06)', borderRadius: 4, marginTop: 4 }} />
      </div>
    </div>
  );
}

export default function SteamPlayerCard({ steamId, player: propPlayer }: SteamPlayerCardProps) {
  const { player: hookPlayer, isLoading, error } = useSteamPlayer(steamId ?? null);
  const player = propPlayer || hookPlayer;

  if (steamId && isLoading) return <Skeleton />;

  if ((steamId && error) || !player) {
    return (
      <div style={cardStyle}>
        <p style={{ color: 'rgba(199,213,224,0.4)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
          {error ? 'Error al cargar el perfil' : 'No se encontró información del jugador'}
        </p>
      </div>
    );
  }

  const { avatarfull, personaname, personastate, lastlogoff, profileurl, realname } = player;
  const status = statusMap[personastate] ?? statusMap[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={cardStyle}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(102,192,244,0.25)',
          position: 'relative',
        }}>
          <Image
            src={avatarfull}
            alt={`${personaname} avatar`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Status dot */}
        <span style={{
          position: 'absolute',
          bottom: 2, right: 2,
          width: 12, height: 12,
          borderRadius: '50%',
          background: status.color,
          border: '2px solid #0d1117',
          boxShadow: `0 0 6px ${status.color}`,
        }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: '#c7d5e0',
          marginBottom: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {personaname}
        </h2>

        {realname && (
          <p style={{ fontSize: 12, color: 'rgba(199,213,224,0.45)', fontFamily: 'var(--font-body)', marginBottom: 6 }}>
            {realname}
          </p>
        )}

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: status.color,
        }}>
          {status.label}
        </span>

        {lastlogoff && Number.isInteger(lastlogoff) && lastlogoff > 0 && personastate === 0 && (
          <p style={{ fontSize: 11, color: 'rgba(199,213,224,0.3)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
            {new Date(lastlogoff * 1000).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        )}

        <a
          href={profileurl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 10,
            fontSize: 12,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#66c0f4',
            textDecoration: 'none',
            opacity: 0.7,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
        >
          Ver en Steam →
        </a>
      </div>
    </motion.div>
  );
}
