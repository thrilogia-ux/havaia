import { NextRequest, NextResponse } from 'next/server'
import { requireAdminOrHost, unauthorizedResponse } from '@/lib/auth-middleware'
import { premiumExperiences } from '@/lib/premium-experiences'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const PREMIUM_EXP_FILE = path.join(DATA_DIR, 'premium-experiences.json')

// Datos iniciales de las experiencias premium
const initialPremiumExperiences = premiumExperiences.map((exp: any) => ({
  ...(exp as Record<string, unknown>),
  status: 'approved',
  createdAt: Date.now() - (premiumExperiences.length - exp.id) * 86400000, // Diferentes fechas de creación
}))

// Asegurar que el archivo existe
function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(PREMIUM_EXP_FILE)) {
    fs.writeFileSync(PREMIUM_EXP_FILE, JSON.stringify(initialPremiumExperiences, null, 2))
  }
}

function readPremiumExperiences() {
  ensureFile()
  try {
    const data = fs.readFileSync(PREMIUM_EXP_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Si el archivo está vacío o no tiene datos, inicializar con los datos mock
    if (!parsed || parsed.length === 0) {
      writePremiumExperiences(initialPremiumExperiences)
      return initialPremiumExperiences
    }
    
    return parsed
  } catch (error) {
    // Si hay error, inicializar con datos mock
    writePremiumExperiences(initialPremiumExperiences)
    return initialPremiumExperiences
  }
}

function writePremiumExperiences(data: any[]) {
  ensureFile()
  fs.writeFileSync(PREMIUM_EXP_FILE, JSON.stringify(data, null, 2))
}

// Obtener todas las experiencias premium
export async function GET(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const experiences = readPremiumExperiences()
    
    // Si es host, solo mostrar sus experiencias
    if (user.role === 'host') {
      const filtered = experiences.filter((e: any) => 
        e.hostId === user.id || e.host?.email === user.email
      )
      return NextResponse.json(filtered)
    }
    
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error en GET /api/admin/premium-experiences:', error)
    return NextResponse.json({ error: 'Error al obtener experiencias premium' }, { status: 500 })
  }
}

// Crear nueva experiencia premium
export async function POST(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const experiences = readPremiumExperiences()
    
    const newExperience = {
      ...(body as Record<string, unknown>),
      id: Date.now(),
      createdAt: Date.now(),
      hostId: user.id,
      host: {
        ...((body as any).host as Record<string, unknown> || {}),
        email: user.email,
        name: user.name,
      },
      reservedSeats: 0,
      reservations: [],
      status: body.status || 'pending',
    }
    
    experiences.push(newExperience)
    writePremiumExperiences(experiences)
    
    return NextResponse.json(newExperience, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin/premium-experiences:', error)
    return NextResponse.json({ error: 'Error al crear experiencia premium' }, { status: 500 })
  }
}

// Actualizar experiencia premium
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const experiences = readPremiumExperiences()
    const index = experiences.findIndex((e: any) => e.id === body.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
    }
    
    // Si es host, solo puede editar sus propias experiencias
    if (user.role === 'host' && experiences[index].hostId !== user.id && experiences[index].host?.email !== user.email) {
      return NextResponse.json({ error: 'No tienes permisos para editar esta experiencia' }, { status: 403 })
    }
    
    experiences[index] = {
      ...(experiences[index] as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    } as any
    
    writePremiumExperiences(experiences)
    return NextResponse.json(experiences[index])
  } catch (error) {
    console.error('Error en PUT /api/admin/premium-experiences:', error)
    return NextResponse.json({ error: 'Error al actualizar experiencia premium' }, { status: 500 })
  }
}

// Eliminar experiencia premium
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdminOrHost(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const experiences = readPremiumExperiences()
    const experience = experiences.find((e: any) => e.id === parseInt(id))
    
    if (!experience) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
    }
    
    // Si es host, solo puede eliminar sus propias experiencias
    if (user.role === 'host' && experience.hostId !== user.id && experience.host?.email !== user.email) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar esta experiencia' }, { status: 403 })
    }
    
    const filtered = experiences.filter((e: any) => e.id !== parseInt(id))
    writePremiumExperiences(filtered)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/premium-experiences:', error)
    return NextResponse.json({ error: 'Error al eliminar experiencia premium' }, { status: 500 })
  }
}

