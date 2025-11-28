import { NextRequest, NextResponse } from 'next/server'
import { getPosts, addPost } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    
    let posts = getPosts()
    
    if (category && category !== 'Todas') {
      posts = posts.filter((p: any) => p.category === category)
    }
    
    // Ordenar por timestamp (más recientes primero)
    posts.sort((a: any, b: any) => b.timestamp - a.timestamp)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error en GET /api/posts:', error)
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const post = {
      ...body,
      id: Date.now(),
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: 0,
      images: body.images || [],
    }
    
    const saved = addPost(post)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/posts:', error)
    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 })
  }
}

