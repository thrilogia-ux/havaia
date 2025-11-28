'use client'

import { useState } from 'react'
import { UserIcon } from '@heroicons/react/24/solid'
import { UserIcon as UserIconOutline } from '@heroicons/react/24/outline'
import { useI18n } from './Providers'
import { t } from '@/lib/i18n'

interface Seat {
  id: number
  x: number // Porcentaje desde la izquierda
  y: number // Porcentaje desde arriba
  angle: number // Rotación en grados
  reserved: boolean
  userName?: string
  userAvatar?: string
}

interface TableVisualizationProps {
  maxSeats: number
  reservedSeats: number
  reservations: Array<{
    userId: string
    userName: string
    userAvatar?: string
    seats: number
  }>
  currentUserId?: string
}

export default function TableVisualization({
  maxSeats,
  reservedSeats,
  reservations,
  currentUserId
}: TableVisualizationProps) {
  const { locale } = useI18n()
  // Configuración de la mesa: 10 sillas alrededor de una mesa redonda
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const radius = 38 // Radio más grande para que los usuarios estén más abiertos (entre círculo exterior y central)
    const centerX = 50
    const centerY = 50
    
    let reservedCount = 0
    
    for (let i = 0; i < maxSeats; i++) {
      const angle = (i * 360) / maxSeats
      const radian = (angle * Math.PI) / 180
      
      const x = centerX + radius * Math.cos(radian)
      const y = centerY + radius * Math.sin(radian)
      
      // Determinar si está reservado
      let isReserved = false
      let userName: string | undefined
      let userAvatar: string | undefined
      
      if (reservedCount < reservedSeats) {
        // Encontrar la reserva correspondiente
        let seatIndex = 0
        for (const reservation of reservations) {
          if (reservedCount >= seatIndex && reservedCount < seatIndex + reservation.seats) {
            isReserved = true
            userName = reservation.userName
            userAvatar = reservation.userAvatar
            break
          }
          seatIndex += reservation.seats
        }
        reservedCount++
      }
      
      seats.push({
        id: i,
        x,
        y,
        angle: angle + 90, // Ajustar para que las sillas miren hacia el centro
        reserved: isReserved,
        userName,
        userAvatar
      })
    }
    
    return seats
  }

  const seats = generateSeats()
  const availableSeats = maxSeats - reservedSeats

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative aspect-square">
        {/* Fondo elegante con sombra suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-full border-4 shadow-xl" style={{ borderColor: '#9a4aa6' }}>
          {/* Mesa central - diseño más elegante */}
          <div className="absolute inset-10 rounded-full shadow-2xl flex items-center justify-center border-2" style={{ backgroundColor: '#fb6063', borderColor: 'rgba(251, 96, 99, 0.2)' }}>
            {/* Centro de la mesa con diseño más refinado */}
            <div className="text-center">
              <p className="text-white font-bold text-xl leading-tight">{reservedSeats}</p>
              <div className="h-px w-8 bg-white/40 mx-auto my-1"></div>
              <p className="text-white/90 text-xs font-medium">{maxSeats} {t(locale, 'table_seats')}</p>
            </div>
          </div>

          {/* Sillas - diseño más elegante y compacto */}
          {seats.map((seat) => (
            <div
              key={seat.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                transform: `translate(-50%, -50%) rotate(${seat.angle}deg)`
              }}
            >
              {seat.reserved ? (
                <div className="relative group">
                  {/* Silla ocupada - diseño premium */}
                  <div className="relative">
                    {/* Sombra de la silla */}
                    <div className="absolute inset-0 bg-primary-900/20 rounded-full blur-sm"></div>
                    {/* Avatar/Usuario */}
                    <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center ring-2 ring-primary-200/50">
                      {seat.userAvatar ? (
                        <img
                          src={seat.userAvatar}
                          alt={seat.userName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-white" />
                      )}
                      {/* Indicador de ocupado */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                  </div>
                  {/* Tooltip con nombre */}
                  {seat.userName && (
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap font-medium">
                        {seat.userName}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  {/* Silla disponible - diseño más sutil */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center opacity-50">
                    <UserIconOutline className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info compacta y elegante */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 bg-primary-500 rounded-full border border-white shadow-sm"></div>
              <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <span className="text-xs font-semibold text-gray-700">{reservedSeats} {t(locale, 'table_occupied')}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full border border-white"></div>
            <span className="text-xs font-semibold text-gray-600">{availableSeats} {t(locale, 'table_available')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
