import { NextResponse } from 'next/server'
import { startDemoSession } from '../../../lib/db'

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(request: Request) {
  const demoId = process.env.STEAM_DEMO_ID
  if (!demoId) {
    return NextResponse.json({ error: 'Demo no disponible' }, { status: 503 })
  }

  const ip = getClientIp(request)
  const ok = startDemoSession(ip)

  if (!ok) {
    console.warn(`[demo/init] Rate limited: ${ip}`)
    return NextResponse.json(
      { error: 'Demo ya utilizado. Ingresa tu propia API key de Steam para continuar.' },
      { status: 429 }
    )
  }

  console.log(`[demo/init] Session started: ${ip}`)
  return NextResponse.json({ steamId: demoId })
}
