import { NextResponse } from 'next/server'
import { getHistoricalPrices } from '../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const appidsParam = searchParams.get('appids')

  if (!appidsParam) {
    return NextResponse.json(
      { error: 'El parámetro appids es requerido' },
      { status: 400 }
    )
  }

  const appids = appidsParam.split(',').map(id => id.trim()).filter(id => id)

  if (appids.length > 50) {
    return NextResponse.json(
      { error: `Too many appids: ${appids.length}. Maximum allowed is 50` },
      { status: 400 }
    )
  }

  for (const id of appids) {
    const num = Number(id)
    if (!Number.isInteger(num) || num <= 0) {
      return NextResponse.json(
        { error: `Invalid appid: '${id}' is not a positive integer` },
        { status: 400 }
      )
    }
  }

  const numericAppids = appids.map(Number)
  const prices = getHistoricalPrices(numericAppids)

  return NextResponse.json(prices)
}
