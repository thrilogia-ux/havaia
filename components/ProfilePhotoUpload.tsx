'use client'

import { useState, useRef } from 'react'
import { CameraIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { showToast } from './ToastContainer'

interface ProfilePhotoUploadProps {
  currentAvatar?: string
  userName: string
  onUpload: (imageUrl: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function ProfilePhotoUpload({
  currentAvatar,
  userName,
  onUpload,
  size = 'lg'
}: ProfilePhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten archivos de imagen', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showToast('La imagen es demasiado grande. Máximo 5MB', 'error')
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      handleUpload(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (imageDataUrl: string) => {
    setIsUploading(true)
    
    try {
      // En producción, aquí subirías la imagen a un servicio (Cloudinary, S3, etc.)
      // Por ahora, guardamos como base64 en localStorage
      // En producción: const uploadedUrl = await uploadToCloudinary(imageDataUrl)
      
      onUpload(imageDataUrl)
      showToast('Foto de perfil actualizada', 'success')
    } catch (error) {
      showToast('Error al subir la foto', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
    showToast('Foto de perfil eliminada', 'success')
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg group cursor-pointer`}>
        {preview ? (
          <img
            src={preview}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className={`text-white font-bold ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl'}`}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Overlay con botón de cámara - estilo Facebook */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                openFilePicker()
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              title="Subir foto"
            >
              <PhotoIcon className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                openCamera()
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              title="Tomar foto"
            >
              <CameraIcon className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Indicador de carga */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Botón de cámara flotante - visible siempre (estilo Facebook) */}
      <button
        onClick={openFilePicker}
        className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
        title="Cambiar foto de perfil"
      >
        <CameraIcon className="w-5 h-5 text-white" />
      </button>

      {/* Botón para eliminar (si hay foto) */}
      {preview && (
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-10"
          title="Eliminar foto"
        >
          <XMarkIcon className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Inputs ocultos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

