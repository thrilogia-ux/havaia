'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LeaderboardCard from '@/components/LeaderboardCard'
import { getCurrentUser } from '@/lib/auth'
import { getLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard'
import { TrophyIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/solid'

export default function LeaderboardPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setLeaderboard(getLeaderboard())
  }, [user, router])

  if (!user) return null

  const currentUserEntry = leaderboard.find(e => e.userId === user.id)
  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-gray-600">
            Competí con otros usuarios y alcanzá el top
          </p>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {topThree[1] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl p-6 mb-4 transform scale-90">
                  <div className="text-6xl mb-2">🥈</div>
                  <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold">
                    {topThree[1].userName.charAt(0)}
                  </div>
                  <p className="font-bold text-white text-lg">{topThree[1].userName}</p>
                  <p className="text-white/80 text-sm">{topThree[1].userCity}</p>
                  <p className="text-2xl font-bold text-white mt-2">{topThree[1].points}</p>
                </div>
              </div>
            )}
            
            {topThree[0] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-8 mb-4 transform scale-105 animate-pulse-glow">
                  <div className="text-6xl mb-2">🥇</div>
                  <div className="w-20 h-20 bg-yellow-700 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold">
                    {topThree[0].userName.charAt(0)}
                  </div>
                  <p className="font-bold text-white text-xl">{topThree[0].userName}</p>
                  <p className="text-white/90 text-sm">{topThree[0].userCity}</p>
                  <p className="text-3xl font-bold text-white mt-2">{topThree[0].points}</p>
                </div>
              </div>
            )}

            {topThree[2] && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-300 to-orange-500 rounded-xl p-6 mb-4 transform scale-90">
                  <div className="text-6xl mb-2">🥉</div>
                  <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold">
                    {topThree[2].userName.charAt(0)}
                  </div>
                  <p className="font-bold text-white text-lg">{topThree[2].userName}</p>
                  <p className="text-white/80 text-sm">{topThree[2].userCity}</p>
                  <p className="text-2xl font-bold text-white mt-2">{topThree[2].points}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current User Highlight */}
        {currentUserEntry && currentUserEntry.rank > 3 && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Tu posición</p>
                <p className="text-3xl font-bold">#{currentUserEntry.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 mb-1">Tus puntos</p>
                <p className="text-3xl font-bold">{currentUserEntry.points}</p>
              </div>
            </div>
            {currentUserEntry.rank > 1 && (
              <p className="text-primary-100 text-sm mt-2">
                Te faltan {leaderboard[currentUserEntry.rank - 2].points - currentUserEntry.points} puntos para subir al puesto #{currentUserEntry.rank - 1}
              </p>
            )}
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ranking Completo</h2>
          <div className="space-y-2">
            {rest.map(entry => (
              <LeaderboardCard key={entry.userId} entry={entry} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
            <p className="text-sm text-gray-600">Usuarios activos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(...leaderboard.map(e => e.streak), 0)}
            </p>
            <p className="text-sm text-gray-600">Racha máxima</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <SparklesIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {leaderboard.reduce((sum, e) => sum + e.points, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Puntos totales</p>
          </div>
        </div>
      </div>
    </div>
  )
}




