'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import TableVisualization from '@/components/TableVisualization'
import { getPremiumExperienceById, reservePremiumExperience, cancelPremiumReservation, getNextAvailableDate } from '@/lib/premium-experiences'
import PremiumExperienceCalendar from '@/components/PremiumExperienceCalendar'
import { getCurrentUser } from '@/lib/auth'
import { showToast } from '@/components/ToastContainer'
import { 
  StarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PremiumExperienceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const experienceId = parseInt(params.id)
  const user = getCurrentUser()
  
  const [experience, setExperience] = useState<any>(null)
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasReservation, setHasReservation] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadExperience()
  }, [experienceId])

  const loadExperience = () => {
    try {
      setPageLoading(true)
      
      // Leer fecha de la URL si está presente
      const urlParams = new URLSearchParams(window.location.search)
      const dateFromUrl = urlParams.get('date')
      
      // Usar la función local directamente, con fecha si está en la URL
      const exp = getPremiumExperienceById(experienceId, dateFromUrl || undefined)
      
      if (!exp) {
        showToast('Experiencia no encontrada', 'error')
        router.push('/experiencias-premium')
        return
      }
      
      setExperience(exp)

      // Establecer la fecha seleccionada
      if (dateFromUrl) {
        // Si viene de la URL, usar esa fecha
        setSelectedDate(dateFromUrl)
      } else if (exp.dates && exp.dates.length > 0) {
        // Si no, usar la próxima disponible
        const nextDate = getNextAvailableDate(exp)
        if (nextDate) {
          setSelectedDate(nextDate.date)
        }
      } else if (exp.date) {
        setSelectedDate(exp.date)
      }

      if (user) {
        // Buscar reserva en todas las fechas
        let foundReservation = false
        if (exp.dates) {
          for (const dateInfo of exp.dates) {
            const reservation = dateInfo.reservations?.find((r: any) => r.userId === user.id)
            if (reservation) {
              foundReservation = true
              // Si no hay fecha seleccionada de la URL, usar la fecha de la reserva
              if (!dateFromUrl) {
                setSelectedDate(dateInfo.date)
              }
              break
            }
          }
        } else {
          const reservation = exp.reservations?.find((r: any) => r.userId === user.id)
          foundReservation = !!reservation
        }
        setHasReservation(foundReservation)
      }
    } catch (error) {
      console.error('Error cargando experiencia:', error)
      showToast('Error al cargar la experiencia', 'error')
      router.push('/experiencias-premium')
    } finally {
      setPageLoading(false)
    }
  }

  if (pageLoading || !experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando experiencia...</p>
        </div>
      </div>
    )
  }

  const handleReserve = async () => {
    if (!user) {
      showToast('Necesitás iniciar sesión para reservar', 'error')
      router.push('/login')
      return
    }

    if (seats > experience.maxSeats - experience.reservedSeats) {
      showToast('No hay suficientes lugares disponibles', 'error')
      return
    }

    setLoading(true)

    if (!selectedDate) {
      showToast('Seleccioná una fecha para reservar', 'error')
      return
    }

    try {
      // Usar la función local directamente (más simple y confiable)
      const success = reservePremiumExperience(
        experience.id,
        user.id,
        user.name,
        user.avatar || undefined,
        seats,
        selectedDate
      )

      if (success) {
        showToast(`¡Reserva confirmada! ${seats} lugar${seats > 1 ? 'es' : ''} reservado${seats > 1 ? 's' : ''}`, 'success')
        
        // Recargar la experiencia para ver los cambios actualizados
        const updatedExp = getPremiumExperienceById(experience.id, selectedDate)
        if (updatedExp) {
          setExperience(updatedExp)
          setHasReservation(true)
        }
        
        // Simular redirección a pago (en producción sería a MercadoPago/PayPal)
        setTimeout(() => {
          showToast('Redirigiendo al pago...', 'info')
          // En producción: router.push('/api/payments/checkout?type=premium&id=' + experience.id + '&seats=' + seats)
        }, 1000)
      } else {
        showToast('Error al realizar la reserva. No hay suficientes lugares disponibles.', 'error')
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al realizar la reserva'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!user || !experience) return

    setLoading(true)
    try {
      // Usar la función local directamente
      const success = cancelPremiumReservation(experience.id, user.id)

      if (success) {
        showToast('Reserva cancelada', 'success')
        
        // Recargar la experiencia
        const updatedExp = getPremiumExperienceById(experience.id)
        if (updatedExp) {
          setExperience(updatedExp)
          setHasReservation(false)
        }
      } else {
        showToast('Error al cancelar la reserva', 'error')
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al cancelar la reserva'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const availableSeats = experience.maxSeats - experience.reservedSeats

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Botón volver */}
          <Link
            href="/experiencias-premium"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver a experiencias premium</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna izquierda - Imagen y detalles */}
            <div>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                <div className="relative h-96">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop`
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full font-bold">
                    ${experience.price.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              {/* Detalles */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalles</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Ubicación</p>
                      <p className="text-gray-600">{experience.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Fecha y hora</p>
                      <p className="text-gray-600">{experience.date} a las {experience.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(experience.rating) ? (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIconOutline key={i} className="w-5 h-5 text-gray-300" />
                      )
                    ))}
                    <span className="text-gray-600">
                      {experience.rating} ({experience.reviews} reseñas)
                    </span>
                  </div>
                </div>

                {/* Incluye */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Incluye</h3>
                  <ul className="space-y-2">
                    {experience.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Destacados</h3>
                  <ul className="space-y-2">
                    {experience.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <StarIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna derecha - Reserva */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{experience.restaurant}</p>
                
                <p className="text-gray-700 mb-6">{experience.description}</p>

                {/* Calendario de fechas */}
                <div className="mb-6">
                  <PremiumExperienceCalendar
                    experience={experience}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setSelectedDate(date)
                      // Recargar experiencia con la fecha seleccionada
                      const expWithDate = getPremiumExperienceById(experience.id, date)
                      if (expWithDate) {
                        setExperience(expWithDate)
                        if (user) {
                          const reservation = expWithDate.reservations?.find((r: any) => r.userId === user.id)
                          setHasReservation(!!reservation)
                        }
                      }
                    }}
                  />
                </div>

                {/* Visualización de mesa */}
                <div className="mb-6">
                  <TableVisualization
                    maxSeats={experience.maxSeats}
                    reservedSeats={experience.reservedSeats}
                    reservations={experience.reservations}
                    currentUserId={user?.id}
                  />
                </div>

                {/* Progreso */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Lugares disponibles</span>
                    <span className="text-primary-600 font-bold text-lg">
                      {availableSeats} de {experience.maxSeats}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(experience.reservedSeats / experience.maxSeats) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Reserva */}
                {hasReservation ? (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
                    <p className="text-green-800 font-semibold mb-2">✅ Tenés una reserva confirmada</p>
                    <button
                      onClick={handleCancel}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancelar reserva
                    </button>
                  </div>
                ) : (
                  <>
                    {availableSeats > 0 ? (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cantidad de lugares
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSeats(Math.max(1, seats - 1))}
                            disabled={seats <= 1}
                            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold text-gray-900 w-12 text-center">{seats}</span>
                          <button
                            onClick={() => setSeats(Math.min(availableSeats, seats + 1))}
                            disabled={seats >= availableSeats}
                            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                          <span className="text-sm text-gray-600 ml-auto">
                            ${(experience.price * seats).toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 font-semibold">⚠️ No hay lugares disponibles</p>
                        <p className="text-sm text-yellow-700 mt-1">Podés unirte a la lista de espera</p>
                      </div>
                    )}

                    <button
                      onClick={handleReserve}
                      disabled={loading || availableSeats === 0 || !user}
                      className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Procesando...' : availableSeats > 0 ? 'Reservar y pagar' : 'Lista de espera'}
                    </button>

                    {!user && (
                      <p className="text-sm text-gray-600 text-center mt-4">
                        <Link href="/login" className="text-primary-600 hover:underline">
                          Iniciá sesión
                        </Link> para reservar
                      </p>
                    )}
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    El precio incluye la experiencia completa. Solo pagarás la propina en el lugar (opcional).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

