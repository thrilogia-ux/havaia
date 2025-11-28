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
    title: '¡Bienvenido a Gentum.ar! 🎉',
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
    
    const hasCompleted = localStorage.getItem('gentum_onboarding_completed')
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
    localStorage.setItem('gentum_onboarding_completed', 'true')
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md pointer-events-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-semibold">
              {currentStep + 1} / {ONBOARDING_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 mb-6">{step.description}</p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Saltar
          </button>
          <button
            onClick={handleNext}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep
                  ? 'bg-primary-500 w-6'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}




