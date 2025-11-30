'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { 
  MapPinIcon, 
  UserGroupIcon,
  HomeIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ArrowLeftIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { getAccommodationById, type Accommodation } from '@/lib/accommodations'
import { getCurrentUser } from '@/lib/auth'
import { showToast } from '@/components/ToastContainer'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

export default function AccommodationDetailPage({ params }: { params: { id: string } }) {
  const { locale } = useI18n()
  const accommodationId = parseInt(params.id)
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const user = getCurrentUser()

  useEffect(() => {
    loadAccommodation()
  }, [accommodationId, locale])

  const loadAccommodation = () => {
    try {
      setLoading(true)
      const acc = getAccommodationById(accommodationId)
      if (acc) {
        setAccommodation(acc)
        setMainImage(acc.images[0] || '')
      }
    } catch (error) {
      console.error('Error cargando alojamiento:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = () => {
    if (!user) {
      showToast(t(locale as Locale, 'acc_login_required'), 'error')
      return
    }

    if (!checkIn || !checkOut) {
      showToast(t(locale as Locale, 'acc_select_dates'), 'error')
      return
    }

    if (guests > (accommodation?.guests || 0)) {
      showToast(t(locale as Locale, 'acc_too_many_guests'), 'error')
      return
    }

    // Simular reserva
    showToast(t(locale as Locale, 'acc_reservation_success'), 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t(locale as Locale, 'acc_loading')}</p>
        </div>
      </div>
    )
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 text-lg mb-4">{t(locale as Locale, 'acc_not_found')}</p>
          <Link
            href="/alojamientos"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            {t(locale as Locale, 'acc_back_to_list')}
          </Link>
        </div>
      </div>
    )
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1
  const totalPrice = accommodation.pricePerNight * nights

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <Link
          href="/alojamientos"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{t(locale as Locale, 'acc_back_to_list')}</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Galería */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
                <img
                  src={mainImage}
                  alt={accommodation.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
                  }}
                />
              </div>
              {accommodation.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {accommodation.images.slice(0, 4).map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(url)}
                      className={`relative h-24 rounded-lg overflow-hidden ${
                        mainImage === url ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${accommodation.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información principal */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {accommodation.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-5 h-5" />
                      <span>{accommodation.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">{accommodation.rating}</span>
                      <span>({accommodation.reviews} {t(locale as Locale, 'acc_reviews')})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <UserGroupIcon className="w-5 h-5" />
                      <span className="font-semibold">{t(locale as Locale, 'acc_guests')}</span>
                    </div>
                    <p className="text-gray-900 font-bold">{accommodation.guests}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-semibold">{t(locale as Locale, 'acc_bedrooms')}</span>
                    </div>
                    <p className="text-gray-900 font-bold">{accommodation.bedrooms}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-semibold">{t(locale as Locale, 'acc_beds')}</span>
                    </div>
                    <p className="text-gray-900 font-bold">{accommodation.beds}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-semibold">{t(locale as Locale, 'acc_bathrooms')}</span>
                    </div>
                    <p className="text-gray-900 font-bold">{accommodation.bathrooms}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'acc_description')}</h2>
                <p className="text-gray-600 leading-relaxed">{accommodation.description}</p>
              </div>

              {/* Amenities */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'acc_amenities_title')}</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {accommodation.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reglas */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'acc_rules_title')}</h2>
                <ul className="space-y-2">
                  {accommodation.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XMarkIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Política de cancelación */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'acc_cancellation_policy')}</h2>
                <p className="text-gray-600">
                  {t(locale as Locale, `acc_cancellation_${accommodation.cancellationPolicy}`)}
                </p>
              </div>

              {/* Host */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'acc_host')}</h2>
                <div className="flex items-center gap-4">
                  {accommodation.host.avatar ? (
                    <img
                      src={accommodation.host.avatar}
                      alt={accommodation.host.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
                      {accommodation.host.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{accommodation.host.name}</h3>
                    {accommodation.host.verified && (
                      <span className="text-sm text-green-600 font-semibold">
                        ✓ {t(locale as Locale, 'acc_host_verified')}
                      </span>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <StarIconSolid className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {accommodation.host.rating} ({accommodation.host.reviews} {t(locale as Locale, 'acc_reviews')})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${accommodation.pricePerNight.toLocaleString('es-AR')}
                  </span>
                  <span className="text-gray-600">/noche</span>
                </div>
              </div>

              {/* Formulario de reserva */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_check_in')}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_check_out')}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_guests')}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Array.from({ length: accommodation.guests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resumen de precio */}
              {checkIn && checkOut && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ${accommodation.pricePerNight.toLocaleString('es-AR')} x {nights} {nights === 1 ? t(locale as Locale, 'acc_night') : t(locale as Locale, 'acc_nights')}
                      </span>
                      <span className="text-gray-900">${totalPrice.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>{t(locale as Locale, 'acc_total')}</span>
                      <span>${totalPrice.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={!checkIn || !checkOut}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t(locale as Locale, 'acc_reserve')}
              </button>

              {!user && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  <Link href="/login" className="text-primary-600 hover:underline">
                    {t(locale as Locale, 'acc_login_to_reserve')}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

