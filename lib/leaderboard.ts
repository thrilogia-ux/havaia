// Sistema de leaderboard (ranking)

export interface LeaderboardEntry {
  userId: string
  userName: string
  userCity?: string
  points: number
  level: number
  rank: number
  badgeCount: number
  streak: number
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []

  // Obtener todos los usuarios del localStorage
  // En producción esto vendría de una API
  const users: LeaderboardEntry[] = []

  // Simulamos algunos usuarios para el leaderboard
  // En producción esto vendría de la base de datos
  const mockUsers: Omit<LeaderboardEntry, 'rank'>[] = [
    { userId: '1', userName: 'Itai', userCity: 'Tel Aviv', points: 1250, level: 13, badgeCount: 6, streak: 12 },
    { userId: '2', userName: 'Sara', userCity: 'Jerusalem', points: 980, level: 10, badgeCount: 5, streak: 8 },
    { userId: '3', userName: 'David', userCity: 'Haifa', points: 750, level: 8, badgeCount: 4, streak: 5 },
    { userId: '4', userName: 'Rachel', userCity: 'Tel Aviv', points: 620, level: 7, badgeCount: 3, streak: 3 },
    { userId: '5', userName: 'Yael', userCity: 'Jerusalem', points: 450, level: 5, badgeCount: 2, streak: 2 },
  ]

  // Agregar usuario actual si existe
  const currentUserStr = localStorage.getItem('gentum_user')
  const currentUserStatsStr = localStorage.getItem('gentum_user_stats')
  
  if (currentUserStr && currentUserStatsStr) {
    const currentUser = JSON.parse(currentUserStr)
    const currentStats = JSON.parse(currentUserStatsStr)
    
    mockUsers.push({
      userId: currentUser.id,
      userName: currentUser.name,
      userCity: currentUser.city,
      points: currentStats.points,
      level: currentStats.level,
      badgeCount: currentStats.badges.filter((b: any) => b.unlocked).length,
      streak: currentStats.streak,
    })
  }

  // Ordenar por puntos y asignar ranks
  const sorted = mockUsers.sort((a, b) => b.points - a.points)
  
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }))
}

export function getUserRank(userId: string): number {
  const leaderboard = getLeaderboard()
  const user = leaderboard.find(u => u.userId === userId)
  return user?.rank || 0
}




