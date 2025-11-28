'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconOutline,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { getCurrentUser } from '@/lib/auth'
import { reservasAPI } from '@/lib/api'

type Reserva = {
  id: number
  userId: string
  userName: string
  experienciaId: number
  experienciaTitle: string
  amount: number
  currency: string
  method: string
  slot: { date: string; time: string }
  status: 'pending' | 'paid' | 'cancelled' | 'completed'
  paymentId?: string
  redirectUrl?: string
  createdAt: number
}

export default function ReservasPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    if (currentUser) {
      loadReservas()
    } else {
      setLoading(false)
    }
  }, [])

  const loadReservas = async () => {
    try {
      setLoading(true)
      const data = await reservasAPI.getByUser()
      setReservas(data)
    } catch (error) {
      console.error('Error cargando reservas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Iniciá sesión para ver tus reservas</h1>
          <Link 
            href="/login" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        icon: ClockIconOutline,
        text: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      paid: {
        icon: CheckCircleIcon,
        text: 'Confirmada',
        color: 'bg-green-100 text-green-800 border-green-200',
      },
      cancelled: {
        icon: XCircleIcon,
        text: 'Cancelada',
        color: 'bg-red-100 text-red-800 border-red-200',
      },
      completed: {
        icon: CheckCircleIcon,
        text: 'Completada',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      },
    }
    
    const badge = badges[status as keyof typeof badges] || badges.pending
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    )
  }

  const getMethodBadge = (method: string) => {
    const methods: Record<string, { text: string; color: string }> = {
      mercadopago: { text: 'MercadoPago', color: 'bg-blue-100 text-blue-700' },
      paypal: { text: 'PayPal', color: 'bg-indigo-100 text-indigo-700' },
      card: { text: 'Tarjeta', color: 'bg-purple-100 text-purple-700' },
      stripe: { text: 'Stripe', color: 'bg-purple-100 text-purple-700' },
    }
    
    const methodInfo = methods[method] || { text: method, color: 'bg-gray-100 text-gray-700' }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${methodInfo.color}`}>
        <CreditCardIcon className="w-3 h-3" />
        {methodInfo.text}
      </span>
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Todas tus experiencias reservadas y pagadas</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : reservas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CalendarDaysIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tenés reservas aún</h2>
            <p className="text-gray-600 mb-6">Reservá tu primera experiencia y aparecerá acá</p>
            <Link
              href="/experiencias"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explorar experiencias
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {reserva.experienciaTitle}
                        </h3>
                        <Link
                          href={`/experiencias/${reserva.experienciaId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Ver detalles de la experiencia →
                        </Link>
                      </div>
                      {getStatusBadge(reserva.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                        <span className="font-medium">{reserva.slot.date}</span>
                        <span className="text-gray-400">•</span>
                        <ClockIcon className="w-4 h-4 text-primary-600" />
                        <span>{reserva.slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon className="w-5 h-5 text-primary-600" />
                        <span>Reservado el {formatDate(reserva.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {reserva.currency === 'USD' ? '$' : '$'} {reserva.amount}
                      </span>
                      {getMethodBadge(reserva.method)}
                      {reserva.paymentId && (
                        <span className="text-xs text-gray-500">
                          ID: {reserva.paymentId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    {reserva.status === 'pending' && reserva.redirectUrl && (
                      <a
                        href={reserva.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Completar pago
                      </a>
                    )}
                    {reserva.status === 'paid' && (
                      <Link
                        href={`/grupos/crear?experiencia=${reserva.experienciaId}`}
                        className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Ver grupo
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


