'use client'
import { SWRConfig } from 'swr'

async function globalFetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: globalFetcher,
        revalidateOnFocus: false,
        dedupingInterval: 10_000,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  )
}
