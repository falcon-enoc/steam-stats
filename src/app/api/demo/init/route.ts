import { NextResponse } from 'next/server'
import { startDemoSession } from '../../../lib/db'
import { getClientIp } from '../../../lib/resolveApiKey'

export async function POST(request: Request) {
  // CSRF: el browser siempre envía Origin en requests cross-site.
  // Si Origin está presente y no coincide con el host, rechazar.
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (origin && host) {
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`,
    ]
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

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
