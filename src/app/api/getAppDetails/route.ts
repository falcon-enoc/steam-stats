// src/app/api/getAppDetails/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAppDetails } from '../../services/steamStoreService'

/**
 * Ruta API para obtener detalles de juegos de Steam
 * Acepta múltiples appids separados por comas en query params
 * Ejemplo: /api/getAppDetails?appids=570,730,440
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appidsParam = searchParams.get('appids')
    
    if (!appidsParam) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro appids' },
        { status: 400 }
      )
    }

    // Parsear los appids (pueden ser uno o varios separados por comas)
    const appids = appidsParam.split(',').map(id => id.trim()).filter(id => id)
    
    if (appids.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron appids válidos' },
        { status: 400 }
      )
    }

    console.log(`Fetching Steam app details for: ${appids.join(', ')}`)
    
    // Usar el servicio para obtener los detalles
    const appDetailsData = await getAppDetails(appids)

    return NextResponse.json(appDetailsData)

  } catch (error) {
    console.error('Error fetching Steam app details:', error)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al obtener detalles del juego',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}