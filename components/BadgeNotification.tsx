'use client'

import { useEffect, useState } from 'react'
import { SparklesIcon } from '@heroicons/react/24/solid'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

interface BadgeNotificationProps {
  badge: Badge | null
  onClose: () => void
}

export default function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (badge) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [badge, onClose])

  if (!badge || !show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/50 backdrop-blur-sm absolute inset-0" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-badge-pop pointer-events-auto">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative text-6xl animate-bounce">{badge.icon}</div>
          </div>
          <SparklesIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2 animate-spin-slow" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Badge Desbloqueado!</h3>
          <p className="text-xl font-semibold text-primary-600 mb-1">{badge.name}</p>
          <p className="text-gray-600">{badge.description}</p>
        </div>
      </div>
    </div>
  )
}




