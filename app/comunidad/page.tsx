'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getPosts, addPost, type Post } from '@/lib/data'
import { addPoints, incrementStat, getUserStats } from '@/lib/gamification'
import { updateChallengeProgress } from '@/lib/challenges'
import { showToast } from '@/components/ToastContainer'
import PostCard from '@/components/PostCard'
import CreatePostModal from '@/components/CreatePostModal'
import StoriesBar from '@/components/StoriesBar'
import { PlusIcon } from '@heroicons/react/24/outline'

const categories = ['Todas', 'Gastronomía', 'Cultura', 'Vida Nocturna', 'Transporte', 'General']

export default function ComunidadPage() {
  const user = getCurrentUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    try {
      const allPosts = getPosts()
      // Ordenar por timestamp (más recientes primero)
      const sorted = allPosts.sort((a, b) => b.timestamp - a.timestamp)
      setPosts(sorted)
    } catch (error) {
      console.error('Error cargando posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = (postData: { title: string; content: string; category: string; images: string[] }) => {
    if (!user) {
      showToast('Necesitás iniciar sesión para publicar', 'error')
      return
    }

    const post: Post = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userCity: user.city,
      userAvatar: user.avatar,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      images: postData.images.length > 0 ? postData.images : undefined,
      likes: 0,
      likedBy: [],
      comments: 0,
      timestamp: Date.now()
    }

    addPost(post)
    
    // Gamificación
    incrementStat('postsCreated')
    const result = addPoints(10, 'Publicar post')
    showToast(`+10 puntos por publicar! 📢`, 'success')
    
    // Actualizar desafíos
    const challengeResult = updateChallengeProgress('post_5_times', getUserStats().postsCreated)
    if (challengeResult.completed) {
      addPoints(challengeResult.points, 'Desafío completado')
      showToast(`¡Desafío completado! +${challengeResult.points} puntos extra! 🏆`, 'success', 5000)
    }
    
    if (result.leveledUp) {
      showToast(`¡Subiste al nivel ${result.newStats.level}! 🚀`, 'success', 5000)
    }
    
    if (result.badgeUnlocked) {
      showToast(`¡Badge desbloqueado: ${result.badgeUnlocked.name}! 🏆`, 'success', 5000)
    }
    
    loadPosts()
  }

  const handleLike = (postId: number) => {
    if (!user) return

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy?.includes(user.id) || false
        const newLikedBy = isLiked
          ? post.likedBy?.filter(id => id !== user.id) || []
          : [...(post.likedBy || []), user.id]
        
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: newLikedBy
        }
      }
      return post
    })

    setPosts(updatedPosts)
    
    // Guardar en localStorage (en producción sería en el backend)
    if (typeof window !== 'undefined') {
      const allPosts = getPosts()
      const updatedAllPosts = allPosts.map((p: any) => {
        if (p.id === postId) {
          const isLiked = p.likedBy?.includes(user.id) || false
          const newLikedBy = isLiked
            ? p.likedBy?.filter((id: string) => id !== user.id) || []
            : [...(p.likedBy || []), user.id]
          
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedBy: newLikedBy
          }
        }
        return p
      })
      localStorage.setItem('gentum_posts', JSON.stringify(updatedAllPosts))
    }
  }

  const handleComment = (postId: number) => {
    // En producción, esto abriría un modal de comentarios o navegaría a la sección de comentarios
    console.log('Comentar en post:', postId)
  }

  const handleShare = (post: Post) => {
    showToast('Post compartido', 'success')
  }

  const filteredPosts = selectedCategory === 'Todas' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StoriesBar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header estilo Instagram */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comunidad</h1>
              <p className="text-sm text-gray-500 mt-1">
                Conectá con otros viajeros
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <Link
                  href="/comunidad/stories"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                >
                  + Story
                </Link>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
                >
                  <PlusIcon className="w-5 h-5" />
                  Crear
                </button>
              </div>
            )}
          </div>

          {/* Filtros estilo Stories */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Feed estilo Instagram */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-96 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'Todas' 
                  ? 'Aún no hay publicaciones'
                  : `No hay posts en ${selectedCategory}`
                }
              </h2>
              <p className="text-gray-600 mb-6">
                Sé el primero en compartir algo con la comunidad
              </p>
              {user ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Crear primera publicación
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Iniciar sesión para publicar
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de crear post */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}
