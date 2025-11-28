'use client'

import { PencilIcon, TrashIcon, UserGroupIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function PremiumExperiencesView({ experiences, onEdit, onDelete, onCreate }: any) {
  return (
    <div className="space-y-4">
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No hay mesas gastronómicas premium</p>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Crear Primera Mesa Gastronómica
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Restaurante</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mesas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp: any) => (
                <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{exp.restaurant}</div>
                    <div className="text-sm text-gray-500">{exp.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{exp.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{exp.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                      <span>{exp.date ? new Date(exp.date).toLocaleDateString() : '-'}</span>
                      <span className="text-gray-400">|</span>
                      <span>{exp.time || '-'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">${exp.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {exp.reservedSeats || 0} / {exp.maxSeats || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      exp.status === 'approved' ? 'bg-green-100 text-green-800' :
                      exp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exp.status === 'approved' ? 'Aprobada' :
                       exp.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete('premium-experience', exp.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
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

