// utils/steamUtils.ts
/**
 * Verifica si una cadena es un SteamID64 válido
 * Los SteamID64 son números de 17 dígitos que comienzan con 7656
 */
export function isSteamID64(input: string): boolean {
  return /^7656\d{13}$/.test(input);
}

/**
 * Extrae un SteamID64 de una cadena (URL, texto, etc.)
 * Busca patrones como 7656\d{13} en la entrada
 */
export function extractSteamID(input: string): string | null {
  const match = input.match(/7656\d{13}/);
  return match ? match[0] : null;
}

/**
 * Normaliza una URL de perfil de Steam para extraer solo el identificador o nombre personalizado
 * Soporta rutas de "id" y "profile"
 */
export function normalizeVanityURL(input: string): string {
  let str = input.trim();
  // Si es URL de vanity
  if (str.includes('steamcommunity.com/id/')) {
    str = str.split('steamcommunity.com/id/')[1];
  }
  // Si es URL de perfil con SteamID64
  else if (str.includes('steamcommunity.com/profile/')) {
    str = str.split('steamcommunity.com/profile/')[1];
  }
  // Eliminar slashes y parámetros adicionales
  const vanity = str.split('/')[0].split('?')[0];

  // Steam permite: letras, números, guión bajo, guión. Máximo 32 caracteres.
  // Rechazar cualquier otra cosa antes de enviarlo a la API.
  if (vanity.length === 0 || vanity.length > 32) {
    throw new Error('URL de Steam inválida: el identificador debe tener entre 1 y 32 caracteres');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(vanity)) {
    throw new Error('URL de Steam inválida: solo se permiten letras, números, _ y -');
  }

  return vanity;
}