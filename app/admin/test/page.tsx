'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'

export default function TestAdminPage() {
  const [user, setUser] = useState<any>(null)
  const [localStorageData, setLocalStorageData] = useState<string>('')

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gentum_user')
      setLocalStorageData(stored || 'No hay datos')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🔍 Diagnóstico de Admin</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold mb-2">Usuario Actual (getCurrentUser):</h2>
            <pre className="text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : 'null - No hay usuario'}
            </pre>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold mb-2">Datos en localStorage:</h2>
            <pre className="text-sm overflow-auto">
              {localStorageData}
            </pre>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold mb-2">Verificación de Rol:</h2>
            <p className="text-sm">
              {user ? (
                <>
                  Rol actual: <strong>{user.role || 'no definido'}</strong><br />
                  {user.role === 'admin' || user.role === 'host' ? (
                    <span className="text-green-600">✅ Tienes acceso al panel</span>
                  ) : (
                    <span className="text-red-600">❌ No tienes acceso (necesitas rol 'admin' o 'host')</span>
                  )}
                </>
              ) : (
                <span className="text-red-600">❌ No hay usuario autenticado</span>
              )}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h2 className="font-semibold mb-2">Acciones Rápidas:</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const adminUser = {
                    id: 'admin-test',
                    email: 'admin@gentum.ar',
                    name: 'Admin Test',
                    role: 'admin'
                  }
                  localStorage.setItem('gentum_user', JSON.stringify(adminUser))
                  window.location.href = '/admin'
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Crear Usuario Admin Temporal
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('gentum_user')
                  window.location.reload()
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
              >
                Limpiar localStorage
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-2"
              >
                Ir a Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

