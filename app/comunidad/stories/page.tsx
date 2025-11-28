'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/auth'
import { addStory } from '@/lib/stories'
import { showToast } from '@/components/ToastContainer'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CreateStoryPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)

  if (!user) {
    router.push('/login')
    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten imágenes', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        setImage(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePublish = () => {
    if (!image || !user) return

    addStory(user.id, user.name, user.avatar, image)
    showToast('¡Story publicada!', 'success')
    router.push('/comunidad')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Story</h1>
            
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Subí una foto para tu story</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Seleccionar imagen
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setImage(null)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
                  >
                    Cambiar
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

