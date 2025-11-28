'use client'

import { useState, useRef } from 'react'
import { XMarkIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { getCurrentUser } from '@/lib/auth'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: { title: string; content: string; category: string; images: string[] }) => void
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const user = getCurrentUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = ['Gastronomía', 'Cultura', 'Vida Nocturna', 'Transporte', 'General']

  if (!isOpen) return null

  const handleAddImage = () => {
    if (imageInput.trim() && images.length < 10) {
      setImages([...images, imageInput.trim()])
      setImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // En producción, aquí subirías las imágenes a un servicio (Cloudinary, S3, etc.)
    // Por ahora, simulamos con URLs locales o generamos previews
    Array.from(files).slice(0, 10 - images.length).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            setImages([...images, result])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación
    if (!title.trim()) {
      alert('El título es requerido')
      return
    }
    
    if (!content.trim()) {
      alert('El contenido es requerido')
      return
    }

    if (content.length < 10) {
      alert('El contenido debe tener al menos 10 caracteres')
      return
    }

    if (content.length > 2000) {
      alert('El contenido no puede exceder 2000 caracteres')
      return
    }

    onSubmit({ title, content, category, images })
    
    // Reset
    setTitle('')
    setContent('')
    setCategory('General')
    setImages([])
    setImageInput('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Crear publicación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Usuario */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              {user?.city && <p className="text-sm text-gray-500">{user.city}</p>}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: ¿Alguien conoce restaurantes kosher en Palermo?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribí tu pregunta o tip..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              maxLength={2000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/2000 {content.length < 10 && '(mínimo 10 caracteres)'}
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imágenes ({images.length}/10)
            </label>
            
            {/* Input de URL */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Pegar URL de imagen..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImage()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageInput.trim() || images.length >= 10}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Agregar
              </button>
            </div>

            {/* Botón subir archivo */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 10}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PhotoIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Subir imágenes desde tu dispositivo
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Preview de imágenes */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://picsum.photos/seed/preview-${idx}/400/400`
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || content.length < 10}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


