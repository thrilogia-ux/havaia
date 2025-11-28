'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getFavorites } from '@/lib/favorites'
import { experienciasData } from '@/lib/data'
import { MapPinIcon, ClockIcon, LanguageIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import EmptyState from '@/components/EmptyState'

export default function FavoritosPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [favorites, setFavorites] = useState(getFavorites())
  const [experiencias, setExperiencias] = useState(
    experienciasData.filter(exp => favorites.some(f => f.experienciaId === exp.id))
  )

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    const favs = getFavorites()
    setFavorites(favs)
    setExperiencias(experienciasData.filter(exp => favs.some(f => f.experienciaId === exp.id)))
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
          <p className="text-lg text-gray-600">
            {experiencias.length} {experiencias.length === 1 ? 'experiencia guardada' : 'experiencias guardadas'}
          </p>
        </div>

        {experiencias.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiencias.map(exp => (
              <Link
                key={exp.id}
                href={`/experiencias/${exp.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 flex items-center justify-center text-6xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {exp.image}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 font-semibold">{exp.category}</span>
                    <span className="text-sm text-gray-500">⭐ {exp.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{exp.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{exp.spots.available} de {exp.spots.total} cupos disponibles</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-2xl font-bold text-gray-900">${exp.price}</span>
                    <span className="text-primary-600 font-semibold">Ver más →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="❤️"
            title="Aún no tenés favoritos"
            description="Guardá tus experiencias favoritas haciendo clic en el corazón para encontrarlas fácilmente después"
            action={{
              label: 'Explorar experiencias',
              onClick: () => router.push('/experiencias')
            }}
          />
        )}
      </div>
    </div>
  )
}




