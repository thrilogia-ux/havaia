import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, saveUsuario } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // En producción esto sería con hash de contraseñas
    const usuarios = getUsuarios()
    let usuario = usuarios.find((u: any) => u.email === email)
    
    // Si no existe, crear uno nuevo (simulación)
    if (!usuario) {
      usuario = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'user',
        createdAt: Date.now(),
      } as any
      saveUsuario(usuario)
    }
    
    // En producción verificar password aquí
    
    // Verificar que usuario existe (para TypeScript)
    if (!usuario) {
      return NextResponse.json({ error: 'Error al crear o encontrar usuario' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      user: usuario,
      token: (usuario as any).id // El token es el userId para simplificar
    })
  } catch (error) {
    console.error('Error en POST /api/auth/login:', error)
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}


