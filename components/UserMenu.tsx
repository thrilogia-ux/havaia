'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth'
import { getUserStats } from '@/lib/gamification'
import { getUserPlan, isPremium } from '@/lib/subscriptions'
import { 
  UserCircleIcon,
  HomeIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/24/solid'

export default function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [stats, setStats] = useState(getUserStats())
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
    setStats(getUserStats())
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleNavigation = (path: string) => {
    setShowMenu(false)
    window.location.href = path
  }

  if (!user) return null

  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard', href: '/dashboard', color: 'text-primary-600' },
    { icon: SparklesIcon, label: 'Experiencias', href: '/experiencias', color: 'text-blue-600' },
    { icon: HeartIcon, label: 'Favoritos', href: '/favoritos', color: 'text-red-600' },
    { icon: CalendarDaysIcon, label: 'Mis Reservas', href: '/reservas', color: 'text-indigo-600' },
    { icon: UserGroupIcon, label: 'Grupos', href: '/grupos', color: 'text-green-600' },
    { icon: ChatBubbleLeftRightIcon, label: 'Comunidad', href: '/comunidad', color: 'text-purple-600' },
    { icon: ChatBubbleLeftRightIcon, label: 'Mensajes', href: '/mensajes', color: 'text-blue-600' },
    { icon: TrophyIcon, label: 'Desafíos', href: '/challenges', color: 'text-yellow-600' },
    { icon: CalendarDaysIcon, label: 'Ranking', href: '/leaderboard', color: 'text-orange-600' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Nivel {stats.level}</span>
            {stats.streak > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <FireIcon className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-gray-600">{stats.streak} días</span>
                </div>
              </>
            )}
          </div>
        </div>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <TrophyIcon className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">{stats.points} pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-gray-600">
                    {stats.badges.filter(b => b.unlocked).length} badges
                  </span>
                </div>
              </div>
              {isPremium() && (
                <div className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold text-center">
                  ⭐ Premium
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="flex-1 text-left text-gray-700 group-hover:text-gray-900 font-medium">
                      {item.label}
                    </span>
                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2" />

            {/* Settings & Logout */}
            <div className="py-2">
              {!isPremium() && (
                <button
                  onClick={() => handleNavigation('/planes')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg mx-2 mb-2 transition-all hover-lift cursor-pointer"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span className="font-semibold">Actualizar a Premium</span>
                </button>
              )}
              <button
                onClick={() => handleNavigation('/perfil')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Mi Perfil</span>
              </button>
              <button
                onClick={() => {
                  handleLogout()
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

