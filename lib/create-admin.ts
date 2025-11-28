// Script para crear usuarios admin/host iniciales
// Ejecutar desde el servidor o API

import { getUsuarios, saveUsuario } from './db'

export function createAdminUser(email: string, name: string, password?: string) {
  const usuarios = getUsuarios()
  
  // Verificar si ya existe
  const exists = usuarios.find((u: any) => u.email === email)
  if (exists) {
    return { error: 'El usuario ya existe' }
  }
  
  const admin = {
    id: Date.now().toString(),
    email,
    name,
    role: 'admin' as const,
    createdAt: Date.now(),
    // En producción, password debería ser hasheado
    password: password || 'admin123',
  }
  
  saveUsuario(admin)
  return { success: true, user: admin }
}

export function createHostUser(email: string, name: string, password?: string) {
  const usuarios = getUsuarios()
  
  // Verificar si ya existe
  const exists = usuarios.find((u: any) => u.email === email)
  if (exists) {
    return { error: 'El usuario ya existe' }
  }
  
  const host = {
    id: Date.now().toString(),
    email,
    name,
    role: 'host' as const,
    createdAt: Date.now(),
    // En producción, password debería ser hasheado
    password: password || 'host123',
  }
  
  saveUsuario(host)
  return { success: true, user: host }
}

