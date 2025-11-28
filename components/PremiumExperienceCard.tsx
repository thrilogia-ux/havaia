'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StarIcon, MapPinIcon, ClockIcon, UsersIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import TableVisualization from './TableVisualization'
import type { PremiumExperience, PremiumExperienceDate } from '@/lib/premium-experiences'
import { getNextAvailableDate } from '@/lib/premium-experiences'

interface PremiumExperienceCardProps {
  experience: PremiumExperience
  featured?: boolean
}

export default function PremiumExperienceCard({ experience, featured = false }: PremiumExperienceCardProps) {
  // Obtener fechas disponibles (futuras y ordenadas)
  const getAvailableDates = (): PremiumExperienceDate[] => {
    if (!experience.dates || experience.dates.length === 0) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return experience.dates
      .filter(dateInfo => {
        const date = new Date(dateInfo.date)
        date.setHours(0, 0, 0, 0)
        return date >= today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8) // Solo próximas 8 semanas
  }

  const availableDates = getAvailableDates()
  
  // Estado para la fecha seleccionada
  const [selectedDateInfo, setSelectedDateInfo] = useState<PremiumExperienceDate | null>(null)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  // Inicializar con la próxima fecha disponible
  useEffect(() => {
    if (availableDates.length > 0) {
      // Si hay una fecha en la experiencia, usarla, sino la primera disponible
      const initialDate = experience.date 
        ? availableDates.find(d => d.date === experience.date) || availableDates[0]
        : availableDates[0]
      setSelectedDateInfo(initialDate)
    } else {
      // Si no hay fechas disponibles, usar datos de la experiencia directamente
      const nextDate = getNextAvailableDate(experience)
      if (nextDate) {
        setSelectedDateInfo(nextDate)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.id, experience.date])

  // Usar datos de la fecha seleccionada
  const reservedSeats = selectedDateInfo?.reservedSeats || experience.reservedSeats || 0
  const availableSeats = experience.maxSeats - reservedSeats
  const percentageFilled = (reservedSeats / experience.maxSeats) * 100
  const displayDate = selectedDateInfo?.date || experience.date || 'Fecha por confirmar'
  const reservations = selectedDateInfo?.reservations || experience.reservations || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    }
    return date.toLocaleDateString('es-AR', options)
  }

  const handleDateSelect = (dateInfo: PremiumExperienceDate) => {
    setSelectedDateInfo(dateInfo)
    setShowDateDropdown(false)
  }

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border-2 ${featured ? 'border-primary-500' : 'border-gray-200'} transition-all hover:shadow-xl`}>
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop`
          }}
        />
        {featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            ⭐ Destacada
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${experience.price.toLocaleString('es-AR')}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-bold text-xl mb-1">{experience.title}</h3>
          <p className="text-white/90 text-sm">{experience.restaurant}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Rating y ubicación */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(experience.rating) ? (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
              ) : (
                <StarIconOutline key={i} className="w-5 h-5 text-gray-300" />
              )
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {experience.rating} ({experience.reviews} reseñas)
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span>{experience.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <div className="flex-1">
              {/* Dropdown de fechas */}
              {availableDates.length > 1 ? (
                <div className="relative z-30">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center gap-2 text-left hover:text-primary-600 transition-colors"
                  >
                    <span>{formatDate(displayDate)} a las {experience.time}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDateDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDateDropdown(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-h-60 overflow-y-auto">
                        {availableDates.map((dateInfo) => {
                          const isFull = dateInfo.reservedSeats >= experience.maxSeats
                          const isSelected = dateInfo.date === selectedDateInfo?.date
                          const available = experience.maxSeats - dateInfo.reservedSeats
                          
                          return (
                            <button
                              key={dateInfo.date}
                              onClick={() => handleDateSelect(dateInfo)}
                              disabled={isFull}
                              className={`
                                w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0
                                transition-colors
                                ${isSelected 
                                  ? 'bg-primary-50 text-primary-700 font-semibold' 
                                  : isFull
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'hover:bg-gray-50 text-gray-700'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{formatDate(dateInfo.date)}</span>
                                {isSelected && (
                                  <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                                    Seleccionada
                                  </span>
                                )}
                              </div>
                              <div className="text-xs mt-1">
                                {isFull ? (
                                  <span className="text-red-500">Completo</span>
                                ) : (
                                  <span className="text-gray-500">{available} lugares disponibles</span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <span>{formatDate(displayDate)} a las {experience.time}</span>
              )}
            </div>
          </div>
        </div>

        {/* Visualización de mesa */}
        <div className="mb-4">
          <TableVisualization
            maxSeats={experience.maxSeats}
            reservedSeats={reservedSeats}
            reservations={reservations}
          />
        </div>

        {/* Progreso */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Lugares disponibles</span>
            <span className="text-primary-600 font-bold">{availableSeats} de {experience.maxSeats}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{experience.description}</p>
        </div>

        {/* Botón */}
        <Link
          href={`/experiencias-premium/${experience.id}${selectedDateInfo?.date ? `?date=${selectedDateInfo.date}` : ''}`}
          className="block w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white text-center py-3 rounded-full font-semibold transition-all hover:shadow-lg"
        >
          {availableSeats > 0 ? 'Reservar lugar' : 'Lista de espera'}
        </Link>
      </div>
    </div>
  )
}

