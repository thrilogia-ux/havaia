import { NextRequest, NextResponse } from 'next/server'
import { getMensajes, addMensaje } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mensajes = getMensajes(parseInt(id))
    return NextResponse.json(mensajes)
  } catch (error) {
    console.error('Error en GET /api/grupos/[id]/mensajes:', error)
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const mensaje = {
      ...body,
      id: Date.now(),
      grupoId: parseInt(id),
      timestamp: Date.now(),
    }
    
    const saved = addMensaje(mensaje)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/grupos/[id]/mensajes:', error)
    return NextResponse.json({ error: 'Error al crear mensaje' }, { status: 500 })
  }
}


