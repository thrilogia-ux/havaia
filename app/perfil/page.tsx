'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { getCurrentUser, setCurrentUser, logout, type User } from '@/lib/auth'
import { getGrupos } from '@/lib/data'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import { showToast } from '@/components/ToastContainer'
import { 
  UserCircleIcon, 
  CalendarDaysIcon, 
  MapPinIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(getCurrentUser())
  const [misGrupos, setMisGrupos] = useState(getGrupos().filter(g => g.coordinadorId === user?.id))
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    city: user?.city || '',
    country: user?.country || 'Israel'
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    setEditData({
      name: currentUser.name || '',
      city: currentUser.city || '',
      country: currentUser.country || 'Israel'
    })
    setMisGrupos(getGrupos().filter(g => g.coordinadorId === currentUser.id))
  }, [router])

  const handleAvatarUpload = (imageUrl: string) => {
    if (!user) return
    
    // Optimizar: si es base64 muy grande, comprimir o usar solo URL
    let optimizedAvatar = imageUrl
    
    // Si es base64 y muy grande (>100KB), no guardarlo directamente
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      const sizeInBytes = (imageUrl.length * 3) / 4
      if (sizeInBytes > 100000) { // >100KB
        // En producción, aquí subirías a un servicio de imágenes (Cloudinary, S3, etc.)
        // Por ahora, mostramos un warning y no guardamos la imagen grande
        showToast('La imagen es muy grande. En producción se subiría a un servidor.', 'warning')
        // Guardamos solo una referencia
        optimizedAvatar = '' // No guardar base64 grande
      }
    }
    
    const updatedUser = {
      ...user,
      avatar: optimizedAvatar || undefined
    }
    
    setCurrentUser(updatedUser)
    setUser(updatedUser)
    
    // Actualizar también en el backend si existe
    if (typeof window !== 'undefined') {
      try {
        const users = JSON.parse(localStorage.getItem('gentum_users') || '[]')
        const updatedUsers = users.map((u: User) => 
          u.id === user.id ? updatedUser : u
        )
        localStorage.setItem('gentum_users', JSON.stringify(updatedUsers))
      } catch (error) {
        console.error('Error guardando usuario:', error)
        // Si falla por espacio, limpiar datos antiguos
        try {
          localStorage.removeItem('gentum_premium_experiences')
        } catch (e) {
          // Ignorar
        }
      }
    }
  }

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: editData.name,
      city: editData.city,
      country: editData.country
    }

    setCurrentUser(updatedUser)
    setUser(updatedUser)
    setIsEditing(false)
    showToast('Perfil actualizado', 'success')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header del perfil */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-start gap-6">
              {/* Foto de perfil con upload */}
              <div className="flex-shrink-0">
                <ProfilePhotoUpload
                  currentAvatar={user.avatar}
                  userName={user.name}
                  onUpload={handleAvatarUpload}
                  size="lg"
                />
              </div>

              {/* Información del usuario */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          País
                        </label>
                        <input
                          type="text"
                          value={editData.country}
                          onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditData({
                            name: user.name || '',
                            city: user.city || '',
                            country: user.country || 'Israel'
                          })
                        }}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Editar perfil
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      {user.city && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5" />
                          <span>{user.city}{user.country && `, ${user.country}`}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mis grupos */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis grupos</h2>
            {misGrupos.length > 0 ? (
              <div className="space-y-4">
                {misGrupos.map(grupo => (
                  <Link
                    key={grupo.id}
                    href={`/grupos/${grupo.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{grupo.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>{grupo.fecha} - {grupo.horario}</span>
                          </div>
                          <span>{grupo.experiencia}</span>
                        </div>
                      </div>
                      <span className="text-primary-600 font-semibold">Ver grupo →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Aún no creaste ningún grupo</p>
                <Link
                  href="/experiencias"
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Explorar experiencias
                </Link>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-primary-600 mb-2">{misGrupos.length}</p>
              <p className="text-gray-600">Grupos creados</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-secondary-600 mb-2">0</p>
              <p className="text-gray-600">Experiencias completadas</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-3xl font-bold text-accent-600 mb-2">0</p>
              <p className="text-gray-600">Reseñas escritas</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Editar perfil
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Notificaciones
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Privacidad
              </button>
              <button
                onClick={() => {
                  logout()
                  router.push('/')
                  router.refresh()
                }}
                className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
