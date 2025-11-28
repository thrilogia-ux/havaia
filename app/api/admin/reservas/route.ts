import { NextRequest, NextResponse } from 'next/server'
import { getReservas, getReservaById, saveReserva } from '@/lib/db'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-middleware'

// Obtener todas las reservas (solo admin)
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const reservas = getReservas()
    return NextResponse.json(reservas)
  } catch (error) {
    console.error('Error en GET /api/admin/reservas:', error)
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}

// Actualizar reserva
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const reserva = getReservaById(body.id)
    
    if (!reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }
    
    const updated = {
      ...(reserva as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    }
    
    const saved = saveReserva(updated)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error en PUT /api/admin/reservas:', error)
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 })
  }
}

// Eliminar reserva
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const reservas = getReservas()
    const filtered = reservas.filter((r: any) => r.id !== parseInt(id))
    
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'reservas.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/reservas:', error)
    return NextResponse.json({ error: 'Error al eliminar reserva' }, { status: 500 })
  }
}

