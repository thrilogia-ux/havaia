'use client'

import { useState, useEffect } from 'react'
import { getUserStats } from '@/lib/gamification'
import { FireIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/outline'

export default function UserStats() {
  const [stats, setStats] = useState(getUserStats())

  useEffect(() => {
    setStats(getUserStats())
  }, [])

  const progressToNextLevel = (stats.points % 100) / 100 * 100

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-primary-100 text-sm mb-1">Nivel {stats.level}</p>
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-6 h-6 text-yellow-300" />
            <span className="text-2xl font-bold">{stats.points} puntos</span>
          </div>
        </div>
        {stats.streak > 0 && (
          <div className="text-center">
            <FireIcon className="w-8 h-8 text-orange-300 mx-auto mb-1 animate-pulse" />
            <p className="text-sm font-semibold">{stats.streak}</p>
            <p className="text-xs text-primary-100">días</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-primary-100 mb-1">
          <span>Progreso al nivel {stats.level + 1}</span>
          <span>{stats.points % 100}/100</span>
        </div>
        <div className="h-2 bg-primary-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 progress-bar"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
      </div>

      {/* Badges preview */}
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-4 h-4" />
        <span className="text-sm">
          {stats.badges.filter(b => b.unlocked).length} de {stats.badges.length} badges
        </span>
      </div>
    </div>
  )
}




