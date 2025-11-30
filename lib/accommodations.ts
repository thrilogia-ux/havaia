export interface Accommodation {
  id: number
  title: string
  description: string
  type: 'casa' | 'departamento' | 'loft' | 'cabaña' | 'villa' | 'penthouse'
  location: string
  address: string
  price: number
  pricePerNight: number
  images: string[]
  host: {
    id: string
    name: string
    avatar?: string
    verified: boolean
    rating: number
    reviews: number
  }
  rating: number
  reviews: number
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  rules: string[]
  checkIn: string
  checkOut: string
  cancellationPolicy: 'flexible' | 'moderate' | 'strict'
  featured?: boolean
  coordinates?: {
    lat: number
    lng: number
  }
}

export const accommodationsData: Accommodation[] = [
  {
    id: 1,
    title: 'Loft Moderno en Palermo Soho',
    description: 'Hermoso loft completamente renovado en el corazón de Palermo Soho. Ubicado en una calle tranquila pero a pocos pasos de los mejores restaurantes, bares y tiendas. Perfecto para parejas o viajeros solos que buscan comodidad y estilo.',
    type: 'loft',
    location: 'Palermo Soho, Buenos Aires',
    address: 'Honduras 4500, Palermo',
    price: 45000,
    pricePerNight: 15000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host1',
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
      rating: 4.9,
      reviews: 127,
    },
    rating: 4.8,
    reviews: 89,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora'],
    rules: ['No fumar', 'No mascotas', 'No fiestas'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'flexible',
    featured: true,
    coordinates: { lat: -34.5889, lng: -58.4307 },
  },
  {
    id: 2,
    title: 'Casa con Piscina en San Telmo',
    description: 'Encantadora casa de dos pisos con piscina privada y patio. Ubicada en el histórico barrio de San Telmo, a pocas cuadras de la Plaza Dorrego y el Mercado de San Telmo. Ideal para familias o grupos que buscan autenticidad y comodidad.',
    type: 'casa',
    location: 'San Telmo, Buenos Aires',
    address: 'Defensa 1200, San Telmo',
    price: 85000,
    pricePerNight: 28000,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host2',
      name: 'Carlos Rodríguez',
      verified: true,
      rating: 4.7,
      reviews: 203,
    },
    rating: 4.9,
    reviews: 156,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    amenities: ['Piscina', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Estacionamiento'],
    rules: ['No fumar', 'Máximo 6 huéspedes'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'moderate',
    featured: true,
    coordinates: { lat: -34.6211, lng: -58.3731 },
  },
  {
    id: 3,
    title: 'Departamento Premium en Recoleta',
    description: 'Elegante departamento en el exclusivo barrio de Recoleta. Vista panorámica de la ciudad, completamente amueblado y con todas las comodidades. A pasos del Cementerio de la Recoleta, museos y restaurantes de alta cocina.',
    type: 'departamento',
    location: 'Recoleta, Buenos Aires',
    address: 'Av. Santa Fe 2000, Recoleta',
    price: 65000,
    pricePerNight: 22000,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host3',
      name: 'Ana Martínez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      verified: true,
      rating: 4.9,
      reviews: 98,
    },
    rating: 4.7,
    reviews: 67,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Gimnasio', 'Portero 24hs'],
    rules: ['No fumar', 'No mascotas'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'moderate',
    coordinates: { lat: -34.5881, lng: -58.3934 },
  },
  {
    id: 4,
    title: 'Villa con Gimnasio en Puerto Madero',
    description: 'Lujosa villa en el moderno barrio de Puerto Madero. Diseño contemporáneo, gimnasio privado, terraza con jacuzzi y vista al río. Perfecta para ejecutivos o quienes buscan el máximo confort y exclusividad.',
    type: 'villa',
    location: 'Puerto Madero, Buenos Aires',
    address: 'Av. Alicia Moreau de Justo 1000, Puerto Madero',
    price: 120000,
    pricePerNight: 40000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host4',
      name: 'Roberto Silva',
      verified: true,
      rating: 5.0,
      reviews: 45,
    },
    rating: 4.9,
    reviews: 32,
    guests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    amenities: ['Gimnasio', 'Piscina', 'Jacuzzi', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Estacionamiento', 'Seguridad 24hs'],
    rules: ['No fumar', 'No mascotas', 'No fiestas'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'strict',
    featured: true,
    coordinates: { lat: -34.6108, lng: -58.3625 },
  },
  {
    id: 5,
    title: 'Cabaña Rústica en Villa Crespo',
    description: 'Acogedora cabaña con estilo rústico en el corazón de Villa Crespo. Ambiente cálido y relajado, perfecto para desconectar. Cerca de bares de moda, restaurantes y vida nocturna.',
    type: 'cabaña',
    location: 'Villa Crespo, Buenos Aires',
    address: 'Av. Corrientes 5000, Villa Crespo',
    price: 35000,
    pricePerNight: 12000,
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-3b3c0d0c08e9?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host5',
      name: 'Lucía Fernández',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      verified: true,
      rating: 4.8,
      reviews: 134,
    },
    rating: 4.6,
    reviews: 91,
    guests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Calefacción', 'Cocina equipada', 'TV', 'Patio'],
    rules: ['No fumar', 'Respetar vecinos'],
    checkIn: '14:00',
    checkOut: '10:00',
    cancellationPolicy: 'flexible',
    coordinates: { lat: -34.6000, lng: -58.4333 },
  },
  {
    id: 6,
    title: 'Penthouse con Terraza en Belgrano',
    description: 'Espectacular penthouse con terraza privada y vista 360° de la ciudad. Diseño minimalista y elegante, ideal para eventos pequeños o disfrutar de atardeceres únicos. Ubicado en uno de los barrios más seguros de Buenos Aires.',
    type: 'penthouse',
    location: 'Belgrano, Buenos Aires',
    address: 'Av. Cabildo 2000, Belgrano',
    price: 95000,
    pricePerNight: 32000,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host6',
      name: 'Diego López',
      verified: true,
      rating: 4.9,
      reviews: 78,
    },
    rating: 4.8,
    reviews: 54,
    guests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    amenities: ['Terraza', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Estacionamiento', 'Ascensor'],
    rules: ['No fumar', 'No mascotas', 'Máximo 5 huéspedes'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'moderate',
    coordinates: { lat: -34.5633, lng: -58.4583 },
  },
  {
    id: 7,
    title: 'Casa Familiar en Caballito',
    description: 'Amplia casa familiar con jardín y parrilla. Perfecta para familias grandes o grupos de amigos. Barrio tranquilo y residencial, bien conectado con el centro de la ciudad.',
    type: 'casa',
    location: 'Caballito, Buenos Aires',
    address: 'Av. Rivadavia 5000, Caballito',
    price: 70000,
    pricePerNight: 23000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-3b3c0d0c08e9?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host7',
      name: 'Patricia Sánchez',
      verified: true,
      rating: 4.7,
      reviews: 189,
    },
    rating: 4.5,
    reviews: 112,
    guests: 8,
    bedrooms: 4,
    beds: 6,
    bathrooms: 3,
    amenities: ['Jardín', 'Parrilla', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'TV', 'Lavadora', 'Estacionamiento'],
    rules: ['No fumar dentro', 'Respetar horarios de descanso'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'flexible',
    coordinates: { lat: -34.6228, lng: -58.4411 },
  },
  {
    id: 8,
    title: 'Loft Industrial en San Telmo',
    description: 'Auténtico loft en edificio histórico de San Telmo. Techos altos, ventanales grandes y decoración industrial. A pasos de la Feria de San Telmo y la vida bohemia del barrio.',
    type: 'loft',
    location: 'San Telmo, Buenos Aires',
    address: 'Defensa 800, San Telmo',
    price: 40000,
    pricePerNight: 13000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    host: {
      id: 'host8',
      name: 'Fernando Torres',
      verified: true,
      rating: 4.6,
      reviews: 156,
    },
    rating: 4.4,
    reviews: 98,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Calefacción', 'Cocina equipada', 'TV'],
    rules: ['No fumar', 'No mascotas'],
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: 'flexible',
    coordinates: { lat: -34.6211, lng: -58.3731 },
  },
]

export function getAccommodations(filters?: {
  type?: string
  guests?: number
  bedrooms?: number
  beds?: number
  amenities?: string[]
  minPrice?: number
  maxPrice?: number
  location?: string
}): Accommodation[] {
  let filtered = [...accommodationsData]

  if (filters?.type && filters.type !== 'all') {
    filtered = filtered.filter(acc => acc.type === filters.type)
  }

  if (filters?.guests) {
    filtered = filtered.filter(acc => acc.guests >= filters.guests!)
  }

  if (filters?.bedrooms) {
    filtered = filtered.filter(acc => acc.bedrooms >= filters.bedrooms!)
  }

  if (filters?.beds) {
    filtered = filtered.filter(acc => acc.beds >= filters.beds!)
  }

  if (filters?.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(acc =>
      filters.amenities!.every(amenity => acc.amenities.includes(amenity))
    )
  }

  if (filters?.minPrice) {
    filtered = filtered.filter(acc => acc.pricePerNight >= filters.minPrice!)
  }

  if (filters?.maxPrice) {
    filtered = filtered.filter(acc => acc.pricePerNight <= filters.maxPrice!)
  }

  if (filters?.location) {
    filtered = filtered.filter(acc =>
      acc.location.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }

  return filtered
}

export function getAccommodationById(id: number): Accommodation | undefined {
  return accommodationsData.find(acc => acc.id === id)
}

export function getFeaturedAccommodations(): Accommodation[] {
  return accommodationsData.filter(acc => acc.featured)
}

