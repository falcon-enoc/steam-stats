// src/app/api/getOwnedGames/route.ts
import { NextResponse } from 'next/server'
import { getOwnedGames } from '@/services/steamWebApiService'
import { resolveApiKey } from '@/lib/resolveApiKey'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const steamid = searchParams.get('steamid')
  if (!steamid) {
    return NextResponse.json({ error: 'El parámetro steamid es requerido' }, { status: 400 })
  }
  if (!/^\d{17}$/.test(steamid)) {
    return NextResponse.json(
      { error: `Invalid steamid: '${steamid}' must be exactly 17 numeric digits` },
      { status: 400 }
    )
  }

  const apiKey = resolveApiKey(request, steamid)
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Se requiere una API key de Steam. Ingresa la tuya o usa el modo demo.' },
      { status: 401 }
    )
  }

  try {
    const games = await getOwnedGames(steamid, apiKey)
    return NextResponse.json({ games })
  } catch (err) {
    console.error('Error en getOwnedGames:', err)
    return NextResponse.json({ error: 'Error al obtener juegos del perfil' }, { status: 500 })
  }
}
