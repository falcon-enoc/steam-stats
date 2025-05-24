// src/hooks/useSteamSearch.ts
import { useState } from 'react';
import { isSteamID64, extractSteamID, normalizeVanityURL } from '@/utils/steamUtils';

export function useSteamSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProfile = async (input: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = input.trim();
      // ID puro
      if (isSteamID64(raw)) return raw;
      // Extraído de URL o texto
      const extracted = extractSteamID(raw);
      if (extracted) return extracted;
      // Vanity
      const normalized = normalizeVanityURL(input);
      const res = await fetch(`/api/resolveVanityURL?vanityurl=${encodeURIComponent(normalized)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'No se pudo resolver vanity URL');
      return json.steamid;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { searchProfile, isLoading, error };
}
