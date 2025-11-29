'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { 
  FunnelIcon, 
  MapPinIcon, 
  ClockIcon, 
  LanguageIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { experienciasData, type Experiencia } from '@/lib/data'
import { experienciasAPI } from '@/lib/api'
import { canAccessPremiumExperiences } from '@/lib/subscriptions'
import FavoriteButton from '@/components/FavoriteButton'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

export default function ExperienciasPage() {
  const { locale } = useI18n()
  const [experiencias, setExperiencias] = useState<Experiencia[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: t(locale as Locale, 'exp_category_all'),
    search: '',
    language: '',
    minPrice: '',
    maxPrice: ''
  })

  const categories = [
    t(locale as Locale, 'exp_category_all'),
    t(locale as Locale, 'exp_category_gastronomy'),
    t(locale as Locale, 'exp_category_culture'),
    t(locale as Locale, 'exp_category_nightlife'),
    t(locale as Locale, 'exp_category_adventure')
  ]

  useEffect(() => {
    loadExperiencias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, locale])

  const loadExperiencias = async () => {
    setLoading(true)
    try {
      const allCategory = t(locale as Locale, 'exp_category_all')
      const data = await experienciasAPI.getAll({
        category: filters.category !== allCategory ? filters.category : undefined,
        search: filters.search || undefined,
        language: filters.language || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
      })
      // Aplicar traducciones
      const { getExperienciasTranslated } = require('@/lib/data')
      const translated = getExperienciasTranslated(locale as Locale)
      // Combinar datos de API con traducciones
      const merged = data.map((exp: any) => {
        const translatedExp = translated.find((t: any) => t.id === exp.id)
        return translatedExp ? { ...exp, ...translatedExp } : exp
      })
      setExperiencias(merged)
    } catch (error) {
      console.error('Error cargando experiencias:', error)
      // Fallback a datos locales traducidos si falla la API
      const { getExperienciasTranslated } = require('@/lib/data')
      setExperiencias(getExperienciasTranslated(locale as Locale))
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: t(locale as Locale, 'exp_category_all'),
      search: '',
      language: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t(locale as Locale, 'exp_page_title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t(locale as Locale, 'exp_page_subtitle')}
          </p>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t(locale as Locale, 'exp_search_placeholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">{t(locale as Locale, 'exp_filters_title')}</h2>
            </div>
            {(filters.category !== t(locale as Locale, 'exp_category_all') || filters.search || filters.language || filters.minPrice || filters.maxPrice) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t(locale as Locale, 'exp_clear_filters')}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.category === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">{t(locale as Locale, 'exp_language_all')}</option>
              <option value="Hebreo">{t(locale as Locale, 'exp_language_hebrew')}</option>
              <option value="Español">{t(locale as Locale, 'exp_language_spanish')}</option>
              <option value="Inglés">{t(locale as Locale, 'exp_language_english')}</option>
            </select>
            <input
              type="number"
              placeholder={t(locale as Locale, 'exp_price_min')}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder={t(locale as Locale, 'exp_price_max')}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-600 flex items-center">
              {experiencias.length} {experiencias.length === 1 ? t(locale as Locale, 'exp_found_single') : t(locale as Locale, 'exp_found_plural')}
            </div>
          </div>
        </div>

        {/* Carrusel Recomendado */}
        {experiencias.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(locale as Locale, 'exp_recommended')}</h2>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-bold mb-2">{experiencias[0].title}</h3>
                <p className="text-primary-100 mb-4">{experiencias[0].category}</p>
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-3xl font-bold">${experiencias[0].price}</span>
                  <span className="text-primary-100">⭐ {experiencias[0].rating} ({experiencias[0].reviews} {t(locale as Locale, 'exp_reviews')})</span>
                </div>
                <Link
                  href={`/experiencias/${experiencias[0].id}`}
                  className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t(locale as Locale, 'exp_view_details')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Listado de Experiencias */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {loading ? t(locale as Locale, 'exp_loading') : experiencias.length > 0 ? t(locale as Locale, 'exp_all_experiences') : t(locale as Locale, 'exp_not_found')}
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
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
          ) : experiencias.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiencias.map(exp => {
                const isPremiumExp = exp.premium && !canAccessPremiumExperiences()
                return (
                  <div
                    key={exp.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover-lift group relative ${
                      isPremiumExp ? 'opacity-75' : ''
                    }`}
                  >
                      {isPremiumExp && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 z-10 rounded-xl flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
                          <SparklesIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="font-bold text-gray-900 mb-1">{t(locale as Locale, 'exp_premium_title')}</p>
                          <p className="text-sm text-gray-600 mb-3">{t(locale as Locale, 'exp_premium_required')}</p>
                          <Link
                            href="/planes"
                            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t(locale as Locale, 'exp_view_plans')}
                          </Link>
                        </div>
                      </div>
                    )}
                    <Link
                      href={isPremiumExp ? '#' : `/experiencias/${exp.id}`}
                      onClick={(e) => {
                        if (isPremiumExp) {
                          e.preventDefault()
                        }
                      }}
                      className="block"
                    >
                      <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
                        <FavoriteButton experienciaId={exp.id} />
                      </div>
                      {exp.premium && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <SparklesIcon className="w-3 h-3" />
                            {t(locale as Locale, 'exp_premium_badge')}
                          </div>
                        </div>
                      )}
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <img
                          src={exp.image || `https://picsum.photos/seed/exp-${exp.id}/800/600`}
                          alt={exp.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            target.src = `https://picsum.photos/seed/fallback-${exp.id}/800/600`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
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
                        <LanguageIcon className="w-4 h-4" />
                        <span>{exp.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{exp.spots.available} {t(locale as Locale, 'exp_spots_detail', { total: exp.spots.total })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-2xl font-bold text-gray-900">${exp.price}</span>
                      <span className="text-primary-600 font-semibold">{t(locale as Locale, 'exp_view_more')}</span>
                    </div>
                  </div>
                </Link>
                </div>
              )})}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600 mb-4">{t(locale as Locale, 'exp_not_found_filters')}</p>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t(locale as Locale, 'exp_clear_and_view_all')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
