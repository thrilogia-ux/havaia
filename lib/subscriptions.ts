// Sistema de suscripciones y planes

export type PlanType = 'free' | 'premium' | 'host_basic' | 'host_pro'

export interface Plan {
  id: PlanType
  name: string
  price: number
  priceAnnual?: number
  currency: string
  features: string[]
  badge?: string
  popular?: boolean
}

export interface UserSubscription {
  planId: PlanType
  status: 'active' | 'cancelled' | 'expired'
  startDate: number
  endDate?: number
  autoRenew: boolean
  paymentMethod?: string
}

export const USER_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'USD',
    features: [
      'Acceso a experiencias básicas',
      'Crear hasta 2 grupos por mes',
      'Participar en grupos ilimitados',
      'Acceso a comunidad',
      'Badges básicos',
      'Soporte por email'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    priceAnnual: 99.99, // ~17% descuento
    currency: 'USD',
    badge: '⭐',
    popular: true,
    features: [
      'Todo del plan Gratis',
      'Acceso a experiencias premium',
      'Crear grupos ilimitados',
      'Prioridad en reservas',
      'Badges exclusivos',
      'Estadísticas avanzadas',
      'Sin anuncios',
      'Soporte prioritario 24/7',
      'Descuentos exclusivos',
      'Eventos VIP'
    ]
  }
]

export const HOST_PLANS: Plan[] = [
  {
    id: 'host_basic',
    name: 'Anfitrión Básico',
    price: 19.99,
    currency: 'USD',
    features: [
      'Publicar hasta 5 experiencias',
      'Comisión del 15% por reserva',
      'Dashboard básico',
      'Soporte por email',
      'Pagos mensuales'
    ]
  },
  {
    id: 'host_pro',
    name: 'Anfitrión Pro',
    price: 49.99,
    currency: 'USD',
    badge: '🔥',
    popular: true,
    features: [
      'Experiencias ilimitadas',
      'Comisión reducida al 10%',
      'Dashboard avanzado con analytics',
      'Experiencias destacadas',
      'Soporte prioritario',
      'Pagos semanales',
      'Herramientas de marketing',
      'Badge "Anfitrión Verificado"'
    ]
  }
]

export function getUserSubscription(): UserSubscription | null {
  if (typeof window === 'undefined') return null
  const subStr = localStorage.getItem('gentum_subscription')
  return subStr ? JSON.parse(subStr) : null
}

export function saveUserSubscription(subscription: UserSubscription): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_subscription', JSON.stringify(subscription))
}

export function getUserPlan(): PlanType {
  const subscription = getUserSubscription()
  if (!subscription || subscription.status !== 'active') {
    return 'free'
  }
  
  // Verificar si expiró
  if (subscription.endDate && subscription.endDate < Date.now()) {
    return 'free'
  }
  
  return subscription.planId
}

export function hasActiveSubscription(): boolean {
  const plan = getUserPlan()
  return plan !== 'free'
}

export function isPremium(): boolean {
  return getUserPlan() === 'premium'
}

export function canCreateUnlimitedGroups(): boolean {
  const plan = getUserPlan()
  return plan === 'premium'
}

export function canAccessPremiumExperiences(): boolean {
  return isPremium()
}

export function getGroupsLimit(): number {
  const plan = getUserPlan()
  if (plan === 'premium') return Infinity
  return 2 // Límite mensual para free
}

export function getHostPlan(): PlanType | null {
  if (typeof window === 'undefined') return null
  const hostPlanStr = localStorage.getItem('gentum_host_plan')
  return hostPlanStr ? (hostPlanStr as PlanType) : null
}

export function saveHostPlan(planId: PlanType): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_host_plan', planId)
}

export function getCommissionRate(): number {
  const hostPlan = getHostPlan()
  if (hostPlan === 'host_pro') return 0.10 // 10%
  if (hostPlan === 'host_basic') return 0.15 // 15%
  return 0.20 // 20% para no suscriptores
}




