// Middleware para autenticación en APIs
import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios } from './db'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'host'
}

// Obtener usuario desde el header de autorización
export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '')
  // En producción esto sería un JWT real
  // Por ahora, el token es el userId
  const usuarios = getUsuarios()
  const usuario = usuarios.find((u: any) => u.id === token) as any
  
  if (!usuario) {
    return null
  }
  
  return {
    id: usuario.id,
    email: usuario.email,
    name: usuario.name,
    role: usuario.role || 'user'
  }
}

// Verificar si el usuario es admin
export function requireAdmin(request: NextRequest): AuthUser | null {
  const user = getAuthUser(request)
  
  if (!user || user.role !== 'admin') {
    return null
  }
  
  return user
}

// Verificar si el usuario es admin o host
export function requireAdminOrHost(request: NextRequest): AuthUser | null {
  const user = getAuthUser(request)
  
  if (!user || (user.role !== 'admin' && user.role !== 'host')) {
    return null
  }
  
  return user
}

// Respuesta de error de autenticación
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'No autorizado' },
    { status: 401 }
  )
}

// Respuesta de error de permisos
export function forbiddenResponse() {
  return NextResponse.json(
    { error: 'No tienes permisos para realizar esta acción' },
    { status: 403 }
  )
}

