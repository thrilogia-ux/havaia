import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, saveUsuario } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, city, country } = await request.json()
    
    const usuarios = getUsuarios()
    
    // Verificar si el usuario ya existe
    if (usuarios.some((u: any) => u.email === email)) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }
    
    // Crear nuevo usuario
    const usuario = {
      id: Date.now().toString(),
      email,
      name,
      city,
      country,
      role: 'user',
      createdAt: Date.now(),
    } as any
    
    saveUsuario(usuario)
    
    return NextResponse.json({ 
      user: usuario,
      token: 'mock-token-' + usuario.id
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/auth/register:', error)
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}


