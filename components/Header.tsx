'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, HeartIcon, ChatBubbleLeftRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { getCurrentUser, logout } from '@/lib/auth'
import UserMenu from './UserMenu'
import { useI18n } from './Providers'
import { t } from '@/lib/i18n'

export default function Header() {
  const router = useRouter()
  const { locale, setLocale } = useI18n()
  const [user, setUser] = useState(getCurrentUser())
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleChangeLocale = (newLocale: 'es' | 'en' | 'he') => {
    setLocale(newLocale)
  }

  const handleNavigation = (path: string) => {
    setShowMenu(false)
    // Verificar que estamos en el cliente antes de usar window
    if (typeof window !== 'undefined') {
      window.location.href = path
    } else {
      router.push(path)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-6 h-full">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 h-full hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img
                src="/logo-havaia.png"
                alt="Havaia"
                className="h-10 w-auto"
              />
            </button>
            {/* Menú desktop */}
            <nav className="hidden md:flex items-center gap-6 text-base h-full">
              <button
                onClick={() => handleNavigation('/experiencias')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_experiences')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/comunidad')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_community')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/grupos')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_groups')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/alojamientos')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_accommodations')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/challenges')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_challenges')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_leaderboard')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
              <button
                onClick={() => handleNavigation('/planes')}
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all hover:scale-105 relative group py-2 cursor-pointer"
              >
                {t(locale, 'nav_plans')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full pointer-events-none"></span>
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3 h-full">
            {/* Selector de idioma - solo desktop */}
            <div className="hidden md:flex items-center gap-0.5 rounded-full bg-gray-100 px-1 py-1 text-xs font-medium">
              <button
                onClick={() => handleChangeLocale('es')}
                className={`px-3 py-1.5 rounded-full transition-all ${locale === 'es' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ES
              </button>
              <button
                onClick={() => handleChangeLocale('en')}
                className={`px-3 py-1.5 rounded-full transition-all ${locale === 'en' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleChangeLocale('he')}
                className={`px-3 py-1.5 rounded-full transition-all ${locale === 'he' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
              >
                HE
              </button>
            </div>
            {/* Iconos - solo desktop */}
            <button
              onClick={() => handleNavigation('/experiencias')}
              className="hidden md:inline-flex p-2 text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleNavigation('/favoritos')}
              className="hidden md:inline-flex p-2 text-gray-600 hover:text-primary-600 relative transition-colors cursor-pointer"
            >
              <HeartIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleNavigation('/mensajes')}
              className="hidden md:inline-flex p-2 text-gray-600 hover:text-primary-600 relative transition-colors cursor-pointer"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleNavigation('/notificaciones')}
              className="hidden md:inline-flex p-2 text-gray-600 hover:text-primary-600 relative transition-colors cursor-pointer"
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full animate-pulse pointer-events-none"></span>
            </button>
            
            {/* Perfil/Login - siempre visible */}
            {user ? (
              <div className="hidden md:block">
                <UserMenu />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold text-sm transition-all hover-lift"
              >
                {t(locale, 'nav_login')}
              </Link>
            )}

            {/* Menú hamburguesa - solo mobile */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {showMenu ? (
                <XMarkIcon className="w-6 h-6" style={{ color: '#9a4aa6' }} />
              ) : (
                <Bars3Icon className="w-6 h-6" style={{ color: '#9a4aa6' }} />
              )}
            </button>

            {/* Perfil mobile - solo si está logueado */}
            {user && (
              <div className="md:hidden">
                <UserMenu />
              </div>
            )}
          </div>
        </div>

        {/* Menú desplegable mobile */}
        {showMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              {/* Enlaces principales */}
              <button
                onClick={() => handleNavigation('/experiencias')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_experiences')}
              </button>
              <button
                onClick={() => handleNavigation('/comunidad')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_community')}
              </button>
              <button
                onClick={() => handleNavigation('/grupos')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_groups')}
              </button>
              <button
                onClick={() => handleNavigation('/alojamientos')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_accommodations')}
              </button>
              <button
                onClick={() => handleNavigation('/challenges')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_challenges')}
              </button>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_leaderboard')}
              </button>
              <button
                onClick={() => handleNavigation('/planes')}
                className="block w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                {t(locale, 'nav_plans')}
              </button>

              {/* Separador */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Iconos con texto */}
              <button
                onClick={() => handleNavigation('/experiencias')}
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>{t(locale, 'nav_search')}</span>
              </button>
              <button
                onClick={() => handleNavigation('/favoritos')}
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                <HeartIcon className="w-5 h-5" />
                <span>{t(locale, 'nav_favorites')}</span>
              </button>
              <button
                onClick={() => handleNavigation('/mensajes')}
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>{t(locale, 'nav_messages')}</span>
              </button>
              <button
                onClick={() => handleNavigation('/notificaciones')}
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-primary-600 font-semibold py-2 transition-colors cursor-pointer"
              >
                <BellIcon className="w-5 h-5" />
                <span>{t(locale, 'nav_notifications')}</span>
              </button>

              {/* Separador */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Selector de idioma mobile */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 mr-2">{t(locale, 'nav_language')}</span>
                <div className="flex items-center gap-0.5 rounded-full bg-gray-100 px-1 py-1 text-xs font-medium">
                  <button
                    onClick={() => {
                      handleChangeLocale('es')
                      setShowMenu(false)
                    }}
                    className={`px-3 py-1.5 rounded-full transition-all ${locale === 'es' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => {
                      handleChangeLocale('en')
                      setShowMenu(false)
                    }}
                    className={`px-3 py-1.5 rounded-full transition-all ${locale === 'en' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      handleChangeLocale('he')
                      setShowMenu(false)
                    }}
                    className={`px-3 py-1.5 rounded-full transition-all ${locale === 'he' ? 'bg-white text-primary-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    HE
                  </button>
                </div>
              </div>

              {/* Login mobile - solo si no está logueado */}
              {!user && (
                <>
                  <div className="border-t border-gray-200 my-3"></div>
              <Link
                href="/login"
                onClick={() => setShowMenu(false)}
                className="block w-full text-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold text-sm transition-all cursor-pointer"
              >
                {t(locale, 'nav_login')}
              </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
