import { NextRequest, NextResponse } from 'next/server'
import { getGrupos, getGrupoById, saveGrupo } from '@/lib/db'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-middleware'

// Obtener todos los grupos (solo admin)
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const grupos = getGrupos()
    return NextResponse.json(grupos)
  } catch (error) {
    console.error('Error en GET /api/admin/grupos:', error)
    return NextResponse.json({ error: 'Error al obtener grupos' }, { status: 500 })
  }
}

// Actualizar grupo
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const grupo = getGrupoById(body.id)
    
    if (!grupo) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
    }
    
    const updated = {
      ...(grupo as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    }
    
    const saved = saveGrupo(updated)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error en PUT /api/admin/grupos:', error)
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 })
  }
}

// Eliminar grupo
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
    
    const grupos = getGrupos()
    const filtered = grupos.filter((g: any) => g.id !== parseInt(id))
    
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'grupos.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/grupos:', error)
    return NextResponse.json({ error: 'Error al eliminar grupo' }, { status: 500 })
  }
}

