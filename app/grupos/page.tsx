'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { getGrupos, experienciasData, type Grupo } from '@/lib/data'
import { 
  UserGroupIcon,
  CalendarDaysIcon,
  MapPinIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])

  useEffect(() => {
    setGrupos(getGrupos())
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Grupos</h1>
              <p className="text-lg text-gray-600">
                Unite a grupos existentes o creá el tuyo
              </p>
            </div>
            <Link
              href="/grupos/crear"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Crear grupo
            </Link>
          </div>
        </div>

        {grupos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grupos.map(grupo => {
              const experiencia = experienciasData.find(e => e.id === grupo.experienciaId)
              return (
                <Link
                  key={grupo.id}
                  href={`/grupos/${grupo.id}`}
                  className="bg-white rounded-xl shadow-lg p-6 hover-lift"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{grupo.name}</h3>
                    {grupo.privacidad === 'privado' ? (
                      <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{grupo.experiencia}</p>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{grupo.fecha} - {grupo.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{grupo.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{grupo.spots.confirmados} de {grupo.spots.total} miembros</span>
                      <span className="text-primary-600">• {grupo.spots.disponibles} cupos libres</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-primary-600 font-semibold">Ver grupo →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
            <div className="text-8xl mb-6 animate-float">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aún no hay grupos</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Creá el primer grupo para una experiencia y conectá con otros viajeros
            </p>
            <Link
              href="/grupos/crear"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover-lift shadow-lg"
            >
              Crear primer grupo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

