import { NextRequest, NextResponse } from 'next/server'
import { getExperiencias, getExperienciaById, saveExperiencia } from '@/lib/db'
import { experienciasData } from '@/lib/data'

// Inicializar datos si no existen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (id) {
      // Obtener una experiencia específica
      let experiencia = getExperienciaById(parseInt(id))
      
      // Si no existe, buscar en los datos iniciales
      if (!experiencia) {
        experiencia = experienciasData.find(e => e.id === parseInt(id))
        if (experiencia) {
          saveExperiencia(experiencia)
        }
      }
      
      if (!experiencia) {
        return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
      }
      
      return NextResponse.json(experiencia)
    }
    
    // Obtener todas las experiencias
    let experiencias = getExperiencias()
    
    // Si no hay experiencias, inicializar con los datos mock
    if (experiencias.length === 0) {
      experienciasData.forEach(exp => saveExperiencia(exp))
      experiencias = getExperiencias()
    }
    
    // Aplicar filtros
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const language = searchParams.get('language')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    let filtered = [...experiencias]
    
    if (category && category !== 'Todas') {
      filtered = filtered.filter((e: any) => e.category === category)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((e: any) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
      )
    }
    
    if (language) {
      filtered = filtered.filter((e: any) => e.language.includes(language))
    }
    
    if (minPrice) {
      filtered = filtered.filter((e: any) => e.price >= parseInt(minPrice))
    }
    
    if (maxPrice) {
      filtered = filtered.filter((e: any) => e.price <= parseInt(maxPrice))
    }
    
    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error en GET /api/experiencias:', error)
    return NextResponse.json({ error: 'Error al obtener experiencias' }, { status: 500 })
  }
}

// Crear nueva experiencia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const experiencia = {
      ...body,
      id: Date.now(),
      createdAt: Date.now(),
      status: body.status || 'pending',
    }
    
    const saved = saveExperiencia(experiencia)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/experiencias:', error)
    return NextResponse.json({ error: 'Error al crear experiencia' }, { status: 500 })
  }
}

// Actualizar experiencia
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const experiencia = getExperienciaById(body.id)
    
    if (!experiencia) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 })
    }
    
    const updated = {
      ...experiencia,
      ...body,
      updatedAt: Date.now(),
    }
    
    const saved = saveExperiencia(updated)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error en PUT /api/experiencias:', error)
    return NextResponse.json({ error: 'Error al actualizar experiencia' }, { status: 500 })
  }
}

// Eliminar experiencia
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const experiencias = getExperiencias()
    const filtered = experiencias.filter((e: any) => e.id !== parseInt(id))
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'data', 'experiencias.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/experiencias:', error)
    return NextResponse.json({ error: 'Error al eliminar experiencia' }, { status: 500 })
  }
}


