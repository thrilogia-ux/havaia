'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { addPoints } from '@/lib/gamification'
import { isPremium } from '@/lib/subscriptions'
import Header from '@/components/Header'
import {
  TrophyIcon, 
  SparklesIcon, 
  FireIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid'
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'
import { experienciasData } from '@/lib/data'
import { experienciasAPI } from '@/lib/api'
import { getPremiumExperiences, getNextAvailableDate } from '@/lib/premium-experiences'
import PremiumExperienceCard from '@/components/PremiumExperienceCard'

// Componente de carrusel de experiencias
function ExperiencesCarousel({ experiences, locale }: { experiences: typeof experienciasData, locale: string }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  const currentExperiences = experiences.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  )

  return (
    <div className="relative max-w-7xl mx-auto mb-8">
      {/* Carrusel */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {currentExperiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img
                src={exp.image || `https://picsum.photos/seed/home-exp-${exp.id}/800/600`}
                alt={exp.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.src = `https://picsum.photos/seed/home-fallback-${exp.id}/800/600`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50 hover:opacity-30 transition-opacity" />
            </div>
            <div className="p-6">
              <span className="text-sm text-primary-600 font-semibold">{exp.category}</span>
              <h3 className="text-xl font-bold mt-2 mb-3 text-gray-900">{exp.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${exp.price}</span>
                <Link 
                  href={`/experiencias/${exp.id}`} 
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {t(locale as Locale, 'see_more')} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Puntos indicadores */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentPage === index
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  // Importante para evitar errores de hidratación:
  // iniciamos en null y cargamos user/stats SOLO en el navegador dentro de useEffect.
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser> | null>(null)
  const [stats, setStats] = useState<any | null>(null)
  const [userIsPremium, setUserIsPremium] = useState(false)
  const { locale } = useI18n()
  const [homeExperiences, setHomeExperiences] = useState(experienciasData)
  const [premiumExperiences, setPremiumExperiences] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    if (currentUser) {
      try {
        const { getUserStats } = require('@/lib/gamification')
        const userStats = getUserStats()
        setStats(userStats)
        setUserIsPremium(isPremium())
        
        // Dar puntos por visitar la landing (solo una vez por sesión)
        if (!sessionStorage.getItem('landing_visited')) {
          sessionStorage.setItem('landing_visited', 'true')
          addPoints(5, 'Visitar landing')
        }
      } catch (error) {
        console.error('Error loading user stats:', error)
      }
    }

    // Cargar experiencias desde la API
    loadExperiences()
    loadPremiumExperiences()
  }, [])

  const loadExperiences = async () => {
    try {
      const experiences = await experienciasAPI.getAll()
      setHomeExperiences(experiences)
    } catch (error) {
      console.error('Error cargando experiencias:', error)
      // Fallback a datos locales si falla la API
      setHomeExperiences(experienciasData)
    }
  }

  const loadPremiumExperiences = () => {
    try {
      // Usar la misma función que usa la página de detalle para mantener consistencia
      const experiences = getPremiumExperiences()
      // Mostrar solo las 3 primeras experiencias con fechas disponibles
      const availableExperiences = experiences
        .map(exp => {
          // Obtener la próxima fecha disponible para esta experiencia
          const nextDateInfo = getNextAvailableDate(exp)
          if (!nextDateInfo) return null
          
          // Retornar experiencia con datos de la próxima fecha disponible
          return {
            ...exp,
            date: nextDateInfo.date,
            reservedSeats: nextDateInfo.reservedSeats,
            reservations: nextDateInfo.reservations
          }
        })
        .filter((exp): exp is NonNullable<typeof exp> => exp !== null) // Filtrar nulls
        .slice(0, 3)
      
      setPremiumExperiences(availableExperiences)
    } catch (error) {
      console.error('Error cargando experiencias premium:', error)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Banner Experiencias Premium Destacadas - PRIMERA */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4 shadow-lg">
              <span>⭐</span>
              <span>{t(locale as Locale, 'premium_experiences_badge') || 'EXPERIENCIAS PREMIUM'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t(locale as Locale, 'premium_experiences_title') || 'Experiencias Gastronómicas Exclusivas'}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Las mejores experiencias culinarias curadas especialmente para vos, en tu idioma, con tu gente, y en los lugares más exclusivos de Buenos Aires.
            </p>
          </div>
          
          {premiumExperiences.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-8">
              {premiumExperiences.map((exp, idx) => (
                <PremiumExperienceCard
                  key={exp.id}
                  experience={exp}
                  featured={idx === 0}
                />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link
              href="/experiencias-premium"
              className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-xl"
            >
              {t(locale as Locale, 'premium_experiences_cta') || 'Ver todas las experiencias premium →'}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Sección Experiencias - SEGUNDA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t(locale as Locale, 'home_experiences_havaia_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t(locale as Locale, 'home_experiences_havaia_subtitle')}
            </p>
          </div>
          
          {/* Carrusel de experiencias */}
          <ExperiencesCarousel experiences={homeExperiences} locale={locale} />
          <div className="text-center mt-8">
            <Link 
              href="/experiencias" 
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              {t(locale as Locale, 'home_experiences_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona - SEGUNDA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {t(locale as Locale, 'home_how_it_works_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-gray-100 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="w-full h-64 mb-6 flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  src="/descubri.svg" 
                  alt="Descubrí" 
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">1. Descubrí</h3>
              <p className="text-gray-600 text-lg">
                {t(locale as Locale, 'home_how_it_works_step1_text')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-gray-100 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="w-full h-64 mb-6 flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  src="/conecta.svg" 
                  alt="Conectá" 
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">2. Conectá</h3>
              <p className="text-gray-600 text-lg">
                {t(locale as Locale, 'home_how_it_works_step2_text')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-gray-100 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="w-full h-64 mb-6 flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  src="/vivi.svg" 
                  alt="Viví" 
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3. Viví</h3>
              <p className="text-gray-600 text-lg">
                {t(locale as Locale, 'home_how_it_works_step3_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section / Resumen Dashboard - TERCERA */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            {user && stats ? (
              // Vista para usuario logueado
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {t(locale as Locale, 'home_hero_logged_title', { name: user.name })} 👋
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100">
                  {t(locale as Locale, 'home_hero_logged_sub')}
                </p>
                
                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrophyIcon className="w-6 h-6 text-yellow-300" />
                      <span className="text-2xl font-bold">{stats.points}</span>
                    </div>
                    <p className="text-sm text-primary-100">{t(locale as Locale, 'home_hero_points')}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <SparklesIcon className="w-6 h-6 text-yellow-300" />
                      <span className="text-2xl font-bold">Nivel {stats.level}</span>
                    </div>
                    <p className="text-sm text-primary-100">{t(locale as Locale, 'home_hero_level')}</p>
                  </div>
                  {stats.streak > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FireIcon className="w-6 h-6 text-orange-300" />
                        <span className="text-2xl font-bold">{stats.streak}</span>
                      </div>
                      <p className="text-sm text-primary-100">{t(locale as Locale, 'home_hero_streak')}</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/dashboard" 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover-lift ripple shadow-lg flex items-center justify-center gap-2"
                  >
                    {t(locale as Locale, 'home_hero_go_dashboard')}
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/experiencias" 
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover-lift border-2 border-white/30"
                  >
                    {t(locale as Locale, 'home_hero_explore_experiences')}
                  </Link>
                </div>
              </div>
            ) : (
              // Vista para usuario no logueado
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {t(locale as Locale, 'home_hero_guest_title')}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100">
                  {t(locale as Locale, 'home_hero_guest_sub')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/registro" 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover-lift ripple shadow-lg"
                  >
                    {t(locale as Locale, 'home_hero_guest_cta_register')}
                  </Link>
                  <Link 
                    href="/experiencias" 
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover-lift border-2 border-white/30"
                  >
                    {t(locale as Locale, 'home_hero_guest_cta_experiences')}
                  </Link>
                </div>
                <p className="mt-6 text-primary-200 text-sm">
                  {t(locale as Locale, 'home_hero_guest_badge')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección Comunidad */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Nunca viajás solo
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ingresá a foros y chats temáticos, recibí tips al instante y coordiná planes con viajeros que comparten tus intereses.
              </p>
              <Link 
                href="/comunidad" 
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Explorar foros
              </Link>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Itai, Tel Aviv</p>
                    <p className="text-gray-600 text-sm">¿Alguien conoce restaurantes kosher en Palermo?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Sara, Jerusalem</p>
                    <p className="text-gray-600 text-sm">Recomiendo La Crespo en Villa Crespo, excelente!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">David, Haifa</p>
                    <p className="text-gray-600 text-sm">¿Armamos un grupo para el tour de tango mañana?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Suscripciones Premium - Destacada (solo si no es premium) */}
      {!userIsPremium && (
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">⭐ Plan Premium</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Desbloqueá Experiencias Exclusivas
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Accedé a experiencias premium, creá grupos ilimitados, obtené prioridad en reservas y disfrutá de beneficios exclusivos
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold">Grupos Ilimitados</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">⭐</div>
                <p className="font-semibold">Experiencias Premium</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-semibold">Prioridad Total</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/planes"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all hover-lift shadow-2xl"
              >
                Ver Planes Premium
              </Link>
              <Link
                href="/experiencias"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover-lift border-2 border-white/50"
              >
                Explorar Experiencias
              </Link>
            </div>
            <p className="mt-6 text-white/80 text-sm">
              ✓ 7 días de prueba gratis • Sin tarjeta de crédito
            </p>
          </div>
        </div>
      </section>
      )}


      {/* Sección Grupos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="bg-gray-100 rounded-xl p-8 border-2 border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                  <h3 className="font-bold text-lg">Grupo: Tour Gastronómico</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>15 de Marzo, 19:00</span>
                </div>
                <div className="flex -space-x-2 mb-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 bg-primary-400 rounded-full border-2 border-white"></div>
                  ))}
                  <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold">
                    +2
                  </div>
                </div>
                <p className="text-sm text-gray-600">4/6 personas confirmadas</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Grupos a tu medida
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Elegí cupos, definí roles, dividí pagos y mantené todo coordinado desde un solo chat. Creá grupos privados o unite a públicos.
              </p>
              <Link 
                href="/grupos/crear" 
                className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Crear grupo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navegación Rápida */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Explorá todas las secciones
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link
              href="/experiencias"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold mb-2">Experiencias</h3>
              <p className="text-blue-100 text-sm mb-4">
                Descubrí actividades curadas en Buenos Aires
              </p>
              <span className="text-blue-200 group-hover:text-white font-semibold text-sm">
                Explorar →
              </span>
            </Link>

            <Link
              href="/grupos"
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Grupos</h3>
              <p className="text-green-100 text-sm mb-4">
                Creá o uníte a grupos de viajeros
              </p>
              <span className="text-green-200 group-hover:text-white font-semibold text-sm">
                Ver grupos →
              </span>
            </Link>

            <Link
              href="/comunidad"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">Comunidad</h3>
              <p className="text-purple-100 text-sm mb-4">
                Conectá con otros viajeros
              </p>
              <span className="text-purple-200 group-hover:text-white font-semibold text-sm">
                Participar →
              </span>
            </Link>

            <Link
              href="/planes"
              className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-xl p-6 text-white hover-lift group border-2 border-accent-300"
            >
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold mb-2">Planes Premium</h3>
              <p className="text-yellow-100 text-sm mb-4">
                Desbloqueá todas las funcionalidades
              </p>
              <span className="text-yellow-200 group-hover:text-white font-semibold text-sm">
                Ver planes →
              </span>
            </Link>
          </div>

          {/* Segunda fila de navegación */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-6">
            <Link
              href="/favoritos"
              className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="text-xl font-bold mb-2">Favoritos</h3>
              <p className="text-red-100 text-sm mb-4">
                Tus experiencias guardadas
              </p>
              <span className="text-red-200 group-hover:text-white font-semibold text-sm">
                Ver favoritos →
              </span>
            </Link>

            <Link
              href="/challenges"
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Desafíos</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Completá desafíos semanales
              </p>
              <span className="text-indigo-200 group-hover:text-white font-semibold text-sm">
                Ver desafíos →
              </span>
            </Link>

            <Link
              href="/leaderboard"
              className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white hover-lift group"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Ranking</h3>
              <p className="text-amber-100 text-sm mb-4">
                Competí con otros usuarios
              </p>
              <span className="text-amber-200 group-hover:text-white font-semibold text-sm">
                Ver ranking →
              </span>
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white hover-lift group"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                <p className="text-cyan-100 text-sm mb-4">
                  Tu progreso y estadísticas
                </p>
                <span className="text-cyan-200 group-hover:text-white font-semibold text-sm">
                  Ir al dashboard →
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Lo que dicen nuestros viajeros
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Itai', city: 'Tel Aviv', quote: 'Reservé un tour gastronómico y terminé con amigos nuevos para toda la semana' },
              { name: 'Sara', city: 'Jerusalem', quote: 'La mejor forma de conocer Buenos Aires con gente que entiende tu cultura' },
              { name: 'David', city: 'Haifa', quote: 'Los anfitriones son increíbles y las experiencias están súper curadas' },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.city}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad y Soporte */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Seguridad y soporte
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Anfitriones verificados, moderación bilingüe y asistencia 24/7 para cualquier imprevisto durante tu viaje.
            </p>
            <Link 
              href="/soporte" 
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

// Componente Footer separado para usar hooks
function Footer() {
  const { locale, setLocale } = useI18n()
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <img
                src="/logo-havaia.png"
                alt="Havaia"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              Plataforma de experiencias únicas
            </p>
            
            {/* Redes sociales */}
            <div className="flex items-center gap-3 mt-6">
              <a 
                href="https://instagram.com/havaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/havaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@havaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.07 6.07 0 0 0-1-.05A6.1 6.1 0 0 0 5 20.1a6.1 6.1 0 0 0 10.86-3.94v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.55z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/havaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/experiencias" className="hover:text-white transition-colors">Experiencias</Link></li>
              <li><Link href="/comunidad" className="hover:text-white transition-colors">Comunidad</Link></li>
              <li><Link href="/grupos" className="hover:text-white transition-colors">Grupos</Link></li>
              <li><Link href="/planes" className="hover:text-white transition-colors">Planes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/soporte" className="hover:text-white transition-colors">Contacto 24/7</Link></li>
              <li><Link href="/seguridad" className="hover:text-white transition-colors">Seguridad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
              <li><Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de privacidad</Link></li>
              <li><Link href="/condiciones-del-servicio" className="hover:text-white transition-colors">Condiciones del servicio</Link></li>
            </ul>
            
            {/* Selector de idioma con banderas */}
            <div>
              <h4 className="font-semibold mb-3">Idioma</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setLocale('es')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    locale === 'es' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🇪🇸</span>
                  <span className="font-medium">Español</span>
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    locale === 'en' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🇺🇸</span>
                  <span className="font-medium">English</span>
                </button>
                <button
                  onClick={() => setLocale('he')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    locale === 'he' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🇮🇱</span>
                  <span className="font-medium">עברית</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Havaia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

