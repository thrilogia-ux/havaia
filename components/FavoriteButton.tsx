'use client'

import { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { showToast } from '@/components/ToastContainer'

interface FavoriteButtonProps {
  experienciaId: number
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({ experienciaId, size = 'md' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    setFavorited(isFavorite(experienciaId))
  }, [experienciaId])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newState = toggleFavorite(experienciaId)
    setFavorited(newState)
    
    if (newState) {
      showToast('Agregado a favoritos ❤️', 'success')
    } else {
      showToast('Eliminado de favoritos', 'info')
    }
  }

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all hover-lift ${
        favorited
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-600'
      }`}
      aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {favorited ? (
        <HeartIconSolid className={sizeClasses[size]} />
      ) : (
        <HeartIcon className={sizeClasses[size]} />
      )}
    </button>
  )
}




