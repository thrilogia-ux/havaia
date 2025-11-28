'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/auth'
import { USER_PLANS, HOST_PLANS, getUserPlan, getUserSubscription, saveUserSubscription, type Plan, type UserSubscription } from '@/lib/subscriptions'
import { CheckIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { showToast } from '@/components/ToastContainer'

export default function PlanesPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [currentPlan, setCurrentPlan] = useState(getUserPlan())
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedTab, setSelectedTab] = useState<'user' | 'host'>('user')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentPlan(getUserPlan())
  }, [user, router])

  if (!user) return null

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      showToast('Ya tenés el plan gratuito', 'info')
      return
    }

    // Simulación de checkout (en producción sería Stripe/PayPal)
    const subscription: UserSubscription = {
      planId: planId as any,
      status: 'active',
      startDate: Date.now(),
      endDate: billingCycle === 'monthly' 
        ? Date.now() + (30 * 24 * 60 * 60 * 1000)
        : Date.now() + (365 * 24 * 60 * 60 * 1000),
      autoRenew: true
    }

    saveUserSubscription(subscription)
    setCurrentPlan(planId as any)
    showToast(`¡Plan ${planId === 'premium' ? 'Premium' : ''} activado! 🎉`, 'success', 5000)
    
    // Redirigir al dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const plans = selectedTab === 'user' ? USER_PLANS : HOST_PLANS

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elige tu plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloqueá todas las funcionalidades y disfrutá de experiencias exclusivas
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 inline-flex shadow-sm">
            <button
              onClick={() => setSelectedTab('user')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Para Viajeros
            </button>
            <button
              onClick={() => setSelectedTab('host')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === 'host'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Para Anfitriones
            </button>
          </div>
        </div>

        {/* Billing Cycle Toggle (solo para usuarios) */}
        {selectedTab === 'user' && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 inline-flex shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600'
                }`}
              >
                Anual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            const price = billingCycle === 'annual' && plan.priceAnnual 
              ? plan.priceAnnual 
              : plan.price

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg p-8 relative transition-all hover-lift ${
                  plan.popular ? 'border-2 border-primary-500 scale-105' : 'border border-gray-200'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckIcon className="w-4 h-4" />
                    Plan Actual
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.badge && <span className="text-2xl">{plan.badge}</span>}
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">${price}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{billingCycle === 'annual' ? 'año' : 'mes'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'annual' && plan.priceAnnual && (
                    <p className="text-sm text-gray-500">
                      Ahorrá ${((plan.price * 12) - plan.priceAnnual).toFixed(2)} por año
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary-500 hover:bg-primary-600 text-white hover-lift shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {isCurrentPlan ? 'Plan Actual' : plan.price === 0 ? 'Plan Actual' : 'Suscribirse'}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Puedo cancelar en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, podés cancelar tu suscripción en cualquier momento. No hay penalizaciones ni cargos ocultos.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-gray-600">
                Aceptamos tarjetas de crédito/débito, PayPal y transferencias bancarias.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Hay período de prueba?
              </h3>
              <p className="text-gray-600">
                Sí, ofrecemos 7 días de prueba gratis para el plan Premium. Sin tarjeta de crédito requerida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




