// src/app/api/resolveVanityURL/route.ts
import { NextResponse } from 'next/server'
import { normalizeVanityURL } from '@/utils/steamUtils'
import { ResolveVanityURL } from '@/services/steamWebApiService'
import { resolveApiKey } from '@/lib/resolveApiKey'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vanityurl = searchParams.get('vanityurl')
  if (!vanityurl) {
    return NextResponse.json(
      { error: 'El parámetro vanityurl es requerido' },
      { status: 400 }
    )
  }

  // vanityURL no tiene SteamID aún — no aplica restricción de demo por ID
  const apiKey = resolveApiKey(request)
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Se requiere una API key de Steam. Ingresa la tuya o usa el modo demo.' },
      { status: 401 }
    )
  }

  try {
    const normalized = normalizeVanityURL(vanityurl)
    const steamid = await ResolveVanityURL(normalized, apiKey)
    return NextResponse.json({ steamid })
  } catch (err) {
    console.error('Error en resolveVanityURL:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
