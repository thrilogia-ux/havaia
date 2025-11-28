'use client'

import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function ExperienciasView({ experiencias, onEdit, onDelete, onCreate }: any) {
  return (
    <div className="space-y-4">
      {experiencias.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No hay experiencias</p>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Crear Primera Experiencia
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ubicación</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {experiencias.map((exp: any) => (
                <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{exp.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{exp.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">${exp.price}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{exp.location}</td>
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
                        onClick={() => onDelete('experiencia', exp.id)}
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

