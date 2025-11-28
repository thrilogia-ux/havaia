// Sistema de base de datos simple usando archivos JSON
// En producción esto sería una base de datos real (PostgreSQL, MongoDB, etc.)

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Asegurar que el directorio existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Archivos de datos
const FILES = {
  experiencias: path.join(DATA_DIR, 'experiencias.json'),
  grupos: path.join(DATA_DIR, 'grupos.json'),
  usuarios: path.join(DATA_DIR, 'usuarios.json'),
  mensajes: path.join(DATA_DIR, 'mensajes.json'),
  posts: path.join(DATA_DIR, 'posts.json'),
  subscriptions: path.join(DATA_DIR, 'subscriptions.json'),
  reservas: path.join(DATA_DIR, 'reservas.json'),
  premiumExperiences: path.join(DATA_DIR, 'premium-experiences.json'),
}

// Funciones helper para leer/escribir JSON
function readFile<T>(filePath: string, defaultValue: T[]): T[] {
  try {
    if (!fs.existsSync(filePath)) {
      writeFile(filePath, defaultValue)
      return defaultValue
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return defaultValue
  }
}

function writeFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
  }
}

// Experiencias
export function getExperiencias() {
  return readFile(FILES.experiencias, [])
}

export function getExperienciaById(id: number) {
  const experiencias = getExperiencias()
  return experiencias.find((e: any) => e.id === id)
}

export function saveExperiencia(experiencia: any) {
  const experiencias = getExperiencias() as any[]
  const index = experiencias.findIndex((e: any) => e.id === experiencia.id)
  if (index >= 0) {
    experiencias[index] = experiencia
  } else {
    experiencias.push(experiencia)
  }
  writeFile(FILES.experiencias, experiencias)
  return experiencia
}

// Grupos
export function getGrupos() {
  return readFile(FILES.grupos, [])
}

export function getGrupoById(id: number) {
  const grupos = getGrupos()
  return grupos.find((g: any) => g.id === id)
}

export function saveGrupo(grupo: any) {
  const grupos = getGrupos() as any[]
  const index = grupos.findIndex((g: any) => g.id === grupo.id)
  if (index >= 0) {
    grupos[index] = grupo
  } else {
    grupos.push(grupo)
  }
  writeFile(FILES.grupos, grupos)
  return grupo
}

export function updateGrupo(grupo: any) {
  return saveGrupo(grupo)
}

// Mensajes
export function getMensajes(grupoId: number) {
  const allMensajes = readFile(FILES.mensajes, [])
  return allMensajes.filter((m: any) => m.grupoId === grupoId)
}

export function addMensaje(mensaje: any) {
  const mensajes = readFile(FILES.mensajes, []) as any[]
  mensajes.push(mensaje)
  writeFile(FILES.mensajes, mensajes)
  return mensaje
}

// Usuarios
export function getUsuarios() {
  return readFile(FILES.usuarios, [])
}

export function getUsuarioById(id: string) {
  const usuarios = getUsuarios()
  return usuarios.find((u: any) => u.id === id)
}

export function saveUsuario(usuario: any) {
  const usuarios = getUsuarios() as any[]
  const index = usuarios.findIndex((u: any) => u.id === usuario.id)
  if (index >= 0) {
    usuarios[index] = usuario
  } else {
    usuarios.push(usuario)
  }
  writeFile(FILES.usuarios, usuarios)
  return usuario
}

// Posts
export function getPosts() {
  return readFile(FILES.posts, [])
}

export function getPostById(id: number) {
  const posts = getPosts()
  return posts.find((p: any) => p.id === id)
}

export function addPost(post: any) {
  const posts = getPosts() as any[]
  // Asegurar que tiene los campos nuevos
  const newPost = {
    ...post,
    images: post.images || [],
    likedBy: post.likedBy || [],
  }
  posts.unshift(newPost) // Agregar al inicio
  writeFile(FILES.posts, posts)
  return newPost
}

export function updatePost(post: any) {
  const posts = getPosts() as any[]
  const index = posts.findIndex((p: any) => p.id === post.id)
  if (index >= 0) {
    posts[index] = { ...posts[index], ...post }
    writeFile(FILES.posts, posts)
    return posts[index]
  }
  return null
}

export function deletePost(id: number) {
  const posts = getPosts()
  const filtered = posts.filter((p: any) => p.id !== id)
  writeFile(FILES.posts, filtered)
  return true
}

// Subscriptions
export function getSubscriptions() {
  return readFile(FILES.subscriptions, [])
}

export function getSubscriptionByUserId(userId: string) {
  const subscriptions = getSubscriptions()
  return subscriptions.find((s: any) => s.userId === userId)
}

export function saveSubscription(subscription: any) {
  const subscriptions = getSubscriptions() as any[]
  const index = subscriptions.findIndex((s: any) => s.userId === subscription.userId)
  if (index >= 0) {
    subscriptions[index] = subscription
  } else {
    subscriptions.push(subscription)
  }
  writeFile(FILES.subscriptions, subscriptions)
  return subscription
}

// Reservas
export function getReservas() {
  return readFile(FILES.reservas, [])
}

export function getReservaById(id: number) {
  const reservas = getReservas()
  return reservas.find((r: any) => r.id === id)
}

export function saveReserva(reserva: any) {
  const reservas = getReservas() as any[]
  const index = reservas.findIndex((r: any) => r.id === reserva.id)
  if (index >= 0) {
    reservas[index] = reserva
  } else {
    reservas.push(reserva)
  }
  writeFile(FILES.reservas, reservas)
  return reserva
}

// Experiencias Premium
export function getPremiumExperiences() {
  return readFile(FILES.premiumExperiences, [])
}

export function getPremiumExperienceById(id: number) {
  const experiences = getPremiumExperiences()
  return experiences.find((e: any) => e.id === id)
}

export function savePremiumExperience(experience: any) {
  const experiences = getPremiumExperiences() as any[]
  const index = experiences.findIndex((e: any) => e.id === experience.id)
  
  if (index >= 0) {
    experiences[index] = experience
  } else {
    experiences.push(experience)
  }
  
  writeFile(FILES.premiumExperiences, experiences)
  return experience
}

export function updatePremiumExperiences(experiences: any[]) {
  writeFile(FILES.premiumExperiences, experiences)
  return experiences
}

export function updateReserva(reserva: any) {
  return saveReserva(reserva)
}

