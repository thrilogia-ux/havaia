'use client'

import { CalendarIcon } from '@heroicons/react/24/outline'
import type { PremiumExperience, PremiumExperienceDate } from '@/lib/premium-experiences'
import { getNextAvailableDate } from '@/lib/premium-experiences'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

interface PremiumExperienceCalendarProps {
  experience: PremiumExperience
  selectedDate?: string
  onDateSelect?: (date: string) => void
}

export default function PremiumExperienceCalendar({ 
  experience, 
  selectedDate,
  onDateSelect 
}: PremiumExperienceCalendarProps) {
  const { locale } = useI18n()
  if (!experience.dates || experience.dates.length === 0) {
    return null
  }

  // Filtrar solo fechas futuras y ordenar
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const availableDates = experience.dates
    .filter(dateInfo => {
      const date = new Date(dateInfo.date)
      date.setHours(0, 0, 0, 0)
      return date >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8) // Mostrar solo las próximas 8 semanas

  if (availableDates.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-semibold">{t(locale as Locale, 'premium_no_seats')}</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const localeMap: Record<Locale, string> = {
      es: 'es-AR',
      en: 'en-US',
      he: 'he-IL'
    }
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }
    return date.toLocaleDateString(localeMap[locale as Locale] || 'es-AR', options)
  }

  const isDateFull = (dateInfo: PremiumExperienceDate) => {
    return dateInfo.reservedSeats >= experience.maxSeats
  }

  const isDateSelected = (date: string) => {
    return selectedDate === date
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900">{t(locale as Locale, 'premium_next_dates')}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableDates.map((dateInfo) => {
          const full = isDateFull(dateInfo)
          const selected = isDateSelected(dateInfo.date)
          const available = experience.maxSeats - dateInfo.reservedSeats
          
          return (
            <button
              key={dateInfo.date}
              onClick={() => onDateSelect && !full && onDateSelect(dateInfo.date)}
              disabled={full}
              className={`
                text-left p-4 rounded-lg border-2 transition-all
                ${selected 
                  ? 'border-primary-500 bg-primary-50' 
                  : full
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={`font-semibold ${selected ? 'text-primary-700' : 'text-gray-900'}`}>
                  {formatDate(dateInfo.date)}
                </p>
                {selected && (
                  <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                    {t(locale as Locale, 'premium_card_selected')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {full ? (
                  <span className="text-red-600 font-medium">{t(locale as Locale, 'premium_card_full')}</span>
                ) : (
                  <>
                    <span className="text-gray-600">
                      {available} {t(locale as Locale, 'premium_card_seats_of')} {experience.maxSeats} {t(locale as Locale, 'table_seats')}
                    </span>
                    <span className="text-green-600 font-medium">{t(locale as Locale, 'exp_spots_free')}</span>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {availableDates.length === 0 && (
        <p className="text-gray-500 text-sm mt-4 text-center">
          {t(locale as Locale, 'premium_no_seats')}
        </p>
      )}
    </div>
  )
}

