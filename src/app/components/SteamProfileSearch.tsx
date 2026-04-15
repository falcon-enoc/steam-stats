
// components/SteamProfileSearch.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSteamSearch } from '../hooks/useSteamSearch';

interface SteamProfileSearchProps {
  onProfileFound?: (steamId: string) => void;
  className?: string;
}

export default function SteamProfileSearch({ onProfileFound, className = '' }: SteamProfileSearchProps) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const { searchProfile, isLoading, error } = useSteamSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const steamId = await searchProfile(input);
      onProfileFound?.(steamId);
    } catch {
      // hook gestiona error
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Input container */}
        <div
          className="relative flex items-center transition-all duration-300"
          style={{
            borderRadius: '6px',
            boxShadow: focused
              ? '0 0 0 1px #66c0f4, 0 0 24px rgba(102,192,244,0.3), 0 0 60px rgba(102,192,244,0.08)'
              : '0 0 0 1px rgba(102,192,244,0.2)',
          }}
        >
          {/* Steam icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              style={{ color: focused ? '#66c0f4' : 'rgba(199,213,224,0.4)', transition: 'color 0.3s' }}
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29L10 15.9V15a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2l-.1.01-1.34 3.26A10.01 10.01 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-4.5 14.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7-5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                fill="currentColor"
              />
            </svg>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="URL de perfil, SteamID64 o nombre personalizado"
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(27, 40, 56, 0.8)',
              border: 'none',
              outline: 'none',
              padding: '14px 16px 14px 48px',
              fontSize: '15px',
              fontFamily: 'var(--font-body)',
              color: '#c7d5e0',
              borderRadius: '6px 0 0 6px',
              letterSpacing: '0.01em',
            }}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              background: isLoading
                ? 'rgba(42, 71, 94, 0.8)'
                : 'linear-gradient(135deg, #2a475e 0%, #1b6fa8 100%)',
              border: 'none',
              color: isLoading ? 'rgba(199,213,224,0.4)' : '#66c0f4',
              padding: '14px 24px',
              fontSize: '14px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              borderRadius: '0 6px 6px 0',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              minWidth: '110px',
              opacity: !input.trim() && !isLoading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading && input.trim()) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #2a5572 0%, #1a80c4 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  !input.trim()
                    ? 'rgba(42, 71, 94, 0.8)'
                    : 'linear-gradient(135deg, #2a475e 0%, #1b6fa8 100%)';
              }
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                </svg>
                Buscando
              </span>
            ) : 'Buscar'}
          </button>
        </div>

        {/* Hint */}
        <p style={{
          fontSize: '12px',
          color: 'rgba(199,213,224,0.35)',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.01em',
          paddingLeft: '4px',
        }}>
          Acepta URL completa · SteamID64 · nombre personalizado
        </p>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                background: 'rgba(220, 50, 50, 0.1)',
                border: '1px solid rgba(220, 50, 50, 0.3)',
                borderRadius: '4px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#f87171',
                fontFamily: 'var(--font-body)',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(199,213,224,0.3); }
        input:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
}
