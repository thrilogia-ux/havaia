import { NextRequest, NextResponse } from 'next/server'
import { getGrupos, getGrupoById, saveGrupo, updateGrupo } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (id) {
      const grupo = getGrupoById(parseInt(id))
      if (!grupo) {
        return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
      }
      return NextResponse.json(grupo)
    }
    
    let grupos = getGrupos()
    
    // Filtrar por usuario si se especifica
    if (userId) {
      grupos = grupos.filter((g: any) => g.coordinadorId === userId)
    }
    
    return NextResponse.json(grupos)
  } catch (error) {
    console.error('Error en GET /api/grupos:', error)
    return NextResponse.json({ error: 'Error al obtener grupos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const grupo = {
      ...body,
      id: Date.now(),
      createdAt: Date.now(),
    }
    
    const saved = saveGrupo(grupo)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/grupos:', error)
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = updateGrupo(body)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error en PUT /api/grupos:', error)
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 })
  }
}


