'use client'

import Header from '@/components/Header'
import PremiumExperienceCard from '@/components/PremiumExperienceCard'
import { getPremiumExperiences } from '@/lib/premium-experiences'
import { useState, useEffect } from 'react'
import { useI18n } from '@/components/Providers'
import { t, type Locale } from '@/lib/i18n'

export default function PremiumExperiencesPage() {
  const { locale } = useI18n()
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiences()
    // Recargar cada 2 segundos para ver actualizaciones en tiempo real
    const interval = setInterval(() => {
      loadExperiences()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [locale])

  const loadExperiences = () => {
    try {
      setLoading(true)
      // Usar la función local directamente (más confiable) con traducciones
      const data = getPremiumExperiences(locale as Locale)
      setExperiences(data)
    } catch (error) {
      console.error('Error cargando experiencias premium:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t(locale as Locale, 'premium_experiences_page_title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(locale as Locale, 'premium_experiences_page_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t(locale as Locale, 'exp_loading')}</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t(locale as Locale, 'exp_not_found')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience, idx) => (
                <PremiumExperienceCard
                  key={experience.id}
                  experience={experience}
                  featured={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

