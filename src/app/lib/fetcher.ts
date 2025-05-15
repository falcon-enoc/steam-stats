// lib/fetcher.ts

/**
 * Wrapper sobre fetch con manejo de errores y parseo de JSON.
 * @param input URL o RequestInfo para la petición
 * @param init Opciones de fetch (headers, método, body, etc.)
 * @returns Datos parseados como T
 * @throws Error si la respuesta HTTP no es ok o el JSON no es válido
 */
export default async function fetcher<T>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(input, init);
    const text = await res.text();
  
    // Intentamos parsear JSON, si falla y era ok, lanzamos error de parseo
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      if (res.ok) {
        throw new Error(`Error parsing JSON: ${(err as Error).message}`);
      }
      // Si no es ok y parse falla, fallback a texto plano
      throw new Error(`HTTP error ${res.status}: ${text}`);
    }
  
    if (!res.ok) {
      // Intentamos extraer mensaje de error desde el JSON
      const message = (data && data.error) || res.statusText;
      throw new Error(`HTTP error ${res.status}: ${message}`);
    }
  
    return data as T;
  }
  