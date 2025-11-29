'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { 
  MapPinIcon, 
  ClockIcon, 
  LanguageIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { experienciasData, getGrupos } from '@/lib/data'
import FavoriteButton from '@/components/FavoriteButton'
import { getCurrentUser } from '@/lib/auth'
import { experienciasAPI, paymentsAPI } from '@/lib/api'
import { showToast } from '@/components/ToastContainer'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

type Slot = {
  date: string
  time: string
  available: boolean
}

export default function ExperienciaDetailPage({ params }: { params: { id: string } }) {
  const { locale } = useI18n()
  const experienciaId = parseInt(params.id)
  const [experiencia, setExperiencia] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  
  // Todos los hooks deben estar antes de cualquier return condicional
  const slots: Slot[] = [
    { date: '15 de Marzo', time: '19:00', available: true },
    { date: '16 de Marzo', time: '19:00', available: true },
    { date: '17 de Marzo', time: '19:00', available: false },
    { date: '18 de Marzo', time: '19:00', available: true },
    { date: '19 de Marzo', time: '19:00', available: true },
  ]
  
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(slots[0] || null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'paypal' | 'card'>('mercadopago')

  useEffect(() => {
    loadExperiencia()
  }, [experienciaId])

  const loadExperiencia = async () => {
    try {
      setLoading(true)
      const exp = await experienciasAPI.getById(experienciaId)
      if (exp) {
        setExperiencia(exp)
        setMainImage(exp.image || '')
      } else {
        // Fallback a datos locales si no se encuentra en la API
        const localExp = experienciasData.find(e => e.id === experienciaId)
        if (localExp) {
          setExperiencia(localExp)
          setMainImage(localExp.image || '')
        }
      }
    } catch (error) {
      console.error('Error cargando experiencia:', error)
      // Fallback a datos locales
      const localExp = experienciasData.find(e => e.id === experienciaId)
      if (localExp) {
        setExperiencia(localExp)
        setMainImage(localExp.image || '')
      }
    } finally {
      setLoading(false)
    }
  }

  // Obtener grupos activos después de que experiencia esté cargada
  const gruposActivos = experiencia ? getGrupos().filter(g => g.experienciaId === experienciaId) : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t(locale as Locale, 'exp_loading_detail')}</p>
        </div>
      </div>
    )
  }

  if (!experiencia) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'exp_not_found_detail')}</h1>
          <Link href="/experiencias" className="text-primary-600 hover:text-primary-700 font-semibold">
            {t(locale as Locale, 'exp_back_to_experiences')}
          </Link>
        </div>
      </div>
    )
  }

  const reviews = [
    { name: 'Itai', city: 'Tel Aviv', rating: 5, text: 'Increíble experiencia, la comida era deliciosa y María es una guía excepcional.' },
    { name: 'Sara', city: 'Jerusalem', rating: 5, text: 'Perfecto para conocer la cultura gastronómica kosher en Buenos Aires.' },
    { name: 'David', city: 'Haifa', rating: 4, text: 'Muy buena, solo esperaba un poco más de tiempo en cada parada.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero con imagen principal */}
        <div className="rounded-xl mb-4 text-white relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <img
              src={mainImage || experiencia.image}
              alt={experiencia.title}
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
          <div className="relative p-8 md:p-12">
            <div className="absolute top-6 right-6">
              <FavoriteButton experienciaId={experiencia.id} size="lg" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{experiencia.title}</h1>
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-3xl font-bold">${experiencia.price}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(experiencia.rating) ? 'text-yellow-400' : 'text-gray-500'}`}
                  />
                ))}
                <span className="ml-2 text-sm md:text-base">
                  {experiencia.rating} ({experiencia.reviews} {t(locale as Locale, 'exp_reviews')})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Galería de miniaturas */}
        {experiencia.gallery && experiencia.gallery.length > 1 && (
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {experiencia.gallery.map((url: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setMainImage(url)}
                className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  (mainImage || experiencia.image) === url ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <img
                  src={url}
                  alt={`${experiencia.title} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info rápida */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t(locale as Locale, 'exp_location')}</p>
                    <p className="font-semibold">{experiencia.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t(locale as Locale, 'exp_duration')}</p>
                    <p className="font-semibold">{experiencia.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t(locale as Locale, 'exp_language')}</p>
                    <p className="font-semibold">{experiencia.language}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t(locale as Locale, 'exp_spots')}</p>
                    <p className="font-semibold">{experiencia.spots.available} {t(locale as Locale, 'exp_spots_detail', { total: experiencia.spots.total })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_description')}</h2>
              <p className="text-gray-700 leading-relaxed">{experiencia.description}</p>
            </div>

            {/* Itinerario */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_itinerary')}</h2>
              <div className="space-y-3">
                {experiencia.itinerary.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Incluye / No incluye */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_includes')}</h2>
                <ul className="space-y-2">
                  {experiencia.includes.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_not_includes')}</h2>
                <ul className="space-y-2">
                  {experiencia.notIncludes.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <XMarkIcon className="w-5 h-5 text-red-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reseñas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_reviews_title')} ({experiencia.reviews})</h2>
              <div className="space-y-4">
                {reviews.map((review: any, idx: number) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <p className="text-sm text-gray-600">{review.city}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendario y Reserva */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{t(locale as Locale, 'exp_dates_available')}</h2>
              <div className="space-y-3">
                {slots.map((slot: any, idx: number) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      !slot.available
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-100 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{slot.date}</p>
                        <p className="text-sm text-gray-600">{slot.time}</p>
                      </div>
                      {slot.available && (
                        <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Métodos de pago (simulados) */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">{t(locale as Locale, 'exp_payment_method')}</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`px-3 py-2 rounded-lg border font-semibold ${
                      paymentMethod === 'mercadopago'
                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    MP
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`px-3 py-2 rounded-lg border font-semibold ${
                      paymentMethod === 'paypal'
                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`px-3 py-2 rounded-lg border font-semibold ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                        : 'border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {t(locale as Locale, 'exp_payment_card')}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  * Integración real con MercadoPago / PayPal se hará en la siguiente etapa.
                </p>
              </div>

              <button
                onClick={async () => {
                  const user = getCurrentUser()
                  if (!user) {
                    showToast('Debes iniciar sesión para reservar y pagar.', 'warning')
                    return
                  }
                  if (!selectedSlot) {
                    showToast('Elegí una fecha y horario para continuar.', 'warning')
                    return
                  }
                  try {
                    setIsPaying(true)
                    await paymentsAPI.checkout({
                      userId: user.id,
                      userName: user.name,
                      experienciaId: experiencia.id,
                      experienciaTitle: experiencia.title,
                      amount: experiencia.price,
                      method: paymentMethod,
                      slot: { date: selectedSlot.date, time: selectedSlot.time },
                    })
                    showToast('Reserva confirmada y pago simulado con éxito.', 'success')
                  } catch (error: any) {
                    showToast(error.message || 'No se pudo procesar el pago.', 'error')
                  } finally {
                    setIsPaying(false)
                  }
                }}
                disabled={isPaying}
                className="block w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed text-white text-center py-3 rounded-lg font-semibold mb-1 transition-all hover-lift ripple shadow-lg"
              >
                {isPaying ? t(locale as Locale, 'exp_processing_payment') : `${t(locale as Locale, 'exp_reserve_and_pay').replace('${price}', `$${experiencia.price}`)}`}
              </button>

              <Link
                href={`/grupos/crear?experiencia=${experiencia.id}`}
                className="block w-full text-primary-600 hover:text-primary-700 text-center py-2 text-sm font-semibold"
              >
                {t(locale as Locale, 'exp_create_group')}
              </Link>
            </div>

            {/* Grupos activos */}
            {gruposActivos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">{t(locale as Locale, 'exp_active_groups')}</h2>
                </div>
                <div className="space-y-4">
                  {gruposActivos.map(grupo => (
                    <div key={grupo.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-1">{grupo.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{grupo.fecha} - {grupo.horario}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {grupo.spots.disponibles} {t(locale as Locale, 'exp_spots_detail', { total: grupo.spots.total })} {t(locale as Locale, 'exp_spots_free')}
                        </span>
                        <Link
                          href={`/grupos/${grupo.id}`}
                          className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                          {t(locale as Locale, 'exp_join')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfil Anfitrión */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t(locale as Locale, 'exp_host')}</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{experiencia.host.name}</p>
                    {experiencia.host.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                        {t(locale as Locale, 'exp_verified')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <StarIconSolid className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{experiencia.host.rating} ({experiencia.host.experiences} {t(locale as Locale, 'exp_host_experiences')})</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{t(locale as Locale, 'exp_host_languages')}</p>
                <div className="flex flex-wrap gap-2">
                  {experiencia.host.languages.map((lang: any, idx: number) => (
                    <span key={idx} className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
