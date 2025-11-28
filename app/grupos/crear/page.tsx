'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { saveGrupo, experienciasData, type Grupo } from '@/lib/data'
import { addPoints, incrementStat, getUserStats } from '@/lib/gamification'
import { updateChallengeProgress } from '@/lib/challenges'
import { canCreateUnlimitedGroups, getGroupsLimit, getUserPlan } from '@/lib/subscriptions'
import { showToast } from '@/components/ToastContainer'
import { getGrupos } from '@/lib/data'
import { 
  UserGroupIcon, 
  LockClosedIcon, 
  GlobeAltIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

function CrearGrupoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const experienciaId = searchParams.get('experiencia')
  const user = getCurrentUser()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    privacidad: 'publico',
    cupo: 6,
    fecha: '',
    horario: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (experienciaId) {
      const exp = experienciasData.find(e => e.id === parseInt(experienciaId))
      if (exp && !formData.nombre) {
        setFormData(prev => ({
          ...prev,
          nombre: `Grupo de ${user.name} - ${exp.title}`
        }))
      }
    }
  }, [user, experienciaId, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Necesitás iniciar sesión para crear un grupo')
      return
    }

    // Verificar límite de grupos
    const plan = getUserPlan()
    const gruposCreados = getGrupos().filter(g => g.coordinadorId === user.id).length
    const limite = getGroupsLimit()
    
    if (!canCreateUnlimitedGroups() && gruposCreados >= limite) {
      showToast(`Llegaste al límite de ${limite} grupos por mes. ¡Actualizá a Premium para grupos ilimitados!`, 'warning', 6000)
      setTimeout(() => {
        window.location.href = '/planes'
      }, 2000)
      return
    }

    const fechaFormateada = formData.fecha 
      ? new Date(formData.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
      : 'Fecha no definida'

    const nuevoGrupo: Grupo = {
      id: Date.now(),
      name: formData.nombre,
      experienciaId: experienciaId ? parseInt(experienciaId) : 1,
      experiencia: experienciaId 
        ? experienciasData.find(e => e.id === parseInt(experienciaId))?.title || 'Experiencia'
        : 'Experiencia',
      fecha: fechaFormateada,
      horario: formData.horario,
      ubicacion: experienciaId 
        ? experienciasData.find(e => e.id === parseInt(experienciaId))?.location || 'Buenos Aires'
        : 'Buenos Aires',
      spots: {
        total: formData.cupo,
        confirmados: 1,
        disponibles: formData.cupo - 1
      },
      miembros: [{
        id: 1,
        name: user.name,
        role: 'Coordinador',
        avatar: user.name.charAt(0)
      }],
      privacidad: formData.privacidad as 'publico' | 'privado',
      coordinadorId: user.id
    }

    saveGrupo(nuevoGrupo)
    
    // Gamificación
    incrementStat('groupsCreated')
    const result = addPoints(20, 'Crear grupo')
    showToast(`+20 puntos por crear grupo! 🎉`, 'success')
    
    // Actualizar desafíos
    const challengeResult = updateChallengeProgress('create_3_groups', getUserStats().groupsCreated)
    if (challengeResult.completed) {
      addPoints(challengeResult.points, 'Desafío completado')
      showToast(`¡Desafío completado! +${challengeResult.points} puntos extra! 🏆`, 'success', 5000)
    }
    
    if (result.leveledUp) {
      showToast(`¡Subiste al nivel ${result.newStats.level}! 🚀`, 'success', 5000)
    }
    
    if (result.badgeUnlocked) {
      showToast(`¡Badge desbloqueado: ${result.badgeUnlocked.name}! 🏆`, 'success', 5000)
    }
    
    router.push(`/grupos/${nuevoGrupo.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Crear nuevo grupo</h1>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= s 
                  ? 'bg-primary-500 border-primary-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step > s ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > s ? 'bg-primary-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Paso 1: Configuración básica */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del grupo</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Grupo de Itai - Tour Gastronómico"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Privacidad
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, privacidad: 'publico' })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.privacidad === 'publico'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <GlobeAltIcon className="w-6 h-6 mb-2 text-primary-600" />
                    <p className="font-semibold text-gray-900">Público</p>
                    <p className="text-sm text-gray-600">Cualquiera puede unirse</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, privacidad: 'privado' })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.privacidad === 'privado'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <LockClosedIcon className="w-6 h-6 mb-2 text-primary-600" />
                    <p className="font-semibold text-gray-900">Solo invitación</p>
                    <p className="text-sm text-gray-600">Solo personas invitadas</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cupo máximo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={formData.cupo}
                    onChange={(e) => setFormData({ ...formData, cupo: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-lg">
                    <UserGroupIcon className="w-5 h-5 text-primary-600" />
                    <span className="font-bold text-primary-700">{formData.cupo} personas</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Fecha y horario */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fecha y horario</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horario
                </label>
                <select
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar horario</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                  <p className="font-semibold text-primary-900">Resumen</p>
                </div>
                <p className="text-sm text-primary-700">
                  {formData.fecha && formData.horario 
                    ? `Fecha seleccionada: ${formData.fecha} a las ${formData.horario}`
                    : 'Completá la fecha y horario para ver el resumen'}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmar y crear</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre del grupo</p>
                  <p className="font-semibold text-gray-900">{formData.nombre || 'Sin nombre'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Privacidad</p>
                  <p className="font-semibold text-gray-900 capitalize">{formData.privacidad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cupo máximo</p>
                  <p className="font-semibold text-gray-900">{formData.cupo} personas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y horario</p>
                  <p className="font-semibold text-gray-900">
                    {formData.fecha && formData.horario 
                      ? `${formData.fecha} a las ${formData.horario}`
                      : 'No seleccionado'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Al crear el grupo, serás el coordinador y podrás invitar miembros, gestionar pagos y coordinar la experiencia.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Crear grupo
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function CrearGrupoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <CrearGrupoContent />
    </Suspense>
  )
}

