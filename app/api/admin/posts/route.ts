import { NextRequest, NextResponse } from 'next/server'
import { getPosts, getPostById, updatePost, deletePost } from '@/lib/db'
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

// Obtener todos los posts (solo admin)
export async function GET(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const posts = getPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error en GET /api/admin/posts:', error)
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 })
  }
}

// Actualizar post
export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const body = await request.json()
    const post = getPostById(body.id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }
    
    const updated = updatePost({
      ...(post as Record<string, unknown>),
      ...(body as Record<string, unknown>),
      updatedAt: Date.now(),
    } as any)
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error en PUT /api/admin/posts:', error)
    return NextResponse.json({ error: 'Error al actualizar post' }, { status: 500 })
  }
}

// Eliminar post
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    if (!user) {
      return unauthorizedResponse()
    }
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    deletePost(parseInt(id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/posts:', error)
    return NextResponse.json({ error: 'Error al eliminar post' }, { status: 500 })
  }
}

