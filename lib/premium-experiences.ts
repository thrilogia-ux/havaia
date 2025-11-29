// Experiencias gastronómicas premium destacadas
// Usa localStorage en el cliente, pero optimizado para evitar exceder el límite
import { type Locale } from './i18n'
import { premiumExperienceTranslations } from './experiences-translations'

export interface PremiumExperienceReservation {
  userId: string
  userName: string
  userAvatar?: string
  seats: number
  timestamp: number
  date: string // Fecha específica de la reserva
}

export interface PremiumExperienceDate {
  date: string // Fecha en formato YYYY-MM-DD
  reservedSeats: number
  reservations: PremiumExperienceReservation[]
}

export interface PremiumExperience {
  id: number
  title: string
  restaurant: string
  description: string
  image: string
  price: number
  maxSeats: number
  time: string
  location: string
  includes: string[]
  highlights: string[]
  rating: number
  reviews: number
  dates: PremiumExperienceDate[] // Múltiples fechas semanales
  // Mantener compatibilidad con código antiguo
  date?: string
  reservedSeats?: number
  reservations?: Array<{
    userId: string
    userName: string
    userAvatar?: string
    seats: number
    timestamp: number
  }>
}

// Función para generar fechas semanales (8 semanas desde hoy)
function generateWeeklyDates(startDate?: Date): PremiumExperienceDate[] {
  const dates: PremiumExperienceDate[] = []
  const start = startDate || new Date()
  
  // Generar 8 semanas de fechas
  for (let i = 0; i < 8; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + (i * 7)) // Cada semana
    
    dates.push({
      date: date.toISOString().split('T')[0],
      reservedSeats: 0,
      reservations: []
    })
  }
  
  return dates
}

export const premiumExperiences: PremiumExperience[] = [
  {
    id: 1,
    title: 'Experiencia Don Julio',
    restaurant: 'Don Julio',
    description: 'Una experiencia gastronómica de alto nivel en la mejor parrilla del mundo. Mesa especialmente reservada para 10 personas. Conocé a otros viajeros o simplemente disfrutá de una cena exclusiva.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop',
    price: 25000,
    maxSeats: 10,
    time: '20:00',
    location: 'Guatemala 4691, Palermo, CABA',
    includes: [
      'Cena completa de 7 pasos',
      'Selección de vinos premium',
      'Mesa exclusiva reservada',
      'Servicio de sommelier',
      'Propina incluida (opcional)'
    ],
    highlights: [
      'Mejor parrilla del mundo según The World\'s 50 Best Restaurants',
      'Ambiente exclusivo y elegante',
      'Oportunidad de conocer a otros viajeros'
    ],
    rating: 4.9,
    reviews: 1247,
    dates: generateWeeklyDates()
  },
  {
    id: 2,
    title: 'Experiencia Tegui',
    restaurant: 'Tegui',
    description: 'Cena degustación en uno de los restaurantes más exclusivos de Buenos Aires. Cocina de autor con ingredientes locales de primera calidad.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
    price: 35000,
    maxSeats: 10,
    time: '19:30',
    location: 'Costa Rica 5852, Palermo, CABA',
    includes: [
      'Menú degustación de 10 pasos',
      'Maridaje de vinos',
      'Mesa privada',
      'Chef\'s table experience'
    ],
    highlights: [
      'Restaurante top 50 del mundo',
      'Cocina de autor',
      'Experiencia única e inolvidable'
    ],
    rating: 4.8,
    reviews: 892,
    dates: generateWeeklyDates()
  },
  {
    id: 3,
    title: 'Experiencia Aramburu',
    restaurant: 'Aramburu',
    description: 'Cena íntima en uno de los restaurantes más exclusivos de Buenos Aires. Cocina molecular y de autor con ingredientes premium.',
    image: 'https://images.unsplash.com/photo-1552569973-5e3b8f5b0b0e?w=1200&h=800&fit=crop',
    price: 40000,
    maxSeats: 10,
    time: '20:30',
    location: 'Salta 1050, San Telmo, CABA',
    includes: [
      'Menú degustación de 12 pasos',
      'Maridaje premium',
      'Mesa exclusiva',
      'Show cooking'
    ],
    highlights: [
      'Cocina molecular de vanguardia',
      'Ambiente íntimo y exclusivo',
      'Experiencia gastronómica única'
    ],
    rating: 4.9,
    reviews: 634,
    dates: generateWeeklyDates()
  }
]

// Función para limpiar datos grandes de localStorage
function cleanLocalStorage() {
  if (typeof window === 'undefined') return
  
  try {
    // Limpiar datos antiguos de experiencias premium si existen
    const oldData = localStorage.getItem('gentum_premium_experiences')
    if (oldData) {
      localStorage.removeItem('gentum_premium_experiences')
    }
  } catch (error) {
    console.error('Error limpiando localStorage:', error)
  }
}

// Función optimizada para guardar (sin imágenes grandes)
function saveToStorage(experiences: PremiumExperience[]) {
  if (typeof window === 'undefined') return
  
  try {
    // Limitar el tamaño: solo guardar datos esenciales, no imágenes completas
    const optimized = experiences.map(exp => ({
      ...exp,
      // Asegurar que las imágenes sean solo URLs, no base64
      image: exp.image?.startsWith('data:') ? '' : exp.image,
      // Guardar dates con reservas optimizadas
      dates: exp.dates?.map(dateInfo => ({
        ...dateInfo,
        reservations: dateInfo.reservations.map(r => ({
          ...r,
          userAvatar: r.userAvatar && r.userAvatar.startsWith('data:') 
            ? '' // No guardar imágenes base64 grandes
            : r.userAvatar
        }))
      })),
      // Mantener compatibilidad con código antiguo
      reservations: exp.reservations?.map(r => ({
        ...r,
        userAvatar: r.userAvatar && r.userAvatar.startsWith('data:') 
          ? '' // No guardar imágenes base64 grandes
          : r.userAvatar
      }))
    }))
    
    const data = JSON.stringify(optimized)
    
    // Si el dato es muy grande, limpiar y usar solo datos básicos
    if (data.length > 1000000) { // 1MB
      console.warn('Datos demasiado grandes, limpiando...')
      cleanLocalStorage()
      // Guardar solo estructura básica
      const minimal = optimized.map(exp => ({
        id: exp.id,
        dates: exp.dates?.map(d => ({
          date: d.date,
          reservedSeats: d.reservedSeats,
          reservations: d.reservations.map(r => ({
            userId: r.userId,
            userName: r.userName,
            seats: r.seats,
            timestamp: r.timestamp,
            date: r.date
          }))
        }))
      }))
      localStorage.setItem('gentum_premium_experiences_minimal', JSON.stringify(minimal))
      return
    }
    
    localStorage.setItem('gentum_premium_experiences', data)
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage lleno, limpiando datos antiguos...')
      cleanLocalStorage()
      // Intentar guardar solo datos esenciales
      try {
        const minimal = experiences.map(exp => ({
          id: exp.id,
          dates: exp.dates?.map(d => ({
            date: d.date,
            reservedSeats: d.reservedSeats,
            reservations: d.reservations.map(r => ({
              userId: r.userId,
              userName: r.userName,
              seats: r.seats,
              timestamp: r.timestamp,
              date: r.date
            }))
          }))
        }))
        localStorage.setItem('gentum_premium_experiences_minimal', JSON.stringify(minimal))
      } catch (e) {
        console.error('No se pudo guardar ni siquiera datos mínimos:', e)
      }
    } else {
      console.error('Error guardando experiencias premium:', error)
    }
  }
}

// Función helper para normalizar una experiencia (asegurar que tenga dates)
function normalizeExperience(exp: any): PremiumExperience {
  // Si ya tiene dates, usarlo
  if (exp.dates && Array.isArray(exp.dates) && exp.dates.length > 0) {
    return exp as PremiumExperience
  }
  
  // Si tiene reservas antiguas, migrarlas a la primera fecha disponible
  const dates = generateWeeklyDates()
  if (exp.reservations && exp.reservations.length > 0 && dates.length > 0) {
    // Migrar reservas antiguas a la primera fecha
    dates[0].reservations = exp.reservations.map((r: any) => ({
      ...r,
      date: dates[0].date
    }))
    dates[0].reservedSeats = exp.reservedSeats || 0
  }
  
  return {
    ...exp,
    dates,
    // Mantener compatibilidad
    date: dates[0]?.date || new Date().toISOString().split('T')[0],
    reservedSeats: dates[0]?.reservedSeats || 0,
    reservations: dates[0]?.reservations || []
  }
}

// Función para obtener la próxima fecha disponible de una experiencia
export function getNextAvailableDate(experience: PremiumExperience): PremiumExperienceDate | null {
  if (!experience.dates || experience.dates.length === 0) {
    return null
  }
  
  // Encontrar la primera fecha que no esté llena
  for (const dateInfo of experience.dates) {
    if (dateInfo.reservedSeats < experience.maxSeats) {
      return dateInfo
    }
  }
  
  return null // Todas las fechas están llenas
}

export function getPremiumExperiences(locale: Locale = 'es'): PremiumExperience[] {
  if (typeof window === 'undefined') {
    return applyTranslations(premiumExperiences.map(normalizeExperience), locale)
  }
  
  try {
    // Intentar leer datos guardados
    const stored = localStorage.getItem('gentum_premium_experiences')
    const minimal = localStorage.getItem('gentum_premium_experiences_minimal')
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Normalizar cada experiencia
        const normalized = parsed.map((storedExp: any) => {
          const base = premiumExperiences.find(e => e.id === storedExp.id)
          if (base) {
            return normalizeExperience({
              ...base,
              ...storedExp
            })
          }
          return normalizeExperience(storedExp)
        })
        return applyTranslations(normalized, locale)
      } catch (e) {
        console.error('Error parseando datos guardados:', e)
      }
    }
    
    // Si hay datos mínimos, combinarlos con los datos base
    if (minimal) {
      try {
        const minimalData = JSON.parse(minimal)
        const normalized = premiumExperiences.map(baseExp => {
          const minimalExp = minimalData.find((m: any) => m.id === baseExp.id)
          if (minimalExp) {
            return normalizeExperience({
              ...baseExp,
              ...minimalExp
            })
          }
          return normalizeExperience(baseExp)
        })
        return applyTranslations(normalized, locale)
      } catch (e) {
        console.error('Error parseando datos mínimos:', e)
      }
    }
    
    // Inicializar con datos base normalizados
    const normalized = premiumExperiences.map(normalizeExperience)
    saveToStorage(normalized)
    return applyTranslations(normalized, locale)
  } catch (error) {
    console.error('Error leyendo experiencias premium:', error)
    return applyTranslations(premiumExperiences.map(normalizeExperience), locale)
  }
}

// Función para aplicar traducciones a experiencias premium
function applyTranslations(experiences: PremiumExperience[], locale: Locale): PremiumExperience[] {
  return experiences.map(exp => {
    const translations = premiumExperienceTranslations[exp.id as keyof typeof premiumExperienceTranslations]?.[locale]
    if (!translations) return exp
    
    return {
      ...exp,
      title: translations.title,
      description: translations.description,
      includes: translations.includes,
      highlights: translations.highlights,
    }
  })
}

export function getPremiumExperienceById(id: number, date?: string, locale: Locale = 'es'): PremiumExperience | undefined {
  const experiences = getPremiumExperiences(locale)
  const experience = experiences.find(exp => exp.id === id)
  
  if (!experience) return undefined
  
  // Si se especifica una fecha, devolver la experiencia con esa fecha como la próxima
  if (date && experience.dates) {
    const dateInfo = experience.dates.find(d => d.date === date)
    if (dateInfo) {
      return {
        ...experience,
        date: dateInfo.date,
        reservedSeats: dateInfo.reservedSeats,
        reservations: dateInfo.reservations
      }
    }
  }
  
  // Devolver con la próxima fecha disponible
  const nextDate = getNextAvailableDate(experience)
  if (nextDate) {
    return {
      ...experience,
      date: nextDate.date,
      reservedSeats: nextDate.reservedSeats,
      reservations: nextDate.reservations
    }
  }
  
  // Si no hay fechas disponibles, devolver la última fecha
  if (experience.dates && experience.dates.length > 0) {
    const lastDate = experience.dates[experience.dates.length - 1]
    return {
      ...experience,
      date: lastDate.date,
      reservedSeats: lastDate.reservedSeats,
      reservations: lastDate.reservations
    }
  }
  
  return experience
}

export function reservePremiumExperience(
  experienceId: number,
  userId: string,
  userName: string,
  userAvatar: string | undefined,
  seats: number,
  date?: string // Fecha específica, si no se especifica usa la próxima disponible
): boolean {
  const experiences = getPremiumExperiences()
  const experience = experiences.find(exp => exp.id === experienceId)
  
  if (!experience || !experience.dates || experience.dates.length === 0) return false
  
  // Encontrar la fecha donde reservar
  let targetDate: PremiumExperienceDate | null = null
  
  if (date) {
    targetDate = experience.dates.find(d => d.date === date) || null
  } else {
    // Buscar la próxima fecha disponible
    targetDate = getNextAvailableDate(experience)
  }
  
  if (!targetDate) return false // No hay fechas disponibles
  
  // Verificar que hay suficientes lugares
  if (targetDate.reservedSeats + seats > experience.maxSeats) {
    return false
  }
  
  // Hacer la reserva
  targetDate.reservedSeats += seats
  targetDate.reservations.push({
    userId,
    userName,
    // Solo guardar avatar si es URL, no base64 (muy grande)
    userAvatar: userAvatar && !userAvatar.startsWith('data:') ? userAvatar : undefined,
    seats,
    timestamp: Date.now(),
    date: targetDate.date
  })
  
  saveToStorage(experiences)
  return true
}

export function cancelPremiumReservation(experienceId: number, userId: string, date?: string): boolean {
  const experiences = getPremiumExperiences()
  const experience = experiences.find(exp => exp.id === experienceId)
  
  if (!experience || !experience.dates || experience.dates.length === 0) return false
  
  // Buscar la reserva en todas las fechas o en una fecha específica
  let found = false
  
  if (date) {
    const dateInfo = experience.dates.find(d => d.date === date)
    if (dateInfo) {
      const reservation = dateInfo.reservations.find(r => r.userId === userId)
      if (reservation) {
        dateInfo.reservedSeats -= reservation.seats
        dateInfo.reservations = dateInfo.reservations.filter(r => r.userId !== userId)
        found = true
      }
    }
  } else {
    // Buscar en todas las fechas
    for (const dateInfo of experience.dates) {
      const reservation = dateInfo.reservations.find(r => r.userId === userId)
      if (reservation) {
        dateInfo.reservedSeats -= reservation.seats
        dateInfo.reservations = dateInfo.reservations.filter(r => r.userId !== userId)
        found = true
        break
      }
    }
  }
  
  if (!found) return false
  
  saveToStorage(experiences)
  return true
}

// Limpiar localStorage al cargar (solo una vez)
if (typeof window !== 'undefined') {
  // Limpiar datos antiguos si existen
  try {
    const oldData = localStorage.getItem('gentum_premium_experiences')
    if (oldData) {
      const parsed = JSON.parse(oldData)
      // Si tiene imágenes base64 grandes, limpiar
      const hasLargeImages = JSON.stringify(parsed).length > 500000
      if (hasLargeImages) {
        cleanLocalStorage()
      }
    }
  } catch (error) {
    // Ignorar errores al limpiar
  }
}
