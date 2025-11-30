'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { 
  FunnelIcon, 
  MapPinIcon,
  UserGroupIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { getAccommodations, type Accommodation } from '@/lib/accommodations'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

export default function AlojamientosPage() {
  const { locale } = useI18n()
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    guests: '',
    bedrooms: '',
    beds: '',
    amenities: [] as string[],
    minPrice: '',
    maxPrice: '',
    location: ''
  })

  const propertyTypes = [
    { value: 'all', label: t(locale as Locale, 'acc_type_all') },
    { value: 'casa', label: t(locale as Locale, 'acc_type_house') },
    { value: 'departamento', label: t(locale as Locale, 'acc_type_apartment') },
    { value: 'loft', label: t(locale as Locale, 'acc_type_loft') },
    { value: 'cabaña', label: t(locale as Locale, 'acc_type_cabin') },
    { value: 'villa', label: t(locale as Locale, 'acc_type_villa') },
    { value: 'penthouse', label: t(locale as Locale, 'acc_type_penthouse') },
  ]

  const amenitiesList = [
    { key: 'Piscina', label: t(locale as Locale, 'acc_amenity_pool') },
    { key: 'Gimnasio', label: t(locale as Locale, 'acc_amenity_gym') },
    { key: 'WiFi', label: t(locale as Locale, 'acc_amenity_wifi') },
    { key: 'Aire acondicionado', label: t(locale as Locale, 'acc_amenity_ac') },
    { key: 'Cocina equipada', label: t(locale as Locale, 'acc_amenity_kitchen') },
    { key: 'TV', label: t(locale as Locale, 'acc_amenity_tv') },
    { key: 'Lavadora', label: t(locale as Locale, 'acc_amenity_washer') },
    { key: 'Estacionamiento', label: t(locale as Locale, 'acc_amenity_parking') },
    { key: 'Jacuzzi', label: t(locale as Locale, 'acc_amenity_jacuzzi') },
    { key: 'Terraza', label: t(locale as Locale, 'acc_amenity_terrace') },
  ]

  useEffect(() => {
    loadAccommodations()
  }, [filters, locale])

  const loadAccommodations = () => {
    setLoading(true)
    try {
      const data = getAccommodations({
        type: filters.type !== 'all' ? filters.type : undefined,
        guests: filters.guests ? parseInt(filters.guests) : undefined,
        bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
        beds: filters.beds ? parseInt(filters.beds) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        location: filters.location || undefined,
      })
      setAccommodations(data)
    } catch (error) {
      console.error('Error cargando alojamientos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      guests: '',
      bedrooms: '',
      beds: '',
      amenities: [],
      minPrice: '',
      maxPrice: '',
      location: ''
    })
  }

  const hasActiveFilters = filters.type !== 'all' || 
    filters.guests || 
    filters.bedrooms || 
    filters.beds || 
    filters.amenities.length > 0 || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.location

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t(locale as Locale, 'acc_page_title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t(locale as Locale, 'acc_page_subtitle')}
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all font-semibold text-gray-700"
            >
              <FunnelIcon className="w-5 h-5" />
              {t(locale as Locale, 'acc_filters')}
              {hasActiveFilters && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {filters.amenities.length + (filters.type !== 'all' ? 1 : 0) + (filters.guests ? 1 : 0) + (filters.bedrooms ? 1 : 0) + (filters.beds ? 1 : 0) + (filters.minPrice || filters.maxPrice ? 1 : 0) + (filters.location ? 1 : 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                {t(locale as Locale, 'acc_clear_filters')}
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo de propiedad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_type')}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Huéspedes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_guests')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={filters.guests}
                    onChange={(e) => handleFilterChange('guests', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_guests_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Dormitorios */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_bedrooms')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_bedrooms_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Camas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_beds')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={filters.beds}
                    onChange={(e) => handleFilterChange('beds', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_beds_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Precio mínimo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_min_price')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_min_price_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Precio máximo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_max_price')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_max_price_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(locale as Locale, 'acc_filter_location')}
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder={t(locale as Locale, 'acc_filter_location_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t(locale as Locale, 'acc_filter_amenities')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {amenitiesList.map(amenity => (
                    <button
                      key={amenity.key}
                      onClick={() => toggleAmenity(amenity.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.amenities.includes(amenity.key)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-gray-600">
            {loading ? (
              <span>{t(locale as Locale, 'acc_loading')}</span>
            ) : (
              <span>
                {accommodations.length} {accommodations.length === 1 ? t(locale as Locale, 'acc_found_single') : t(locale as Locale, 'acc_found_plural')}
              </span>
            )}
          </div>
        </div>

        {/* Listado de Alojamientos */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : accommodations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map(acc => (
              <Link
                key={acc.id}
                href={`/alojamientos/${acc.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover-lift group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={acc.images[0]}
                    alt={acc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
                    }}
                  />
                  {acc.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                      ⭐ {t(locale as Locale, 'acc_featured')}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${acc.pricePerNight.toLocaleString('es-AR')}/noche
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{acc.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {acc.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {acc.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{acc.guests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{acc.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{acc.beds} {t(locale as Locale, 'acc_beds')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-semibold text-gray-700">{acc.rating}</span>
                      <span className="text-sm text-gray-500">({acc.reviews})</span>
                    </div>
                    <span className="text-lg font-bold text-primary-600">
                      ${acc.pricePerNight.toLocaleString('es-AR')}
                      <span className="text-sm text-gray-500 font-normal">/noche</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {t(locale as Locale, 'acc_not_found')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t(locale as Locale, 'acc_clear_filters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

