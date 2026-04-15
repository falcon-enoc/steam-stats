import 'server-only'
import { isDemoSessionActive } from './db'

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

/**
 * Resuelve qué API key usar para una request.
 *
 * Prioridad:
 *  1. Header X-Steam-Api-Key  → key del usuario
 *  2. Header X-Demo: true     → key del servidor, solo si:
 *                               - steamId coincide con STEAM_DEMO_ID
 *                               - IP tiene sesión demo activa
 *
 * Retorna null si no hay key válida disponible.
 */
export function resolveApiKey(request: Request, steamId?: string): string | null {
  // 1. Key propia del usuario
  const userKey = request.headers.get('x-steam-api-key')?.trim()
  if (userKey) return userKey

  // 2. Modo demo
  const isDemo = request.headers.get('x-demo') === 'true'
  if (!isDemo) return null

  const demoId = process.env.STEAM_DEMO_ID
  const serverKey = process.env.STEAM_KEY
  if (!demoId || !serverKey) return null

  // Solo permitir el SteamID de demo
  if (steamId && steamId !== demoId) return null

  // Validar sesión activa por IP
  const ip = getClientIp(request)
  if (!isDemoSessionActive(ip)) return null

  return serverKey
}
