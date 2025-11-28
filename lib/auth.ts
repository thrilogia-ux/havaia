// Sistema de autenticación básico con localStorage

export interface User {
  id: string
  name: string
  email: string
  city?: string
  country?: string
  avatar?: string
  role?: 'user' | 'admin' | 'host'
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('gentum_user')
  return userStr ? JSON.parse(userStr) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_user', JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('gentum_user')
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}




