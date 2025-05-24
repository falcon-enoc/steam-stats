// lib/fetcher.ts
const cache = new Map<string, { data: any; expiry: number }>();

/**
 * Wrapper de fetch con manejo de errores, parseo de JSON y caché.
 * @param input URL o RequestInfo
 * @param init Opciones de fetch
 * @param ttl Tiempo de vida del caché en milisegundos (por defecto 10s)
 */
export default async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit,
  ttl = 10000
): Promise<T> {
  const key = typeof input === 'string' ? input : JSON.stringify(input);
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const res = await fetch(input, init);
  const text = await res.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (res.ok) {
      throw new Error(`Error parsing JSON: ${(err as Error).message}`);
    }
    throw new Error(`HTTP error ${res.status}: ${text}`);
  }

  if (!res.ok) {
    const message = (data && data.error) || res.statusText;
    throw new Error(`HTTP error ${res.status}: ${message}`);
  }

  cache.set(key, { data, expiry: now + ttl });

  return data as T;
}
