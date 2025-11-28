import { NextRequest, NextResponse } from 'next/server'
import { getGrupoById, updateGrupo } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const grupo = getGrupoById(parseInt(id))
    
    if (!grupo) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(grupo)
  } catch (error) {
    console.error('Error en GET /api/grupos/[id]:', error)
    return NextResponse.json({ error: 'Error al obtener grupo' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const grupo = {
      ...body,
      id: parseInt(id),
    }
    
    const updated = updateGrupo(grupo)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error en PUT /api/grupos/[id]:', error)
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 })
  }
}


