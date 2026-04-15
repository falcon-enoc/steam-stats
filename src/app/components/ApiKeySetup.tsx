'use client'
import { useState } from 'react'
import { useSteamAuth } from '../context/SteamAuthContext'

export default function ApiKeySetup() {
  const { setApiKey, enableDemo } = useSteamAuth()
  const [input, setInput] = useState('')
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const [keyError, setKeyError] = useState<string | null>(null)

  const handleSaveKey = () => {
    const trimmed = input.trim()
    if (!trimmed) { setKeyError('Ingresa una API key válida'); return }
    setApiKey(trimmed)
  }

  const handleDemo = async () => {
    setDemoLoading(true)
    setDemoError(null)
    const { error } = await enableDemo()
    if (error) setDemoError(error)
    setDemoLoading(false)
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '40px auto 0',
      background: 'rgba(27,40,56,0.7)',
      border: '1px solid rgba(102,192,244,0.15)',
      borderRadius: 10,
      padding: '28px 28px 24px',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display, sans-serif)',
        fontSize: '1.1rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#c7d5e0',
        marginBottom: 6,
      }}>
        API Key de Steam
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(199,213,224,0.45)', marginBottom: 20, lineHeight: 1.6 }}>
        Necesitas una API key de Steam para consultar perfiles.{' '}
        <a
          href="https://steamcommunity.com/dev/apikey"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#66c0f4', textDecoration: 'none' }}
        >
          Obtén la tuya aquí
        </a>
        . Tu key se guarda solo en tu navegador y nunca sale de él.
      </p>

      {/* Input key */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setKeyError(null) }}
          placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          style={{
            flex: 1,
            background: 'rgba(13,17,23,0.8)',
            border: '1px solid rgba(102,192,244,0.2)',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: 13,
            color: '#c7d5e0',
            fontFamily: 'monospace',
            outline: 'none',
          }}
          onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
        />
        <button
          onClick={handleSaveKey}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #2a475e 0%, #1b6fa8 100%)',
            border: 'none',
            borderRadius: 6,
            color: '#66c0f4',
            fontSize: 13,
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Guardar
        </button>
      </div>
      {keyError && (
        <p style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>{keyError}</p>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(102,192,244,0.08)' }} />
        <span style={{ fontSize: 11, color: 'rgba(199,213,224,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>o</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(102,192,244,0.08)' }} />
      </div>

      {/* Demo button */}
      <button
        onClick={handleDemo}
        disabled={demoLoading}
        style={{
          width: '100%',
          padding: '11px',
          background: 'transparent',
          border: '1px solid rgba(102,192,244,0.25)',
          borderRadius: 6,
          color: demoLoading ? 'rgba(102,192,244,0.4)' : '#66c0f4',
          fontSize: 13,
          fontFamily: 'var(--font-display, sans-serif)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: demoLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!demoLoading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(102,192,244,0.06)' }}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
      >
        {demoLoading ? 'Cargando demo…' : 'Ver demo'}
      </button>

      {demoError && (
        <p style={{
          fontSize: 12, color: '#f87171', marginTop: 10, lineHeight: 1.5,
          background: 'rgba(220,50,50,0.08)',
          border: '1px solid rgba(220,50,50,0.2)',
          borderRadius: 4,
          padding: '8px 12px',
        }}>
          {demoError}
        </p>
      )}
    </div>
  )
}
