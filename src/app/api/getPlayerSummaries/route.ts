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

  const ids = steamids.split(',')

  try {
    const players = await getPlayerSummaries(ids)
    return NextResponse.json({ players })
  } catch (err: any) {
    console.error('Error en getPlayerSummaries:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
