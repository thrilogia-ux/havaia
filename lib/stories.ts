// Sistema de Stories (historias temporales)

export interface Story {
  id: number
  userId: string
  userName: string
  userAvatar?: string
  image: string
  timestamp: number
  expiresAt: number // Timestamp de expiración (24 horas)
  views: number
  viewedBy?: string[] // IDs de usuarios que vieron la historia
}

export function getStories(): Story[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('gentum_stories')
  if (!stored) return []
  
  const stories = JSON.parse(stored)
  const now = Date.now()
  
  // Filtrar historias expiradas
  const activeStories = stories.filter((story: Story) => story.expiresAt > now)
  
  // Guardar solo las activas
  if (activeStories.length !== stories.length) {
    localStorage.setItem('gentum_stories', JSON.stringify(activeStories))
  }
  
  return activeStories
}

export function addStory(userId: string, userName: string, userAvatar: string | undefined, image: string): Story {
  const stories = getStories()
  const now = Date.now()
  const expiresAt = now + (24 * 60 * 60 * 1000) // 24 horas
  
  const newStory: Story = {
    id: Date.now(),
    userId,
    userName,
    userAvatar,
    image,
    timestamp: now,
    expiresAt,
    views: 0,
    viewedBy: []
  }
  
  stories.push(newStory)
  localStorage.setItem('gentum_stories', JSON.stringify(stories))
  
  return newStory
}

export function markStoryAsViewed(storyId: number, userId: string): void {
  const stories = getStories()
  const story = stories.find(s => s.id === storyId)
  
  if (story && !story.viewedBy?.includes(userId)) {
    story.views++
    story.viewedBy = [...(story.viewedBy || []), userId]
    localStorage.setItem('gentum_stories', JSON.stringify(stories))
  }
}

export function getUserStories(userId: string): Story[] {
  return getStories().filter(s => s.userId === userId)
}

