// Datos mock para experiencias, grupos, etc.
import { type Locale } from './i18n'
import { experienceTranslations, categoryTranslations } from './experiences-translations'

export interface Experiencia {
  id: number
  title: string
  category: string
  price: number
  duration: string
  location: string
  language: string
  image: string
  gallery?: string[]
  spots: { available: number; total: number }
  rating: number
  reviews: number
  description: string
  itinerary: string[]
  includes: string[]
  notIncludes: string[]
  premium?: boolean // Experiencia premium (solo para suscriptores)
  host: {
    name: string
    verified: boolean
    languages: string[]
    rating: number
    experiences: number
  }
}

export interface Grupo {
  id: number
  name: string
  experienciaId: number
  experiencia: string
  fecha: string
  horario: string
  ubicacion: string
  spots: { total: number; confirmados: number; disponibles: number }
  miembros: Array<{ id: number; name: string; role: string; avatar: string }>
  privacidad: 'publico' | 'privado'
  coordinadorId: string
}

export interface Mensaje {
  id: number
  grupoId: number
  userId: string
  userName: string
  text: string
  time: string
  timestamp: number
}

export interface Post {
  id: number
  userId: string
  userName: string
  userCity?: string
  userAvatar?: string
  title: string
  content: string
  category: string
  images?: string[] // Array de URLs de imágenes para carrusel
  likes: number
  likedBy?: string[] // IDs de usuarios que dieron like
  comments: number
  timestamp: number
}

// Experiencias
export const experienciasData: Experiencia[] = [
  {
    id: 1,
    title: 'Tour Gastronómico Kosher en Palermo',
    category: 'Gastronomía',
    price: 45,
    duration: '3 horas',
    location: 'Palermo, Buenos Aires',
    language: 'Hebreo / Español',
    image: 'https://picsum.photos/seed/exp1/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1543357480-c60d40007a8d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 8, total: 12 },
    rating: 4.8,
    reviews: 24,
    description: 'Un recorrido único por los mejores restaurantes kosher de Palermo, combinando sabores tradicionales argentinos con la cocina judía. Incluye degustaciones, historias de la comunidad y encuentros con chefs locales.',
    itinerary: [
      '19:00 - Encuentro en punto de partida',
      '19:15 - Primera parada: Restaurante La Crespo',
      '20:30 - Segunda parada: Patisserie kosher',
      '21:30 - Tercera parada: Cena completa',
      '22:00 - Cierre con café y charla'
    ],
    includes: [
      'Degustaciones en 3 restaurantes',
      'Guía bilingüe (hebreo/español)',
      'Agua y bebidas incluidas',
      'Material informativo'
    ],
    notIncludes: [
      'Transporte al punto de encuentro',
      'Propinas',
      'Bebidas alcohólicas adicionales'
    ],
    host: {
      name: 'María Goldstein',
      verified: true,
      languages: ['Hebreo', 'Español', 'Inglés'],
      rating: 4.9,
      experiences: 12
    }
  },
  {
    id: 2,
    title: 'Tango Show y Clase en San Telmo',
    category: 'Cultura',
    price: 35,
    duration: '2.5 horas',
    location: 'San Telmo, Buenos Aires',
    language: 'Hebreo / Inglés',
    image: 'https://picsum.photos/seed/exp2/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 5, total: 10 },
    rating: 4.9,
    reviews: 18,
    description: 'Viví una experiencia auténtica de tango argentino con show en vivo y clase básica. Perfecto para principiantes y amantes de la cultura porteña.',
    itinerary: [
      '20:00 - Encuentro en milonga',
      '20:15 - Show de tango profesional',
      '21:00 - Clase básica de tango',
      '21:45 - Práctica libre',
      '22:30 - Cierre'
    ],
    includes: [
      'Show de tango',
      'Clase de baile',
      'Bebida de bienvenida',
      'Guía bilingüe'
    ],
    notIncludes: [
      'Transporte',
      'Cena'
    ],
    host: {
      name: 'Carlos Mendes',
      verified: true,
      languages: ['Hebreo', 'Inglés', 'Español'],
      rating: 4.8,
      experiences: 8
    }
  },
  {
    id: 3,
    title: 'Nightlife Segura: Bares y Vida Nocturna',
    category: 'Vida Nocturna',
    price: 50,
    duration: '4 horas',
    location: 'Palermo / Recoleta',
    language: 'Hebreo / Español',
    image: 'https://picsum.photos/seed/exp3/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 12, total: 15 },
    rating: 4.7,
    reviews: 31,
    description: 'Recorrido por los mejores bares y lugares nocturnos de Buenos Aires, con guía que conoce la escena local y garantiza una experiencia segura.',
    itinerary: [
      '22:00 - Encuentro en primer bar',
      '22:30 - Segundo bar',
      '23:30 - Tercer bar',
      '00:30 - Cuarto destino',
      '02:00 - Cierre'
    ],
    includes: [
      'Entrada a 4 lugares',
      'Primera ronda de bebidas',
      'Guía bilingüe',
      'Coordinación de transporte'
    ],
    notIncludes: [
      'Bebidas adicionales',
      'Transporte entre lugares'
    ],
    host: {
      name: 'Sofia Cohen',
      verified: true,
      languages: ['Hebreo', 'Español'],
      rating: 4.7,
      experiences: 15
    }
  },
  {
    id: 4,
    title: 'Escape a Tigre: Delta y Naturaleza',
    category: 'Aventura',
    price: 60,
    duration: 'Día completo',
    location: 'Tigre, Buenos Aires',
    language: 'Hebreo / Español',
    image: 'https://picsum.photos/seed/exp4/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1526481280695-3c687fd543c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521292270410-a8c53642e9d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 6, total: 8 },
    rating: 4.9,
    reviews: 15,
    description: 'Excursión de día completo al Delta del Tigre, navegando por los canales, disfrutando de la naturaleza y la gastronomía local.',
    itinerary: [
      '09:00 - Salida desde Buenos Aires',
      '10:30 - Llegada a Tigre',
      '11:00 - Navegación por canales',
      '13:00 - Almuerzo en isla',
      '15:00 - Actividades recreativas',
      '17:00 - Regreso',
      '19:00 - Llegada a Buenos Aires'
    ],
    includes: [
      'Transporte ida y vuelta',
      'Navegación por delta',
      'Almuerzo',
      'Guía bilingüe',
      'Seguro'
    ],
    notIncludes: [
      'Bebidas adicionales',
      'Actividades opcionales'
    ],
    host: {
      name: 'Roberto Levy',
      verified: true,
      languages: ['Hebreo', 'Español', 'Inglés'],
      rating: 5.0,
      experiences: 20
    }
  },
  {
    id: 5,
    title: 'Tour Histórico: Barrios Judíos de Buenos Aires',
    category: 'Cultura',
    price: 40,
    duration: '3 horas',
    location: 'Villa Crespo / Once',
    language: 'Hebreo',
    image: 'https://picsum.photos/seed/exp5/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1527156231300-5791617c76aa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280693-3b113d4a630e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447711140-7213fb901e4a?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 10, total: 12 },
    rating: 5.0,
    reviews: 22,
    description: 'Recorrido histórico por los barrios donde se asentó la comunidad judía en Buenos Aires, conociendo sinagogas, instituciones y la historia de la inmigración.',
    itinerary: [
      '10:00 - Encuentro en Villa Crespo',
      '10:30 - Sinagoga principal',
      '11:30 - Barrio de Once',
      '12:30 - Museo de la Inmigración',
      '13:00 - Cierre con charla'
    ],
    includes: [
      'Guía especializado',
      'Entradas a museos',
      'Material informativo',
      'Agua'
    ],
    notIncludes: [
      'Transporte',
      'Almuerzo'
    ],
    host: {
      name: 'David Rosenbaum',
      verified: true,
      languages: ['Hebreo', 'Español', 'Yiddish'],
      rating: 5.0,
      experiences: 25
    }
  },
  {
    id: 6,
    title: 'Cooking Class: Cocina Argentina Kosher',
    category: 'Gastronomía',
    price: 55,
    duration: '3.5 horas',
    location: 'Belgrano, Buenos Aires',
    language: 'Hebreo / Inglés',
    image: 'https://picsum.photos/seed/exp6/1200/800',
    gallery: [
      'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1200&q=80',
    ],
    spots: { available: 4, total: 8 },
    rating: 4.8,
    reviews: 19,
    premium: true, // Experiencia premium
    description: 'Aprendé a cocinar platos típicos argentinos adaptados a la cocina kosher. Clase práctica con chef profesional.',
    itinerary: [
      '18:00 - Bienvenida y presentación',
      '18:15 - Preparación de ingredientes',
      '18:45 - Cocción de platos',
      '20:00 - Degustación',
      '21:00 - Cierre y recetas'
    ],
    includes: [
      'Clase de cocina',
      'Ingredientes',
      'Degustación completa',
      'Recetario digital',
      'Guía bilingüe'
    ],
    notIncludes: [
      'Transporte',
      'Bebidas alcohólicas'
    ],
    host: {
      name: 'Ana Stern',
      verified: true,
      languages: ['Hebreo', 'Inglés', 'Español'],
      rating: 4.9,
      experiences: 14
    }
  },
]

// Función para obtener experiencias traducidas
export function getExperienciasTranslated(locale: Locale = 'es'): Experiencia[] {
  return experienciasData.map(exp => {
    const translations = experienceTranslations[exp.id as keyof typeof experienceTranslations]?.[locale]
    const categoryTranslation = categoryTranslations[exp.category]?.[locale] || exp.category
    
    if (!translations) {
      return {
        ...exp,
        category: categoryTranslation
      }
    }
    
    return {
      ...exp,
      title: translations.title,
      description: translations.description,
      itinerary: translations.itinerary,
      includes: translations.includes,
      notIncludes: translations.notIncludes,
      category: categoryTranslation
    }
  })
}

// Función para obtener experiencias con filtros
export function getExperiencias(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  language?: string
}): Experiencia[] {
  let filtered = [...experienciasData]

  if (filters?.category && filters.category !== 'Todas') {
    filtered = filtered.filter(exp => exp.category === filters.category)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(exp =>
      exp.title.toLowerCase().includes(searchLower) ||
      exp.description.toLowerCase().includes(searchLower) ||
      exp.location.toLowerCase().includes(searchLower)
    )
  }

  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter(exp => exp.price >= filters.minPrice!)
  }

  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter(exp => exp.price <= filters.maxPrice!)
  }

  if (filters?.language) {
    filtered = filtered.filter(exp => exp.language.includes(filters.language!))
  }

  return filtered
}

// Grupos (almacenados en localStorage)
export function getGrupos(): Grupo[] {
  if (typeof window === 'undefined') return []
  const gruposStr = localStorage.getItem('gentum_grupos')
  return gruposStr ? JSON.parse(gruposStr) : []
}

export function saveGrupo(grupo: Grupo): void {
  if (typeof window === 'undefined') return
  const grupos = getGrupos()
  grupos.push(grupo)
  localStorage.setItem('gentum_grupos', JSON.stringify(grupos))
}

export function getGrupoById(id: number): Grupo | undefined {
  const grupos = getGrupos()
  return grupos.find(g => g.id === id)
}

export function updateGrupo(grupo: Grupo): void {
  if (typeof window === 'undefined') return
  const grupos = getGrupos()
  const index = grupos.findIndex(g => g.id === grupo.id)
  if (index !== -1) {
    grupos[index] = grupo
    localStorage.setItem('gentum_grupos', JSON.stringify(grupos))
  }
}

// Mensajes (almacenados en localStorage)
export function getMensajes(grupoId: number): Mensaje[] {
  if (typeof window === 'undefined') return []
  const mensajesStr = localStorage.getItem(`gentum_mensajes_${grupoId}`)
  return mensajesStr ? JSON.parse(mensajesStr) : []
}

export function addMensaje(mensaje: Mensaje): void {
  if (typeof window === 'undefined') return
  const mensajes = getMensajes(mensaje.grupoId)
  mensajes.push(mensaje)
  localStorage.setItem(`gentum_mensajes_${mensaje.grupoId}`, JSON.stringify(mensajes))
}

// Posts de comunidad
export function getPosts(): Post[] {
  if (typeof window === 'undefined') return []
  const postsStr = localStorage.getItem('gentum_posts')
  return postsStr ? JSON.parse(postsStr) : []
}

export function addPost(post: Post): void {
  if (typeof window === 'undefined') return
  const posts = getPosts()
  // Asegurar que tiene los campos nuevos
  const newPost: Post = {
    ...post,
    images: post.images || [],
    likedBy: post.likedBy || [],
  }
  posts.unshift(newPost) // Agregar al inicio
  localStorage.setItem('gentum_posts', JSON.stringify(posts))
}

