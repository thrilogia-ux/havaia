'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getCurrentUser } from '@/lib/auth'

interface Notification {
  id: number
  type: 'like' | 'comment' | 'message' | 'reservation' | 'group' | 'achievement'
  title: string
  message: string
  timestamp: number
  read: boolean
  link?: string
}

export default function NotificacionesPage() {
  const user = getCurrentUser()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user) return
    
    // Cargar notificaciones desde localStorage
    const stored = localStorage.getItem(`gentum_notifications_${user.id}`)
    if (stored) {
      setNotifications(JSON.parse(stored))
    } else {
      // Notificaciones de ejemplo
      const example: Notification[] = [
        {
          id: 1,
          type: 'like',
          title: 'Nuevo like',
          message: 'A alguien le gustó tu post en la comunidad',
          timestamp: Date.now() - 3600000,
          read: false,
          link: '/comunidad'
        },
        {
          id: 2,
          type: 'comment',
          title: 'Nuevo comentario',
          message: 'Comentaron en tu publicación',
          timestamp: Date.now() - 7200000,
          read: false,
          link: '/comunidad'
        },
        {
          id: 3,
          type: 'achievement',
          title: '¡Logro desbloqueado!',
          message: 'Desbloqueaste el badge "Explorador"',
          timestamp: Date.now() - 86400000,
          read: true,
          link: '/dashboard'
        }
      ]
      setNotifications(example)
      localStorage.setItem(`gentum_notifications_${user.id}`, JSON.stringify(example))
    }
  }, [user])

  const markAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    if (user) {
      localStorage.setItem(`gentum_notifications_${user.id}`, JSON.stringify(updated))
    }
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    if (user) {
      localStorage.setItem(`gentum_notifications_${user.id}`, JSON.stringify(updated))
    }
  }

  const deleteNotification = (id: number) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    if (user) {
      localStorage.setItem(`gentum_notifications_${user.id}`, JSON.stringify(updated))
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Iniciá sesión para ver tus notificaciones</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">{unreadCount} sin leer</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tenés notificaciones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border p-4 flex items-start gap-4 transition-colors ${
                    !notification.read ? 'border-primary-200 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'like' ? 'bg-red-100 text-red-600' :
                    notification.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-primary-100 text-primary-600'
                  }`}>
                    <BellIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.timestamp).toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Marcar como leída"
                      >
                        <CheckIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

