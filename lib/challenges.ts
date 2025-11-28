// Sistema de desafíos semanales

export interface Challenge {
  id: string
  name: string
  description: string
  icon: string
  points: number
  progress: number
  maxProgress: number
  completed: boolean
  completedAt?: number
  week: number // Semana del año
}

export interface WeeklyChallenges {
  week: number
  challenges: Challenge[]
  totalPoints: number
  completedChallenges: number
}

const CHALLENGES_TEMPLATE: Omit<Challenge, 'progress' | 'completed' | 'completedAt' | 'week'>[] = [
  {
    id: 'create_3_groups',
    name: 'Organizador Activo',
    description: 'Creá 3 grupos esta semana',
    icon: '👥',
    points: 50,
    maxProgress: 3,
  },
  {
    id: 'post_5_times',
    name: 'Voz Activa',
    description: 'Publicá 5 posts en la comunidad',
    icon: '📢',
    points: 40,
    maxProgress: 5,
  },
  {
    id: 'join_2_groups',
    name: 'Social',
    description: 'Unite a 2 grupos',
    icon: '🤝',
    points: 30,
    maxProgress: 2,
  },
  {
    id: 'daily_login',
    name: 'Fiel',
    description: 'Ingresá 7 días seguidos',
    icon: '🔥',
    points: 60,
    maxProgress: 7,
  },
  {
    id: 'explore_10',
    name: 'Explorador',
    description: 'Visitá 10 experiencias',
    icon: '🔍',
    points: 35,
    maxProgress: 10,
  },
]

export function getCurrentWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + start.getDay() + 1) / 7)
}

export function getWeeklyChallenges(): WeeklyChallenges {
  if (typeof window === 'undefined') {
    return { week: getCurrentWeek(), challenges: [], totalPoints: 0, completedChallenges: 0 }
  }

  const currentWeek = getCurrentWeek()
  const savedStr = localStorage.getItem('gentum_weekly_challenges')
  const saved = savedStr ? JSON.parse(savedStr) : null

  // Si es una nueva semana, resetear desafíos
  if (!saved || saved.week !== currentWeek) {
    const newChallenges: Challenge[] = CHALLENGES_TEMPLATE.map(ch => ({
      ...ch,
      progress: 0,
      completed: false,
      week: currentWeek,
    }))

    const weeklyChallenges: WeeklyChallenges = {
      week: currentWeek,
      challenges: newChallenges,
      totalPoints: newChallenges.reduce((sum, ch) => sum + ch.points, 0),
      completedChallenges: 0,
    }

    saveWeeklyChallenges(weeklyChallenges)
    return weeklyChallenges
  }

  return saved
}

export function saveWeeklyChallenges(challenges: WeeklyChallenges): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('gentum_weekly_challenges', JSON.stringify(challenges))
}

export function updateChallengeProgress(challengeId: string, progress: number): { completed: boolean; points: number } {
  const weekly = getWeeklyChallenges()
  const challenge = weekly.challenges.find(ch => ch.id === challengeId)

  if (!challenge) {
    return { completed: false, points: 0 }
  }

  challenge.progress = Math.min(progress, challenge.maxProgress)
  challenge.completed = challenge.progress >= challenge.maxProgress

  if (challenge.completed && !challenge.completedAt) {
    challenge.completedAt = Date.now()
    weekly.completedChallenges += 1
  }

  saveWeeklyChallenges(weekly)

  return {
    completed: challenge.completed && challenge.completedAt === Date.now(),
    points: challenge.completed && challenge.completedAt === Date.now() ? challenge.points : 0,
  }
}

export function checkChallenges(): void {
  // Esta función se llamaría periódicamente para verificar el progreso
  // Por ahora la dejamos como placeholder
}




