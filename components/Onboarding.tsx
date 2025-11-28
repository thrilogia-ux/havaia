'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target?: string // Selector CSS del elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Havaia! 🎉',
    description: 'Te vamos a mostrar las mejores funcionalidades de la app',
    position: 'bottom',
  },
  {
    id: 'experiencias',
    title: 'Explorá Experiencias',
    description: 'Descubrí actividades curadas especialmente para vos. Podés filtrar por categoría, precio e idioma.',
    target: 'a[href="/experiencias"]',
    position: 'bottom',
  },
  {
    id: 'favoritos',
    title: 'Guardá tus Favoritos',
    description: 'Hacé clic en el corazón para guardar experiencias que te interesen y encontrarlas fácilmente después.',
    position: 'left',
  },
  {
    id: 'grupos',
    title: 'Creá o Unite a Grupos',
    description: 'Armá tu propio grupo o unite a uno existente para vivir experiencias con otros viajeros.',
    target: 'a[href="/grupos"]',
    position: 'bottom',
  },
  {
    id: 'dashboard',
    title: 'Tu Dashboard',
    description: 'Seguí tu progreso, badges, puntos y desafíos semanales desde tu dashboard personal.',
    position: 'left',
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const hasCompleted = localStorage.getItem('havaia_onboarding_completed')
    if (!hasCompleted) {
      setCurrentStep(0)
    } else {
      setCompleted(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep === null) return
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('havaia_onboarding_completed', 'true')
    setCurrentStep(null)
    setCompleted(true)
  }

  if (completed || currentStep === null) return null

  const step = ONBOARDING_STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Tooltip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-[90%] sm:w-full pointer-events-auto mx-4">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
              {currentStep + 1} / {ONBOARDING_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Cerrar"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* Logo en el paso de bienvenida */}
        {currentStep === 0 && (
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/logo-havaia.png"
              alt="Havaia"
              className="h-16 sm:h-20 w-auto"
            />
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{step.title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">{step.description}</p>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base px-4 py-2 sm:py-2.5 transition-colors"
          >
            Saltar
          </button>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 shadow-lg"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 sm:h-2.5 rounded-full transition-all ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 w-6 sm:w-8'
                  : 'bg-gray-300 w-2 sm:w-2.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}




