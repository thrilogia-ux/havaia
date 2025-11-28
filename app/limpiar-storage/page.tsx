'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { showToast } from '@/components/ToastContainer'

export default function LimpiarStoragePage() {
  const [cleaned, setCleaned] = useState(false)

  const handleClean = () => {
    try {
      // Limpiar datos grandes de localStorage
      const keysToClean = [
        'gentum_premium_experiences',
        'gentum_stories',
        'gentum_posts'
      ]
      
      let cleanedCount = 0
      keysToClean.forEach(key => {
        try {
          const data = localStorage.getItem(key)
          if (data && data.length > 100000) { // >100KB
            localStorage.removeItem(key)
            cleanedCount++
          }
        } catch (e) {
          // Ignorar
        }
      })
      
      // Limpiar imágenes base64 grandes de usuarios
      try {
        const users = JSON.parse(localStorage.getItem('gentum_users') || '[]')
        const cleanedUsers = users.map((u: any) => ({
          ...u,
          avatar: u.avatar && u.avatar.startsWith('data:') ? '' : u.avatar
        }))
        localStorage.setItem('gentum_users', JSON.stringify(cleanedUsers))
        cleanedCount++
      } catch (e) {
        // Ignorar
      }
      
      showToast(`Limpieza completada. Se limpiaron ${cleanedCount} elementos grandes.`, 'success')
      setCleaned(true)
    } catch (error) {
      showToast('Error al limpiar el almacenamiento', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Limpiar Almacenamiento</h1>
          <p className="text-gray-600 mb-6">
            Si estás experimentando problemas de almacenamiento, esta herramienta limpiará datos grandes 
            del navegador para liberar espacio.
          </p>
          
          {!cleaned ? (
            <button
              onClick={handleClean}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Limpiar Almacenamiento
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✓ Limpieza completada</p>
              <p className="text-green-700 text-sm mt-2">
                Recarga la página para ver los cambios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

