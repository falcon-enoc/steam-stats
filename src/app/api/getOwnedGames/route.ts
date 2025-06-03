// src/app/api/getOwnedGames/route.ts
import { NextResponse } from 'next/server'
import { getOwnedGames } from '@/services/steamService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const steamid = searchParams.get('steamid')
  if (!steamid) {
    return NextResponse.json({ error: 'El parámetro steamid es requerido' }, { status: 400 })
  }
  try {
    const games = await getOwnedGames(steamid)
    return NextResponse.json({ games })
  } catch (err: any) {
    console.error('Error en getOwnedGames:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
