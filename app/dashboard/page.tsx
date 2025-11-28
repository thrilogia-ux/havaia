'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import UserStats from '@/components/UserStats'
import BadgeNotification from '@/components/BadgeNotification'
import { getCurrentUser } from '@/lib/auth'
import { getUserStats, type Badge } from '@/lib/gamification'
import { getGrupos } from '@/lib/data'
import Link from 'next/link'
import { 
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid'
import { getWeeklyChallenges } from '@/lib/challenges'
import { getLeaderboard, getUserRank } from '@/lib/leaderboard'

export default function DashboardPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [stats, setStats] = useState(getUserStats())
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null)
  const [misGrupos, setMisGrupos] = useState(getGrupos().filter(g => g.coordinadorId === user?.id))
  const [weeklyChallenges] = useState(getWeeklyChallenges())
  const [userRank] = useState(user ? getUserRank(user.id) : 0)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setStats(getUserStats())
    setMisGrupos(getGrupos().filter(g => g.coordinadorId === user.id))
  }, [user, router])

  if (!user) return null

  const progressToNextLevel = (stats.points % 100) / 100 * 100
  const unlockedBadges = stats.badges.filter(b => b.unlocked)
  const lockedBadges = stats.badges.filter(b => !b.unlocked)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Seguí explorando y ganá puntos
          </p>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <UserStats />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/challenges"
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover-lift group"
          >
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8" />
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Desafíos Semanales</h3>
            <p className="text-purple-100 text-sm mb-3">
              {weeklyChallenges.completedChallenges} de {weeklyChallenges.challenges.length} completados
            </p>
            <div className="h-2 bg-purple-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-300 transition-all"
                style={{ width: `${(weeklyChallenges.completedChallenges / weeklyChallenges.challenges.length) * 100}%` }}
              />
            </div>
            <p className="text-purple-100 text-xs mt-2 group-hover:underline">Ver desafíos →</p>
          </Link>

          <Link
            href="/leaderboard"
            className="bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl shadow-lg p-6 text-white hover-lift group"
          >
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8" />
              <span className="text-3xl font-bold">#{userRank || '?'}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-yellow-100 text-sm mb-3">
              Tu posición en el ranking
            </p>
            <p className="text-yellow-100 text-xs mt-2 group-hover:underline">Ver ranking completo →</p>
          </Link>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <SparklesIcon className="w-8 h-8" />
              <span className="text-2xl">{unlockedBadges.length}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Badges</h3>
            <p className="text-blue-100 text-sm">
              {unlockedBadges.length} de {stats.badges.length} desbloqueados
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <UserGroupIcon className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.groupsCreated}</p>
            <p className="text-sm text-gray-600">Grupos creados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-secondary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.postsCreated}</p>
            <p className="text-sm text-gray-600">Posts publicados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <TrophyIcon className="w-8 h-8 text-accent-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.experiencesCompleted}</p>
            <p className="text-sm text-gray-600">Experiencias</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
              {stats.streak > 0 ? (
                <FireIcon className="w-8 h-8 text-orange-500 animate-pulse" />
              ) : (
                <SparklesIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.streak}</p>
            <p className="text-sm text-gray-600">Racha de días</p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Unlocked Badges */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIconSolid className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Badges Desbloqueados</h2>
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-semibold">
                {unlockedBadges.length}
              </span>
            </div>
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {unlockedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4 text-center hover-lift animate-float"
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aún no desbloqueaste badges</p>
            )}
          </div>

          {/* Locked Badges */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">Badges por Desbloquear</h2>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-semibold">
                {lockedBadges.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {lockedBadges.slice(0, 4).map(badge => (
                <div
                  key={badge.id}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center opacity-60"
                >
                  <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                  <p className="font-semibold text-gray-500 text-sm mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mis Grupos Recientes */}
        {misGrupos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mis Grupos Recientes</h2>
            <div className="space-y-3">
              {misGrupos.slice(0, 3).map(grupo => (
                <a
                  key={grupo.id}
                  href={`/grupos/${grupo.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors hover-lift"
                >
                  <p className="font-semibold text-gray-900">{grupo.name}</p>
                  <p className="text-sm text-gray-600">{grupo.fecha} - {grupo.horario}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <BadgeNotification badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
    </div>
  )
}

