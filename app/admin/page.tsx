'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { adminAPI } from '@/lib/api'
import {
  ChartBarIcon,
  SparklesIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import ExperienciasView from './components/ExperienciasView'
import PremiumExperiencesView from './components/PremiumExperiencesView'
import EditModal from './components/EditModal'

type Tab = 'dashboard' | 'experiencias' | 'premium-experiences' | 'posts' | 'grupos' | 'usuarios' | 'reservas'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({})
  const [editing, setEditing] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'host')) {
        setLoading(false)
        return
      }
      
      loadStats()
      if (activeTab !== 'dashboard') {
        loadTabData()
      } else {
        setLoading(false)
      }
    }
    
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [activeTab])

  const loadStats = async () => {
    try {
      const statsData = await adminAPI.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTabData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'experiencias':
          const exp = await adminAPI.experiencias.getAll()
          setData({ experiencias: exp })
          break
        case 'premium-experiences':
          const premiumExp = await adminAPI.premiumExperiences.getAll()
          setData({ premiumExperiences: premiumExp })
          break
        case 'posts':
          const posts = await adminAPI.posts.getAll()
          setData({ posts })
          break
        case 'grupos':
          const grupos = await adminAPI.grupos.getAll()
          setData({ grupos })
          break
        case 'usuarios':
          if (user?.role === 'admin') {
            const usuarios = await adminAPI.usuarios.getAll()
            setData({ usuarios })
          }
          break
        case 'reservas':
          if (user?.role === 'admin') {
            const reservas = await adminAPI.reservas.getAll()
            setData({ reservas })
          }
          break
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: string, id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.')) return

    try {
      switch (type) {
        case 'experiencia':
          await adminAPI.experiencias.delete(id as number)
          break
        case 'premium-experience':
          await adminAPI.premiumExperiences.delete(id as number)
          break
        case 'post':
          await adminAPI.posts.delete(id as number)
          break
        case 'grupo':
          await adminAPI.grupos.delete(id as number)
          break
        case 'usuario':
          await adminAPI.usuarios.delete(id as string)
          break
        case 'reserva':
          await adminAPI.reservas.delete(id as number)
          break
      }
      loadTabData()
      alert('Elemento eliminado correctamente')
    } catch (error) {
      alert('Error al eliminar: ' + (error as Error).message)
    }
  }

  const handleSave = async (type: string, item: any) => {
    try {
      switch (type) {
        case 'experiencia':
          if (item.id) {
            await adminAPI.experiencias.update(item)
          } else {
            await adminAPI.experiencias.create(item)
          }
          break
        case 'premium-experience':
          if (item.id) {
            await adminAPI.premiumExperiences.update(item)
          } else {
            await adminAPI.premiumExperiences.create(item)
          }
          break
        case 'post':
          await adminAPI.posts.update(item)
          break
        case 'grupo':
          await adminAPI.grupos.update(item)
          break
        case 'usuario':
          await adminAPI.usuarios.update(item)
          break
        case 'reserva':
          await adminAPI.reservas.update(item)
          break
      }
      setShowModal(false)
      setEditing(null)
      loadTabData()
      alert('Guardado correctamente')
    } catch (error) {
      alert('Error al guardar: ' + (error as Error).message)
    }
  }

  if (!user || (user.role !== 'admin' && user.role !== 'host')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-6">
              {!user 
                ? 'Necesitas iniciar sesión con una cuenta de administrador o anfitrión para acceder al panel.'
                : 'Tu cuenta no tiene permisos para acceder al panel de administración.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Para crear un usuario admin:</p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Ve a <code className="bg-blue-100 px-1 rounded">data/usuarios.json</code></li>
                <li>Agrega un usuario con <code className="bg-blue-100 px-1 rounded">"role": "admin"</code></li>
                <li>Inicia sesión con ese usuario</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = user.role === 'admin'
  const isHost = user.role === 'host'

  // Filtrar datos según búsqueda
  const filteredData = () => {
    if (!searchTerm) return data
    
    const search = searchTerm.toLowerCase()
    switch (activeTab) {
      case 'experiencias':
        return {
          experiencias: (data.experiencias || []).filter((e: any) =>
            e.title?.toLowerCase().includes(search) ||
            e.description?.toLowerCase().includes(search) ||
            e.category?.toLowerCase().includes(search) ||
            e.location?.toLowerCase().includes(search)
          )
        }
      case 'posts':
        return {
          posts: (data.posts || []).filter((p: any) =>
            p.title?.toLowerCase().includes(search) ||
            p.content?.toLowerCase().includes(search) ||
            p.category?.toLowerCase().includes(search)
          )
        }
      case 'grupos':
        return {
          grupos: (data.grupos || []).filter((g: any) =>
            g.name?.toLowerCase().includes(search) ||
            g.description?.toLowerCase().includes(search)
          )
        }
      case 'usuarios':
        return {
          usuarios: (data.usuarios || []).filter((u: any) =>
            u.name?.toLowerCase().includes(search) ||
            u.email?.toLowerCase().includes(search)
          )
        }
      default:
        return data
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600">
                {isAdmin ? 'Administrador General' : 'Anfitrión'} - {user.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                Ver Sitio Web
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar de navegación */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-24">
            <nav className="space-y-1">
              <NavButton
                icon={ChartBarIcon}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                count={null}
              />
              <NavButton
                icon={SparklesIcon}
                label="Experiencias"
                active={activeTab === 'experiencias'}
                onClick={() => setActiveTab('experiencias')}
                count={stats?.experiencias}
              />
              <NavButton
                icon={SparklesIcon}
                label="Mesas Gastronómicas"
                active={activeTab === 'premium-experiences'}
                onClick={() => setActiveTab('premium-experiences')}
                count={stats?.premiumExperiences}
              />
              {isAdmin && (
                <>
                  <NavButton
                    icon={DocumentTextIcon}
                    label="Posts"
                    active={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                    count={stats?.posts}
                  />
                  <NavButton
                    icon={UserGroupIcon}
                    label="Grupos"
                    active={activeTab === 'grupos'}
                    onClick={() => setActiveTab('grupos')}
                    count={stats?.grupos}
                  />
                  <NavButton
                    icon={UsersIcon}
                    label="Usuarios"
                    active={activeTab === 'usuarios'}
                    onClick={() => setActiveTab('usuarios')}
                    count={stats?.usuarios}
                  />
                  <NavButton
                    icon={CalendarDaysIcon}
                    label="Reservas"
                    active={activeTab === 'reservas'}
                    onClick={() => setActiveTab('reservas')}
                    count={stats?.reservas}
                  />
                </>
              )}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {loading && activeTab === 'dashboard' ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>
              </div>
            ) : activeTab === 'dashboard' ? (
              <DashboardView stats={stats} />
            ) : (
              <ContentView
                activeTab={activeTab}
                data={filteredData()}
                loading={loading}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                onEdit={(item: any) => {
                  setEditing(item)
                  setShowModal(true)
                }}
                onDelete={handleDelete}
                onCreate={() => {
                  setEditing(null)
                  setShowModal(true)
                }}
                isAdmin={isAdmin}
                isHost={isHost}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showModal && (
        <EditModal
          type={activeTab}
          item={editing}
          onClose={() => {
            setShowModal(false)
            setEditing(null)
          }}
          onSave={handleSave}
          user={user}
        />
      )}
    </div>
  )
}

function NavButton({ icon: Icon, label, active, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {count !== null && count !== undefined && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          active ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}

function DashboardView({ stats }: { stats: any }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Experiencias"
          value={stats.experiencias}
          icon={SparklesIcon}
          color="text-primary-600"
          bgColor="bg-primary-50"
        />
        <StatCard
          title="Grupos"
          value={stats.grupos}
          icon={UserGroupIcon}
          color="text-secondary-600"
          bgColor="bg-secondary-50"
        />
        <StatCard
          title="Posts"
          value={stats.posts}
          icon={DocumentTextIcon}
          color="text-accent-600"
          bgColor="bg-accent-50"
        />
        {stats.usuarios !== null && (
          <StatCard
            title="Usuarios"
            value={stats.usuarios}
            icon={UsersIcon}
            color="text-gray-600"
            bgColor="bg-gray-50"
          />
        )}
      </div>

      {stats.experienciasPendientes !== undefined && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de Experiencias</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Pendientes</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.experienciasPendientes}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Aprobadas</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.experienciasAprobadas}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Reservas</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.reservas}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value || 0}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function ContentView({ activeTab, data, loading, searchTerm, onSearch, onEdit, onDelete, onCreate, isAdmin, isHost }: any) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'experiencias':
        return (
          <ExperienciasView
            experiencias={data.experiencias || []}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
          />
        )
      case 'premium-experiences':
        return (
          <PremiumExperiencesView
            experiences={data.premiumExperiences || []}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
          />
        )
      case 'posts':
        return (
          <PostsView
            posts={data.posts || []}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      case 'grupos':
        return (
          <GruposView
            grupos={data.grupos || []}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      case 'usuarios':
        return (
          <UsuariosView
            usuarios={data.usuarios || []}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      case 'reservas':
        return (
          <ReservasView
            reservas={data.reservas || []}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {activeTab === 'experiencias' ? 'Experiencias' :
             activeTab === 'premium-experiences' ? 'Mesas Gastronómicas Premium' :
             activeTab === 'posts' ? 'Posts de la Comunidad' :
             activeTab === 'grupos' ? 'Grupos' :
             activeTab === 'usuarios' ? 'Usuarios' :
             activeTab === 'reservas' ? 'Reservas' : ''}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {(activeTab === 'experiencias' || activeTab === 'premium-experiences' || (isAdmin && activeTab !== 'usuarios' && activeTab !== 'reservas')) && (
              <button
                onClick={onCreate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  )
}

function PostsView({ posts, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay posts</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post: any) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{post.title || 'Sin título'}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Categoría: {post.category}</span>
                    <span>Likes: {post.likes || 0}</span>
                    <span>Comentarios: {post.comments || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete('post', post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GruposView({ grupos, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      {grupos.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay grupos</p>
      ) : (
        <div className="space-y-3">
          {grupos.map((grupo: any) => (
            <div key={grupo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{grupo.name}</h3>
                  <p className="text-sm text-gray-600">{grupo.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Miembros: {grupo.members?.length || 0}</span>
                    <span>Creado: {new Date(grupo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(grupo)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete('grupo', grupo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function UsuariosView({ usuarios, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      {usuarios.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay usuarios</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario: any) => (
                <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{usuario.name}</td>
                  <td className="py-3 px-4">{usuario.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      usuario.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      usuario.role === 'host' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.role === 'admin' ? 'Administrador' :
                       usuario.role === 'host' ? 'Anfitrión' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(usuario)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete('usuario', usuario.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ReservasView({ reservas, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      {reservas.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay reservas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Experiencia</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva: any) => (
                <tr key={reserva.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{reserva.experienciaTitle || `ID: ${reserva.experienciaId}`}</td>
                  <td className="py-3 px-4">{reserva.userName || reserva.userId}</td>
                  <td className="py-3 px-4">
                    {reserva.date ? new Date(reserva.date).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      reserva.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reserva.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reserva.status === 'confirmed' ? 'Confirmada' :
                       reserva.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(reserva)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete('reserva', reserva.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
