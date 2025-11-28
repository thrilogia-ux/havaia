import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, getUsuarioById, saveUsuario } from '@/lib/db'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

// Obtener todos los usuarios (solo admin)
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const usuarios = getUsuarios()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error en GET /api/admin/usuarios:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

// Actualizar usuario
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const usuario = getUsuarioById(body.id)
    
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    const updated = {
      ...(usuario as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    }
    
    const saved = saveUsuario(updated)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error en PUT /api/admin/usuarios:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

// Eliminar usuario
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
    
    // No permitir eliminar el propio usuario admin
    if (id === user.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propio usuario' }, { status: 400 })
    }
    
    const usuarios = getUsuarios()
    const filtered = usuarios.filter((u: any) => u.id !== id)
    
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'usuarios.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/usuarios:', error)
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}

