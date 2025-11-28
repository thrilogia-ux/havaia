'use client'

import { Challenge } from '@/lib/challenges'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface ChallengeCardProps {
  challenge: Challenge
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progress = (challenge.progress / challenge.maxProgress) * 100

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all hover-lift ${
      challenge.completed 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{challenge.icon}</div>
          <div>
            <h3 className="font-bold text-gray-900">{challenge.name}</h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        </div>
        {challenge.completed && (
          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">
            {challenge.progress} / {challenge.maxProgress}
          </span>
          <span className="font-semibold text-primary-600">
            +{challenge.points} puntos
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              challenge.completed
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}




