'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ChallengeCard from '@/components/ChallengeCard'
import { getCurrentUser } from '@/lib/auth'
import { getWeeklyChallenges, getCurrentWeek, type WeeklyChallenges } from '@/lib/challenges'
import { getUserStats } from '@/lib/gamification'
import { TrophyIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'

export default function ChallengesPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [weekly, setWeekly] = useState<WeeklyChallenges>(getWeeklyChallenges())
  const [stats] = useState(getUserStats())

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setWeekly(getWeeklyChallenges())
  }, [user, router])

  if (!user) return null

  const currentWeek = getCurrentWeek()
  const completionRate = weekly.challenges.length > 0
    ? (weekly.completedChallenges / weekly.challenges.length) * 100
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Desafíos Semanales</h1>
              <p className="text-lg text-gray-600">
                Completá desafíos y ganá puntos extra
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-primary-600 mb-1">
                <CalendarDaysIcon className="w-5 h-5" />
                <span className="font-semibold">Semana {currentWeek}</span>
              </div>
              <p className="text-sm text-gray-600">
                {weekly.completedChallenges} de {weekly.challenges.length} completados
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-100 mb-1">Progreso semanal</p>
                <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 mb-1">Puntos disponibles</p>
                <p className="text-3xl font-bold">{weekly.totalPoints}</p>
              </div>
            </div>
            <div className="h-3 bg-primary-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {weekly.challenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <TrophyIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">¿Cómo funcionan los desafíos?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Los desafíos se renuevan cada semana</li>
                <li>• Completá desafíos para ganar puntos extra</li>
                <li>• Los puntos se suman automáticamente a tu total</li>
                <li>• ¡Competí con otros usuarios en el leaderboard!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




