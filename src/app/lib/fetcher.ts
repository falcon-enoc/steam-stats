// src/lib/fetcher.ts
const cache = new Map<string, { data: unknown; expiry: number }>();

/**
 * Wrapper de fetch con:
 *  - manejo de errores
 *  - parseo de JSON
 *  - caché TTL
 *  - retry automático en 429 (Too Many Requests) con backoff exponencial
 *
 * @param input URL o RequestInfo
 * @param init Opciones de fetch
 * @param ttl Tiempo de vida del caché en ms (por defecto 10 000)
 * @param retries Número máximo de reintentos en caso de 429 (por defecto 3)
 */
export default async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit,
  ttl = 10_000,
  retries = 3
): Promise<T> {
  const key = typeof input === 'string' ? input : JSON.stringify(input);
  const now = Date.now();

  // Retornar de cache si existe y no expiró
  const cached = cache.get(key);
  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    // Backoff exponencial: 300ms * 2^attempt
    if (attempt > 0) {
      const delay = 300 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const res = await fetch(input, init);
      const text = await res.text();
      let data: unknown = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        if (res.ok) {
          throw new Error(`Error parsing JSON: ${(err as Error).message}`);
        }
        throw new Error(`HTTP error ${res.status}: ${text}`);
      }

      if (res.status === 429) {
        // Too Many Requests: lanza para retry
        throw new Error(`429`);
      }

      if (!res.ok) {
        const msg = (data && typeof data === 'object' && 'error' in data ? (data as { error: string }).error : null) || res.statusText;
        throw new Error(`HTTP error ${res.status}: ${msg}`);
      }

      // Cachear y retornar
      cache.set(key, { data, expiry: now + ttl });
      return data as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Si no es 429 o agotamos reintentos, romper
      if (lastError.message !== '429' || attempt === retries) {
        break;
      }
      attempt++;
    }
  }

  // Si llegamos aquí, no se pudo recuperar
  throw lastError!;
}
