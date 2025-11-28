import { NextRequest, NextResponse } from 'next/server'
import { getReservas } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    let reservas = getReservas()
    
    // Filtrar por usuario si se especifica
    if (userId) {
      reservas = reservas.filter((r: any) => r.userId === userId)
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    reservas.sort((a: any, b: any) => b.createdAt - a.createdAt)
    
    return NextResponse.json(reservas)
  } catch (error) {
    console.error('Error en GET /api/reservas:', error)
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}


