'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { getGrupoById, getMensajes, addMensaje, updateGrupo, type Grupo, type Mensaje } from '@/lib/data'
import { incrementStat, getUserStats } from '@/lib/gamification'
import { updateChallengeProgress } from '@/lib/challenges'
import { showToast } from '@/components/ToastContainer'
import { 
  UserGroupIcon, 
  CalendarDaysIcon,
  MapPinIcon,
  PaperClipIcon,
  PhotoIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function GrupoChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const grupoId = parseInt(id)
  const user = getCurrentUser()
  
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const grupoData = getGrupoById(grupoId)
    if (!grupoData) {
      router.push('/grupos')
      return
    }
    
    setGrupo(grupoData)
    setMensajes(getMensajes(grupoId))
  }, [grupoId, user, router])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !grupo) return

    const mensaje: Mensaje = {
      id: Date.now(),
      grupoId: grupoId,
      userId: user.id,
      userName: user.name,
      text: newMessage,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }

    addMensaje(mensaje)
    setMensajes([...mensajes, mensaje])
    setNewMessage('')
  }

  const handleUnirse = () => {
    if (!user || !grupo) return

    if (grupo.spots.disponibles <= 0) {
      alert('No hay cupos disponibles')
      return
    }

    const yaEsMiembro = grupo.miembros.some(m => m.id.toString() === user.id)
    if (yaEsMiembro) {
      alert('Ya sos miembro de este grupo')
      return
    }

    const grupoActualizado: Grupo = {
      ...grupo,
      miembros: [
        ...grupo.miembros,
        {
          id: grupo.miembros.length + 1,
          name: user.name,
          role: 'Miembro',
          avatar: user.name.charAt(0)
        }
      ],
      spots: {
        ...grupo.spots,
        confirmados: grupo.spots.confirmados + 1,
        disponibles: grupo.spots.disponibles - 1
      }
    }

    updateGrupo(grupoActualizado)
    setGrupo(grupoActualizado)

    // Gamificación
    incrementStat('groupsJoined')
    const challengeResult = updateChallengeProgress('join_2_groups', getUserStats().groupsJoined)
    if (challengeResult.completed) {
      showToast(`¡Desafío completado! +${challengeResult.points} puntos extra! 🏆`, 'success', 5000)
    }
    showToast(`Te uniste al grupo! 🎉`, 'success')

    // Mensaje de bienvenida
    const mensajeBienvenida: Mensaje = {
      id: Date.now() + 1,
      grupoId: grupoId,
      userId: 'system',
      userName: 'Sistema',
      text: `${user.name} se unió al grupo`,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }
    addMensaje(mensajeBienvenida)
    setMensajes([...mensajes, mensajeBienvenida])
  }

  if (!grupo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Cargando grupo...</p>
        </div>
      </div>
    )
  }

  const esMiembro = grupo.miembros.some(m => m.id.toString() === user?.id || m.name === user?.name)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info del grupo */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{grupo.name}</h1>
                  <p className="text-gray-600">{grupo.experiencia}</p>
                </div>
                <Link
                  href={`/experiencias/${grupo.experienciaId}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                >
                  Ver experiencia →
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-semibold">{grupo.fecha}</p>
                    <p className="text-sm text-gray-600">{grupo.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <p className="font-semibold">{grupo.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Cupos</p>
                    <p className="font-semibold">{grupo.spots.confirmados} de {grupo.spots.total}</p>
                    <p className="text-xs text-gray-500">{grupo.spots.disponibles} disponibles</p>
                  </div>
                </div>
              </div>

              {!esMiembro && grupo.spots.disponibles > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleUnirse}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Unirme a este grupo
                  </button>
                </div>
              )}
            </div>

            {/* Chat */}
            {esMiembro ? (
              <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{ height: '600px' }}>
                {/* Header del chat */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {grupo.miembros.slice(0, 3).map((m, idx) => (
                          <div key={idx} className="w-8 h-8 bg-primary-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                            {m.avatar || m.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{grupo.miembros.length} miembros</p>
                        <p className="text-xs text-gray-600 capitalize">{grupo.privacidad}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensajes.length > 0 ? (
                    mensajes.map(msg => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {msg.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{msg.userName}</p>
                            <p className="text-xs text-gray-500">{msg.time}</p>
                          </div>
                          <p className="text-gray-700">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                    </div>
                  )}
                </div>

                {/* Input de mensaje */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribí un mensaje..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-600 mb-4">Unite al grupo para ver y enviar mensajes</p>
                <button
                  onClick={handleUnirse}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Unirme al grupo
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Miembros */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Miembros</h2>
                <span className="text-sm text-gray-600">{grupo.miembros.length}/{grupo.spots.total}</span>
              </div>
              <div className="space-y-3">
                {grupo.miembros.map(miembro => (
                  <div key={miembro.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                      {miembro.avatar || miembro.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{miembro.name}</p>
                      <p className="text-xs text-gray-600">{miembro.role}</p>
                    </div>
                    {miembro.role === 'Coordinador' && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
              {grupo.spots.disponibles > 0 && esMiembro && (
                <button className="mt-4 w-full flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm border-2 border-primary-300 rounded-lg py-2 transition-colors">
                  <PlusIcon className="w-5 h-5" />
                  Invitar miembros
                </button>
              )}
            </div>

            {/* Acciones rápidas */}
            {esMiembro && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones rápidas</h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-900">Crear encuesta</p>
                    <p className="text-xs text-gray-600">Preguntá al grupo algo</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-900">Checklist previa</p>
                    <p className="text-xs text-gray-600">Preparación para la experiencia</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <p className="font-semibold text-gray-900">Dividir pagos</p>
                    <p className="text-xs text-gray-600">Gestionar pagos del grupo</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-700">
                    <p className="font-semibold">Necesito ayuda</p>
                    <p className="text-xs">Contactar soporte 24/7</p>
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
