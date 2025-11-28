'use client'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-8xl mb-6 animate-float">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover-lift"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}




