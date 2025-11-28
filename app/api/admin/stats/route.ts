import { NextRequest, NextResponse } from 'next/server'
import { getExperiencias, getGrupos, getPosts, getUsuarios, getReservas } from '@/lib/db'
import { requireAdminOrHost, unauthorizedResponse } from '@/lib/auth-middleware'
import fs from 'fs'
import path from 'path'

// Obtener estadísticas del sistema
export async function GET(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const experiencias = getExperiencias()
    const grupos = getGrupos()
    const posts = getPosts()
    const usuarios = getUsuarios()
    const reservas = getReservas()
    
    // Leer experiencias premium
    let premiumExperiences = []
    try {
      const premiumFile = path.join(process.cwd(), 'data', 'premium-experiences.json')
      if (fs.existsSync(premiumFile)) {
        premiumExperiences = JSON.parse(fs.readFileSync(premiumFile, 'utf-8'))
      }
    } catch (error) {
      console.error('Error leyendo premium experiences:', error)
    }
    
    // Si es host, filtrar sus datos
    let experienciasCount = experiencias.length
    let reservasCount = reservas.length
    
    if (user.role === 'host') {
      experienciasCount = experiencias.filter((e: any) => 
        e.hostId === user.id || e.host?.email === user.email
      ).length
      reservasCount = reservas.filter((r: any) => {
        const exp = experiencias.find((e: any) => e.id === r.experienciaId) as any
        return exp && (exp.hostId === user.id || exp.host?.email === user.email)
      }).length
    }
    
    let premiumCount = premiumExperiences.length
    if (user.role === 'host') {
      premiumCount = premiumExperiences.filter((e: any) => 
        e.hostId === user.id || e.host?.email === user.email
      ).length
    }
    
    const stats = {
      experiencias: experienciasCount,
      premiumExperiences: premiumCount,
      grupos: grupos.length,
      posts: posts.length,
      usuarios: user.role === 'admin' ? usuarios.length : null,
      reservas: reservasCount,
      experienciasPendientes: experiencias.filter((e: any) => e.status === 'pending').length,
      experienciasAprobadas: experiencias.filter((e: any) => e.status === 'approved').length,
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error en GET /api/admin/stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}

