// Cliente API para hacer requests al backend

const API_BASE = '/api'

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error.error || 'Error en la petición')
  }
  
  return response.json()
}

// Experiencias
export const experienciasAPI = {
  getAll: (filters?: {
    category?: string
    search?: string
    language?: string
    minPrice?: string
    maxPrice?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.language) params.append('language', filters.language)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice)
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice)
    
    return fetchAPI(`/experiencias?${params.toString()}`)
  },
  
  getById: (id: number) => fetchAPI(`/experiencias?id=${id}`),
  
  create: (experiencia: any) => fetchAPI('/experiencias', {
    method: 'POST',
    body: JSON.stringify(experiencia),
  }),
}

// Grupos
export const gruposAPI = {
  getAll: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : ''
    return fetchAPI(`/grupos${params}`)
  },
  
  getById: (id: number) => fetchAPI(`/grupos/${id}`),
  
  create: (grupo: any) => fetchAPI('/grupos', {
    method: 'POST',
    body: JSON.stringify(grupo),
  }),
  
  update: (grupo: any) => fetchAPI(`/grupos/${grupo.id}`, {
    method: 'PUT',
    body: JSON.stringify(grupo),
  }),
}

// Mensajes
export const mensajesAPI = {
  getByGrupo: (grupoId: number) => fetchAPI(`/grupos/${grupoId}/mensajes`),
  
  create: (grupoId: number, mensaje: any) => fetchAPI(`/grupos/${grupoId}/mensajes`, {
    method: 'POST',
    body: JSON.stringify(mensaje),
  }),
}

// Posts
export const postsAPI = {
  getAll: (category?: string) => {
    const params = category ? `?category=${category}` : ''
    return fetchAPI(`/posts${params}`)
  },
  
  create: (post: any) => fetchAPI('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  }),
}

// Auth
export const authAPI = {
  login: (email: string, password: string) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (data: { email: string; password: string; name: string; city?: string; country?: string }) => 
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Reservas
export const reservasAPI = {
  getByUser: () => {
    // En producción, el userId debería venir del token de autenticación
    // Por ahora, lo obtenemos del localStorage en el frontend
    if (typeof window === 'undefined') return Promise.resolve([])
    const userStr = localStorage.getItem('gentum_user')
    if (!userStr) return Promise.resolve([])
    const user = JSON.parse(userStr)
    return fetchAPI(`/reservas?userId=${user.id}`)
  },
  
  getById: (id: number) => fetchAPI(`/reservas/${id}`),
}

// Experiencias Premium
export const premiumExperiencesAPI = {
  getAll: () => fetchAPI('/premium-experiences'),
  getById: (id: number) => fetchAPI(`/premium-experiences?id=${id}`),
  reserve: (data: { experienceId: number; userId: string; userName: string; userAvatar?: string; seats: number }) =>
    fetchAPI('/premium-experiences/reserve', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelReservation: (experienceId: number, userId: string) =>
    fetchAPI(`/premium-experiences/reserve?experienceId=${experienceId}&userId=${userId}`, {
      method: 'DELETE',
    }),
}

// Pagos / Reservas (simulados por ahora)
export const paymentsAPI = {
  // Crea un checkout simulado y devuelve una reserva
  checkout: (payload: {
    userId: string
    userName: string
    experienciaId: number
    experienciaTitle: string
    amount: number
    currency?: string
    method: 'mercadopago' | 'paypal' | 'card'
    slot?: { date: string; time: string }
  }) =>
    fetchAPI('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// Admin API - requiere autenticación
function getAuthHeaders() {
  if (typeof window === 'undefined') return {}
  const userStr = localStorage.getItem('gentum_user')
  if (!userStr) return {}
  const user = JSON.parse(userStr)
  return {
    'Authorization': `Bearer ${user.id}`,
  }
}

async function fetchAdminAPI(endpoint: string, options?: RequestInit) {
  const authHeaders = getAuthHeaders() as Record<string, string>
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...(options?.headers as Record<string, string> || {}),
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error.error || 'Error en la petición')
  }
  
  return response.json()
}

export const adminAPI = {
  // Estadísticas
  getStats: () => fetchAdminAPI('/admin/stats'),
  
  // Experiencias
  experiencias: {
    getAll: () => fetchAdminAPI('/admin/experiencias'),
    create: (experiencia: any) => fetchAdminAPI('/admin/experiencias', {
      method: 'POST',
      body: JSON.stringify(experiencia),
    }),
    update: (experiencia: any) => fetchAdminAPI('/admin/experiencias', {
      method: 'PUT',
      body: JSON.stringify(experiencia),
    }),
    delete: (id: number) => fetchAdminAPI(`/admin/experiencias?id=${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Posts
  posts: {
    getAll: () => fetchAdminAPI('/admin/posts'),
    update: (post: any) => fetchAdminAPI('/admin/posts', {
      method: 'PUT',
      body: JSON.stringify(post),
    }),
    delete: (id: number) => fetchAdminAPI(`/admin/posts?id=${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Grupos
  grupos: {
    getAll: () => fetchAdminAPI('/admin/grupos'),
    update: (grupo: any) => fetchAdminAPI('/admin/grupos', {
      method: 'PUT',
      body: JSON.stringify(grupo),
    }),
    delete: (id: number) => fetchAdminAPI(`/admin/grupos?id=${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Usuarios
  usuarios: {
    getAll: () => fetchAdminAPI('/admin/usuarios'),
    update: (usuario: any) => fetchAdminAPI('/admin/usuarios', {
      method: 'PUT',
      body: JSON.stringify(usuario),
    }),
    delete: (id: string) => fetchAdminAPI(`/admin/usuarios?id=${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Reservas
  reservas: {
    getAll: () => fetchAdminAPI('/admin/reservas'),
    update: (reserva: any) => fetchAdminAPI('/admin/reservas', {
      method: 'PUT',
      body: JSON.stringify(reserva),
    }),
    delete: (id: number) => fetchAdminAPI(`/admin/reservas?id=${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Experiencias Premium Gastronómicas (Mesas)
  premiumExperiences: {
    getAll: () => fetchAdminAPI('/admin/premium-experiences'),
    create: (experience: any) => fetchAdminAPI('/admin/premium-experiences', {
      method: 'POST',
      body: JSON.stringify(experience),
    }),
    update: (experience: any) => fetchAdminAPI('/admin/premium-experiences', {
      method: 'PUT',
      body: JSON.stringify(experience),
    }),
    delete: (id: number) => fetchAdminAPI(`/admin/premium-experiences?id=${id}`, {
      method: 'DELETE',
    }),
  },
}

