'use client'

import { useState, useEffect } from 'react'
import { getStories, markStoryAsViewed, type Story } from '@/lib/stories'
import { getCurrentUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function StoriesBar() {
  const router = useRouter()
  const user = getCurrentUser()
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadStories = () => {
      const allStories = getStories()
      // Agrupar por usuario
      const grouped = allStories.reduce((acc: { [key: string]: Story[] }, story) => {
        if (!acc[story.userId]) {
          acc[story.userId] = []
        }
        acc[story.userId].push(story)
        return acc
      }, {})
      
      // Convertir a array y ordenar por timestamp
      const storiesList = Object.values(grouped).flat().sort((a, b) => b.timestamp - a.timestamp)
      setStories(storiesList)
    }
    
    loadStories()
    const interval = setInterval(loadStories, 5000) // Actualizar cada 5 segundos
    
    return () => clearInterval(interval)
  }, [])

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story)
    setCurrentIndex(0)
    if (user) {
      markStoryAsViewed(story.id, user.id)
    }
  }

  const closeStory = () => {
    setSelectedStory(null)
    setCurrentIndex(0)
  }

  const nextStory = () => {
    if (!selectedStory) return
    
    const userStories = stories.filter(s => s.userId === selectedStory.userId)
    const currentStoryIndex = userStories.findIndex(s => s.id === selectedStory.id)
    
    if (currentStoryIndex < userStories.length - 1) {
      const nextStory = userStories[currentStoryIndex + 1]
      setSelectedStory(nextStory)
      setCurrentIndex(0)
      if (user) {
        markStoryAsViewed(nextStory.id, user.id)
      }
    } else {
      closeStory()
    }
  }

  const prevStory = () => {
    if (!selectedStory) return
    
    const userStories = stories.filter(s => s.userId === selectedStory.userId)
    const currentStoryIndex = userStories.findIndex(s => s.id === selectedStory.id)
    
    if (currentStoryIndex > 0) {
      const prevStory = userStories[currentStoryIndex - 1]
      setSelectedStory(prevStory)
      setCurrentIndex(0)
      if (user) {
        markStoryAsViewed(prevStory.id, user.id)
      }
    }
  }

  // Agrupar stories por usuario
  const groupedStories = stories.reduce((acc: { [key: string]: Story[] }, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = []
    }
    acc[story.userId].push(story)
    return acc
  }, {})

  const storyUsers = Object.keys(groupedStories)

  if (stories.length === 0) return null

  return (
    <>
      {/* Barra de stories */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex items-center gap-4">
          {storyUsers.map(userId => {
            const userStories = groupedStories[userId]
            const firstStory = userStories[0]
            const hasUnviewed = user && !firstStory.viewedBy?.includes(user.id)
            
            return (
              <button
                key={userId}
                onClick={() => handleStoryClick(firstStory)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className={`relative w-16 h-16 rounded-full p-0.5 ${
                  hasUnviewed 
                    ? 'bg-gradient-to-r from-primary-500 to-pink-500' 
                    : 'bg-gray-300'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-1">
                    {firstStory.userAvatar ? (
                      <img
                        src={firstStory.userAvatar}
                        alt={firstStory.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {firstStory.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-600 max-w-[64px] truncate">
                  {firstStory.userName}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal de story */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative w-full h-full">
            {/* Imagen */}
            <img
              src={selectedStory.image}
              alt="Story"
              className="w-full h-full object-contain"
            />
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedStory.userAvatar ? (
                    <img
                      src={selectedStory.userAvatar}
                      alt={selectedStory.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                      {selectedStory.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{selectedStory.userName}</p>
                    <p className="text-white/80 text-sm">
                      {new Date(selectedStory.timestamp).toLocaleTimeString('es-AR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeStory}
                  className="text-white hover:text-gray-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Navegación */}
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
            >
              ‹
            </button>
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
            >
              ›
            </button>

            {/* Barra de progreso */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-white text-sm">
                <span>👁 {selectedStory.views}</span>
                <span>•</span>
                <span>
                  {Math.floor((selectedStory.expiresAt - Date.now()) / (60 * 60 * 1000))}h restantes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

