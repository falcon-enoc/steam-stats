// src/app/api/resolveVanityURL/route.ts
import { NextResponse } from 'next/server'
import { normalizeVanityURL } from '@/utils/steamUtils'
import { ResolveVanityURL } from '@/services/steamService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vanityurl = searchParams.get('vanityurl')
  if (!vanityurl) {
    return NextResponse.json(
      { error: 'El parámetro vanityurl es requerido' },
      { status: 400 }
    )
  }

  try {
    const normalized = normalizeVanityURL(vanityurl)
    const steamid = await ResolveVanityURL(normalized)
    return NextResponse.json({ steamid })
  } catch (err) {
    console.error('Error en resolveVanityURL:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
