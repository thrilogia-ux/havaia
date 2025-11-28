'use client'

import { LeaderboardEntry } from '@/lib/leaderboard'
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid'
import { getCurrentUser } from '@/lib/auth'

interface LeaderboardCardProps {
  entry: LeaderboardEntry
}

export default function LeaderboardCard({ entry }: LeaderboardCardProps) {
  const currentUser = getCurrentUser()
  const isCurrentUser = currentUser?.id === entry.userId

  const getRankIcon = () => {
    if (entry.rank === 1) return '🥇'
    if (entry.rank === 2) return '🥈'
    if (entry.rank === 3) return '🥉'
    return `#${entry.rank}`
  }

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-all hover-lift ${
      isCurrentUser
        ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-300'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="text-2xl font-bold w-12 text-center">
        {entry.rank <= 3 ? getRankIcon() : `#${entry.rank}`}
      </div>
      
      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {entry.userName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{entry.userName}</p>
          {isCurrentUser && (
            <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full font-semibold">
              Vos
            </span>
          )}
        </div>
        {entry.userCity && (
          <p className="text-sm text-gray-600">{entry.userCity}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <TrophyIcon className="w-4 h-4 text-yellow-500" />
            <span>Nivel {entry.level}</span>
          </div>
          {entry.streak > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <FireIcon className="w-4 h-4" />
              <span>{entry.streak} días</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-primary-600">{entry.points}</p>
        <p className="text-xs text-gray-600">puntos</p>
      </div>
    </div>
  )
}




