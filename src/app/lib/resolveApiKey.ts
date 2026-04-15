import 'server-only'
import { isDemoSessionActive } from './db'

/**
 * Extrae la IP del cliente de forma segura.
 *
 * Orden de preferencia:
 *  1. TRUSTED_IP_HEADER env var — para despliegues detrás de Cloudflare (cf-connecting-ip)
 *     o proxies de confianza que fijen una sola IP real.
 *  2. x-real-ip — fijado por nginx/proxies como una sola IP (más difícil de falsificar
 *     que x-forwarded-for si el proxy lo sobreescribe).
 *  3. Último valor de x-forwarded-for — el último hop agregado por el proxy más cercano
 *     es más confiable que el primero (que viene del cliente y puede ser falso).
 *
 * Nota: sin WAF/proxy de confianza, cualquier header HTTP puede ser falsificado.
 * En producción usar Vercel Firewall o Cloudflare para IP fiable.
 */
export function getClientIp(request: Request): string {
  const trustedHeader = process.env.TRUSTED_IP_HEADER
  if (trustedHeader) {
    const val = request.headers.get(trustedHeader)?.trim()
    if (val) return val
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  // Último IP de la cadena XFF (agregado por el proxy más cercano)
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const last = xff.split(',').at(-1)?.trim()
    if (last) return last
  }

  return 'unknown'
}

/**
 * Resuelve qué API key usar para una request.
 *
 * Prioridad:
 *  1. Header X-Steam-Api-Key  → key del usuario
 *  2. Header X-Demo: true     → key del servidor, solo si:
 *                               - TODOS los steamIds coinciden con STEAM_DEMO_ID
 *                               - IP tiene sesión demo activa
 *
 * Acepta steamId como string o string[] para validar múltiples IDs a la vez.
 * Retorna null si no hay key válida disponible.
 */
export function resolveApiKey(request: Request, steamId?: string | string[]): string | null {
  // 1. Key propia del usuario
  const userKey = request.headers.get('x-steam-api-key')?.trim()
  if (userKey) return userKey

  // 2. Modo demo
  const isDemo = request.headers.get('x-demo') === 'true'
  if (!isDemo) return null

  const demoId = process.env.STEAM_DEMO_ID
  const serverKey = process.env.STEAM_KEY
  if (!demoId || !serverKey) return null

  // Todos los steamIds deben ser el ID de demo (evita bypass con lista de IDs)
  if (steamId !== undefined) {
    const ids = Array.isArray(steamId) ? steamId : [steamId]
    if (ids.some(id => id !== demoId)) return null
  }

  // Validar sesión activa por IP
  const ip = getClientIp(request)
  if (!isDemoSessionActive(ip)) return null

  return serverKey
}
