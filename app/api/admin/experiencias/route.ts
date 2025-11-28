import { NextRequest, NextResponse } from 'next/server'
import { getExperiencias, getExperienciaById, saveExperiencia } from '@/lib/db'
import { requireAdminOrHost, unauthorizedResponse } from '@/lib/auth-middleware'

// Obtener todas las experiencias (admin/host)
export async function GET(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const experiencias = getExperiencias()
    
    // Si es host, solo mostrar sus experiencias
    if (user.role === 'host') {
      const filtered = experiencias.filter((e: any) => {
        const exp = e as any
        return exp.host?.email === user.email || exp.hostId === user.id
      })
      return NextResponse.json(filtered)
    }
    
    return NextResponse.json(experiencias)
  } catch (error) {
    console.error('Error en GET /api/admin/experiencias:', error)
    return NextResponse.json({ error: 'Error al obtener experiencias' }, { status: 500 })
  }
}

// Crear nueva experiencia
export async function POST(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const experiencia = {
      ...(body as Record<string, unknown>),
      id: Date.now(),
      createdAt: Date.now(),
      hostId: user.id,
      host: {
        ...((body as any).host as Record<string, unknown> || {}),
        email: user.email,
        name: user.name,
      },
      status: body.status || 'pending', // pending, approved, rejected
    }
    
    const saved = saveExperiencia(experiencia)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin/experiencias:', error)
    return NextResponse.json({ error: 'Error al crear experiencia' }, { status: 500 })
  }
}

// Actualizar experiencia
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const experiencia = getExperienciaById(body.id)
    
    if (!experiencia) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
    }
    
    // Si es host, solo puede editar sus propias experiencias
    const exp = experiencia as any
    if (user.role === 'host' && exp.hostId !== user.id && exp.host?.email !== user.email) {
      return NextResponse.json({ error: 'No tienes permisos para editar esta experiencia' }, { status: 403 })
    }
    
    const updated = {
      ...(exp as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    }
    
    const saved = saveExperiencia(updated)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error en PUT /api/admin/experiencias:', error)
    return NextResponse.json({ error: 'Error al actualizar experiencia' }, { status: 500 })
  }
}

// Eliminar experiencia
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const experiencia = getExperienciaById(parseInt(id))
    
    if (!experiencia) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
    }
    
    // Si es host, solo puede eliminar sus propias experiencias
    const exp = experiencia as any
    if (user.role === 'host' && exp.hostId !== user.id && exp.host?.email !== user.email) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar esta experiencia' }, { status: 403 })
    }
    
    // Eliminar experiencia (en producción sería soft delete)
    const experiencias = getExperiencias()
    const filtered = experiencias.filter((e: any) => e.id !== parseInt(id))
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'experiencias.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/experiencias:', error)
    return NextResponse.json({ error: 'Error al eliminar experiencia' }, { status: 500 })
  }
}

