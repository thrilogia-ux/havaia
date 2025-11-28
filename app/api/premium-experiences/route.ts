import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { premiumExperiences } from '@/lib/premium-experiences'

const DATA_DIR = path.join(process.cwd(), 'data')
const PREMIUM_EXP_FILE = path.join(DATA_DIR, 'premium-experiences.json')

// Obtener todas las experiencias premium (público)
export async function GET(request: NextRequest) {
  try {
    // Intentar leer del archivo JSON primero
    let experiences = []
    
    if (fs.existsSync(PREMIUM_EXP_FILE)) {
      try {
        const data = fs.readFileSync(PREMIUM_EXP_FILE, 'utf-8')
        const parsed = JSON.parse(data)
        if (parsed && parsed.length > 0) {
          experiences = parsed
        }
      } catch (error) {
        console.error('Error leyendo premium experiences:', error)
      }
    }
    
    // Si no hay datos en el archivo, usar los datos mock pero solo los aprobados
    if (experiences.length === 0) {
      experiences = premiumExperiences.map(exp => ({
        ...exp,
        status: 'approved',
      }))
    }
    
    // Filtrar solo las aprobadas para el frontend público
    const approved = experiences.filter((exp: any) => exp.status === 'approved' || !exp.status)
    
    return NextResponse.json(approved)
  } catch (error) {
    console.error('Error en GET /api/premium-experiences:', error)
    // Fallback a datos mock
    return NextResponse.json(premiumExperiences)
  }
}
