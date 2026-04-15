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

const statusMap: Record<number, string> = {
  0: 'Offline',
  1: 'Online',
  2: 'Busy',
  3: 'Away',
  4: 'Snooze',
  5: 'Looking to trade',
  6: 'Looking to play',
};

export default function SteamPlayerCard({ steamId, player: propPlayer }: SteamPlayerCardProps) {
  // Si se proporciona steamId, usamos el hook para obtener los datos
  const { player: hookPlayer, isLoading, error } = useSteamPlayer(steamId ?? null);
  
  // Usamos el player proporcionado como prop o el obtenido del hook
  const player = propPlayer || hookPlayer;

  // Estado de carga
  if (steamId && isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center"
      >
        <p>Cargando perfil...</p>
      </motion.div>
    );
  }

  // Estado de error
  if (steamId && error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center"
      >
        <p className="text-red-500">Error al cargar el perfil</p>
      </motion.div>
    );
  }

  // Si no hay datos del jugador
  if (!player) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center"
      >
        <p>No se encontró información del jugador</p>
      </motion.div>
    );
  }

  // Si tenemos datos del jugador, mostramos la tarjeta
  const {
    avatarfull,
    personaname,
    personastate,
    lastlogoff,
    profileurl,
    realname,
  } = player;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex space-x-4"
    >
      <div className="w-24 h-24 relative flex-shrink-0">
        <Image
          src={avatarfull}
          alt={`${personaname} avatar`}
          layout="fill"
          className="rounded-full"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-xl font-semibold">{personaname}</h2>
        {realname && <p className="text-sm text-gray-600">{realname}</p>}
        <p className="mt-2 text-sm">
          Status: <span className="font-medium">{statusMap[personastate]}</span>
        </p>
        {lastlogoff && Number.isInteger(lastlogoff) && lastlogoff > 0 && lastlogoff < 9_999_999_999 && (
          <p className="text-xs text-gray-500">
            Last seen: {new Date(lastlogoff * 1000).toLocaleString()}
          </p>
        )}
        <a
          href={profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-blue-600 hover:underline"
        >
          Ver perfil
        </a>
      </div>
    </motion.div>
  );
}
