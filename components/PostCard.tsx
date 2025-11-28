'use client'

import { useState } from 'react'
import { 
  HeartIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { getCurrentUser } from '@/lib/auth'
import { showToast } from './ToastContainer'
import type { Post } from '@/lib/data'

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
  onComment?: (postId: number) => void
  onShare?: (post: Post) => void
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const user = getCurrentUser()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(user?.id || '') || false)
  const [isSaved, setIsSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  const images = post.images || []
  const hasMultipleImages = images.length > 1

  const handleLike = () => {
    if (!user) {
      showToast('Iniciá sesión para dar like', 'info')
      return
    }
    setIsLiked(!isLiked)
    if (onLike) {
      onLike(post.id)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: `${window.location.origin}/comunidad?post=${post.id}`,
      }).catch(() => {
        // Fallback: copiar al portapapeles
        copyToClipboard()
      })
    } else {
      copyToClipboard()
    }
    
    if (onShare) {
      onShare(post)
    }
  }

  const copyToClipboard = () => {
    const url = `${window.location.origin}/comunidad?post=${post.id}`
    navigator.clipboard.writeText(url)
    showToast('Link copiado al portapapeles', 'success')
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`
    return new Date(timestamp).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {post.userAvatar ? (
              <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              post.userName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.userName}</p>
            {post.userCity && (
              <p className="text-xs text-gray-500">{post.userCity}</p>
            )}
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Imágenes - Carrusel */}
      {images.length > 0 && (
        <div className="relative bg-black">
          <div className="aspect-square relative overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${post.title} ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback si la imagen falla
                const target = e.target as HTMLImageElement
                target.src = `https://picsum.photos/seed/post-${post.id}-${currentImageIndex}/800/800`
              }}
            />
            
            {/* Navegación del carrusel */}
            {hasMultipleImages && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                )}
                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                )}
                
                {/* Indicadores de puntos */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="hover:opacity-70 transition-opacity"
            >
              {isLiked ? (
                <HeartIconSolid className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-900" />
              )}
            </button>
            <button
              onClick={() => {
                setShowComments(!showComments)
                if (onComment) onComment(post.id)
              }}
              className="hover:opacity-70 transition-opacity"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={handleShare}
              className="hover:opacity-70 transition-opacity"
            >
              <PaperAirplaneIcon className="w-6 h-6 text-gray-900 rotate-45" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="hover:opacity-70 transition-opacity"
          >
            {isSaved ? (
              <BookmarkIconSolid className="w-6 h-6 text-gray-900" />
            ) : (
              <BookmarkIcon className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Likes count */}
        {post.likes > 0 && (
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {post.likes} {post.likes === 1 ? 'me gusta' : 'me gusta'}
          </p>
        )}

        {/* Contenido */}
        <div className="mb-1">
          <span className="text-sm font-semibold text-gray-900 mr-2">{post.userName}</span>
          <span className="text-sm text-gray-900">{post.content}</span>
        </div>

        {/* Categoría */}
        <div className="mb-2">
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
            {post.category}
          </span>
        </div>

        {/* Ver todos los comentarios */}
        {post.comments > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 mb-2 hover:text-gray-700"
          >
            Ver los {post.comments} comentarios
          </button>
        )}

        {/* Tiempo */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {formatTime(post.timestamp)}
        </p>
      </div>

      {/* Comentarios (expandible) */}
      {showComments && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="space-y-3 mb-3">
            {/* Comentarios mock - en producción vendrían del backend */}
            {[
              { user: 'Itai', text: '¡Excelente recomendación!', time: '2h' },
              { user: 'Sara', text: 'Gracias por compartir', time: '1h' },
            ].map((comment, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
                <span className="text-sm text-gray-700 flex-1">{comment.text}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
            ))}
          </div>
          
          {/* Input de comentario */}
          {user && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <input
                type="text"
                placeholder="Agregar un comentario..."
                className="flex-1 text-sm border-none bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    showToast('Comentario agregado (simulado)', 'success')
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}


