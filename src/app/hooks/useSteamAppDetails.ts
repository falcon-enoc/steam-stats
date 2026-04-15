// src/hooks/useSteamAppDetails.ts
import { useEffect, useState } from 'react'
import type { AppDetailsResponse } from '../types/steam'
import fetcher from '../lib/fetcher'

/**
 * Hook para obtener detalles de aplicaciones de Steam incluyendo precios
 * Maneja automáticamente lotes de más de 50 juegos y evita consultas duplicadas
 */
export function useSteamAppDetails(appids: number[] | null) {
  const [appDetails, setAppDetails] = useState<AppDetailsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear key estable para evitar re-ejecuciones innecesarias
  const appidsKey = appids ? appids.slice().sort().join(',') : null

  useEffect(() => {
    if (!appids || appids.length === 0) {
      setAppDetails(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Filtrar appids válidos (números positivos y menores a 999999999)
        const validAppids = appids.filter(id => id > 0 && id < 999999999)

        if (validAppids.length === 0) {
          if (!cancelled) setAppDetails({})
          return
        }

        // Dividir en lotes de 40 para mayor rendimiento
        const batchSize = 40
        const batches: number[][] = []
        for (let i = 0; i < validAppids.length; i += batchSize) {
          batches.push(validAppids.slice(i, i + batchSize))
        }

        console.log(`📦 Processing ${batches.length} batches for ${validAppids.length} apps (batch size: ${batchSize})`)

        const allAppDetails: AppDetailsResponse = {}

        // Procesar lotes concurrentemente (2 a la vez) para mayor velocidad
        const concurrency = 2
        for (let i = 0; i < batches.length; i += concurrency) {
          if (cancelled) break

          const chunk = batches.slice(i, i + concurrency)
          const results = await Promise.allSettled(
            chunk.map((batch) => {
              const url = `/api/getAppDetails?appids=${batch.join(',')}`
              return fetcher<AppDetailsResponse>(url, undefined, 600_000)
            })
          )

          if (cancelled) break

          for (const result of results) {
            if (result.status === 'fulfilled') {
              Object.assign(allAppDetails, result.value)
            }
          }

          console.log(`Processed batches ${i + 1}-${Math.min(i + concurrency, batches.length)}/${batches.length}`)

          // Small delay between concurrent groups
          if (i + concurrency < batches.length) {
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }

        if (!cancelled) {
          setAppDetails(allAppDetails)
          console.log(`🎯 Finished processing all batches. Total apps processed: ${Object.keys(allAppDetails).length}`)
        }

      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching app details:', err)
          setError(err instanceof Error ? err.message : 'Error fetching app details')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()

    return () => { cancelled = true }
  }, [appidsKey]) // eslint-disable-line react-hooks/exhaustive-deps -- appidsKey is a stable serialization of appids

  return {
    appDetails,
    isLoading,
    error,
  }
}
