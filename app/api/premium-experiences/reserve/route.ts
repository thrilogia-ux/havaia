import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const PREMIUM_EXP_FILE = path.join(DATA_DIR, 'premium-experiences.json')

function readPremiumExperiences() {
  if (!fs.existsSync(PREMIUM_EXP_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(PREMIUM_EXP_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

function writePremiumExperiences(data: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(PREMIUM_EXP_FILE, JSON.stringify(data, null, 2))
}

// Reservar lugares en una experiencia premium
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { experienceId, userId, userName, userAvatar, seats } = body

    if (!experienceId || !userId || !userName || !seats) {
      return NextResponse.json(
        { error: 'Faltan datos para realizar la reserva' },
        { status: 400 }
      )
    }

    const experiences = readPremiumExperiences()
    const experience = experiences.find((e: any) => e.id === experienceId)

    if (!experience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      )
    }

    if (experience.reservedSeats + seats > experience.maxSeats) {
      return NextResponse.json(
        { error: 'No hay suficientes lugares disponibles' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya tiene una reserva
    const existingReservation = experience.reservations?.find((r: any) => r.userId === userId)
    if (existingReservation) {
      return NextResponse.json(
        { error: 'Ya tenés una reserva para esta experiencia' },
        { status: 400 }
      )
    }

    // Actualizar la experiencia
    const index = experiences.findIndex((e: any) => e.id === experienceId)
    experiences[index] = {
      ...experience,
      reservedSeats: experience.reservedSeats + seats,
      reservations: [
        ...(experience.reservations || []),
        {
          userId,
          userName,
          userAvatar,
          seats,
          timestamp: Date.now()
        }
      ]
    }

    writePremiumExperiences(experiences)

    return NextResponse.json({
      success: true,
      experience: experiences[index]
    })
  } catch (error) {
    console.error('Error en POST /api/premium-experiences/reserve:', error)
    return NextResponse.json(
      { error: 'Error al realizar la reserva' },
      { status: 500 }
    )
  }
}

// Cancelar reserva
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const experienceId = searchParams.get('experienceId')
    const userId = searchParams.get('userId')

    if (!experienceId || !userId) {
      return NextResponse.json(
        { error: 'Faltan datos para cancelar la reserva' },
        { status: 400 }
      )
    }

    const experiences = readPremiumExperiences()
    const experience = experiences.find((e: any) => e.id === parseInt(experienceId))

    if (!experience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      )
    }

    const reservation = experience.reservations?.find((r: any) => r.userId === userId)
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar la experiencia
    const index = experiences.findIndex((e: any) => e.id === parseInt(experienceId))
    experiences[index] = {
      ...experience,
      reservedSeats: experience.reservedSeats - reservation.seats,
      reservations: experience.reservations.filter((r: any) => r.userId !== userId)
    }

    writePremiumExperiences(experiences)

    return NextResponse.json({
      success: true,
      experience: experiences[index]
    })
  } catch (error) {
    console.error('Error en DELETE /api/premium-experiences/reserve:', error)
    return NextResponse.json(
      { error: 'Error al cancelar la reserva' },
      { status: 500 }
    )
  }
}

