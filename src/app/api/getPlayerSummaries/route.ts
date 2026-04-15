// src/app/api/getPlayerSummaries/route.ts
import { NextResponse } from 'next/server'
import { getPlayerSummaries } from '@/services/steamService'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const steamids = searchParams.get('steamids')
  if (!steamids) {
    return NextResponse.json(
      { error: 'El parámetro steamids es requerido' },
      { status: 400 }
    )
  }

  const ids = steamids.split(',').map(id => id.trim()).filter(id => id)

  for (const id of ids) {
    if (!/^\d{17}$/.test(id)) {
      return NextResponse.json(
        { error: `Invalid steamid: '${id}' must be exactly 17 numeric digits` },
        { status: 400 }
      )
    }
  }

  try {
    const players = await getPlayerSummaries(ids)
    return NextResponse.json({ players })
  } catch (err) {
    console.error('Error en getPlayerSummaries:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
