// Sistema de gamificación para hacer la app más adictiva

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  points: number
  unlocked: boolean
  progress: number
  maxProgress: number
}

export interface UserStats {
  points: number
  level: number
  badges: Badge[]
  achievements: Achievement[]
  streak: number // Días consecutivos
  lastActiveDate: string
  groupsCreated: number
  groupsJoined: number
  postsCreated: number
  experiencesCompleted: number
}

const ALL_BADGES: Badge[] = [
  { id: 'first_steps', name: 'Primeros Pasos', description: 'Completaste tu registro', icon: '👋', unlocked: false },
  { id: 'explorer', name: 'Explorador', description: 'Viste 5 experiencias', icon: '🔍', unlocked: false },
  { id: 'social_butterfly', name: 'Mariposa Social', description: 'Creaste tu primer grupo', icon: '🦋', unlocked: false },
  { id: 'group_leader', name: 'Líder de Grupo', description: 'Creaste 3 grupos', icon: '👑', unlocked: false },
  { id: 'community_voice', name: 'Voz de la Comunidad', description: 'Publicaste 5 posts', icon: '📢', unlocked: false },
  { id: 'early_bird', name: 'Madrugador', description: 'Activo 7 días seguidos', icon: '🌅', unlocked: false },
  { id: 'night_owl', name: 'Búho Nocturno', description: 'Activo después de medianoche', icon: '🦉', unlocked: false },
  { id: 'adventurer', name: 'Aventurero', description: 'Completaste 3 experiencias', icon: '🗺️', unlocked: false },
]

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'points_100', name: 'En Camino', description: 'Acumulá 100 puntos', points: 10, unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'points_500', name: 'Experto', description: 'Acumulá 500 puntos', points: 50, unlocked: false, progress: 0, maxProgress: 500 },
  { id: 'points_1000', name: 'Maestro', description: 'Acumulá 1000 puntos', points: 100, unlocked: false, progress: 0, maxProgress: 1000 },
  { id: 'groups_5', name: 'Organizador', description: 'Creá 5 grupos', points: 25, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'posts_10', name: 'Influencer', description: 'Publicá 10 posts', points: 30, unlocked: false, progress: 0, maxProgress: 10 },
]

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return getDefaultStats()
  }
  
  const statsStr = localStorage.getItem('gentum_user_stats')
  if (!statsStr) {
    return getDefaultStats()
  }
  
  return JSON.parse(statsStr)
}

function getDefaultStats(): UserStats {
  return {
    points: 0,
    level: 1,
    badges: ALL_BADGES.map(b => ({ ...b })),
    achievements: ALL_ACHIEVEMENTS.map(a => ({ ...a })),
    streak: 0,
    lastActiveDate: '',
    groupsCreated: 0,
    groupsJoined: 0,
    postsCreated: 0,
    experiencesCompleted: 0
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_user_stats', JSON.stringify(stats))
}

export function addPoints(points: number, reason: string): { newStats: UserStats; leveledUp: boolean; badgeUnlocked: Badge | null } {
  const stats = getUserStats()
  const oldLevel = stats.level
  
  stats.points += points
  stats.level = Math.floor(stats.points / 100) + 1
  
  const leveledUp = stats.level > oldLevel
  
  // Actualizar streak
  const today = new Date().toDateString()
  if (stats.lastActiveDate !== today) {
    if (stats.lastActiveDate && new Date(stats.lastActiveDate).getTime() === new Date(today).getTime() - 86400000) {
      stats.streak += 1
    } else {
      stats.streak = 1
    }
    stats.lastActiveDate = today
  }
  
  // Verificar achievements
  let badgeUnlocked: Badge | null = null
  
  // Verificar badges
  const unlockedBadge = checkBadges(stats)
  if (unlockedBadge) {
    badgeUnlocked = unlockedBadge
  }
  
  // Verificar achievements
  checkAchievements(stats)
  
  saveUserStats(stats)
  
  return { newStats: stats, leveledUp, badgeUnlocked }
}

function checkBadges(stats: UserStats): Badge | null {
  let unlockedBadge: Badge | null = null
  
  stats.badges.forEach(badge => {
    if (badge.unlocked) return
    
    let shouldUnlock = false
    
    switch (badge.id) {
      case 'first_steps':
        shouldUnlock = true // Ya está desbloqueado si llegamos acá
        break
      case 'explorer':
        // Se desbloquea cuando ve 5 experiencias (simulado)
        shouldUnlock = stats.points >= 50
        break
      case 'social_butterfly':
        shouldUnlock = stats.groupsCreated >= 1
        break
      case 'group_leader':
        shouldUnlock = stats.groupsCreated >= 3
        break
      case 'community_voice':
        shouldUnlock = stats.postsCreated >= 5
        break
      case 'early_bird':
        shouldUnlock = stats.streak >= 7
        break
      case 'adventurer':
        shouldUnlock = stats.experiencesCompleted >= 3
        break
    }
    
    if (shouldUnlock && !badge.unlocked) {
      badge.unlocked = true
      badge.unlockedAt = Date.now()
      if (!unlockedBadge) {
        unlockedBadge = badge
      }
    }
  })
  
  return unlockedBadge
}

function checkAchievements(stats: UserStats): void {
  stats.achievements.forEach(achievement => {
    if (achievement.unlocked) return
    
    switch (achievement.id) {
      case 'points_100':
        achievement.progress = Math.min(stats.points, 100)
        break
      case 'points_500':
        achievement.progress = Math.min(stats.points, 500)
        break
      case 'points_1000':
        achievement.progress = Math.min(stats.points, 1000)
        break
      case 'groups_5':
        achievement.progress = Math.min(stats.groupsCreated, 5)
        break
      case 'posts_10':
        achievement.progress = Math.min(stats.postsCreated, 10)
        break
    }
    
    if (achievement.progress >= achievement.maxProgress) {
      achievement.unlocked = true
      stats.points += achievement.points
    }
  })
}

export function updateStat(statName: keyof UserStats, value: number): void {
  const stats = getUserStats()
  if (typeof stats[statName] === 'number') {
    ;(stats[statName] as number) = value
    saveUserStats(stats)
  }
}

export function incrementStat(statName: 'groupsCreated' | 'groupsJoined' | 'postsCreated' | 'experiencesCompleted'): void {
  const stats = getUserStats()
  stats[statName] += 1
  saveUserStats(stats)
}

