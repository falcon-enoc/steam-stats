
// components/SteamProfileSearch.tsx
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSteamSearch } from '../hooks/useSteamSearch';

interface SteamProfileSearchProps {
  onProfileFound?: (steamId: string) => void;
  className?: string;
}

export default function SteamProfileSearch({ onProfileFound, className = '' }: SteamProfileSearchProps) {
  const [input, setInput] = useState('');
  const { searchProfile, isLoading, error } = useSteamSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const steamId = await searchProfile(input);
      onProfileFound?.(steamId);
    } catch {
      // El hook ya gestiona el estado de error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-md mx-auto ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="URL de perfil, SteamID64 o nombre personalizado"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}

        <p className="text-xs text-gray-500 mt-1">
          Ingresa un perfil de Steam: URL completa, SteamID64 o nombre personalizado
        </p>
      </form>
    </motion.div>
  );
}
