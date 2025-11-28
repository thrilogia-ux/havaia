import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-middleware'
import { createAdminUser, createHostUser } from '@/lib/create-admin'

export const dynamic = 'force-dynamic'

// Crear usuario admin o host (solo para admins)
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const { email, name, role, password } = body
    
    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Email, nombre y rol son requeridos' }, { status: 400 })
    }
    
    if (role !== 'admin' && role !== 'host') {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
    }
    
    let result
    if (role === 'admin') {
      result = createAdminUser(email, name, password)
    } else {
      result = createHostUser(email, name, password)
    }
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin/create-user:', error)
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}

