'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/auth'
import { PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Message {
  id: number
  userId: string
  userName: string
  userAvatar?: string
  lastMessage: string
  timestamp: number
  unread: number
}

export default function MensajesPage() {
  const user = getCurrentUser()
  const [conversations, setConversations] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    // Cargar conversaciones desde localStorage
    const stored = localStorage.getItem(`gentum_conversations_${user.id}`)
    if (stored) {
      setConversations(JSON.parse(stored))
    } else {
      // Conversaciones de ejemplo
      const example: Message[] = [
        {
          id: 1,
          userId: 'user2',
          userName: 'Itai',
          lastMessage: '¡Hola! ¿Cómo estás?',
          timestamp: Date.now() - 3600000,
          unread: 2
        },
        {
          id: 2,
          userId: 'user3',
          userName: 'Sara',
          lastMessage: 'Gracias por la recomendación',
          timestamp: Date.now() - 7200000,
          unread: 0
        }
      ]
      setConversations(example)
      localStorage.setItem(`gentum_conversations_${user.id}`, JSON.stringify(example))
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Iniciá sesión para ver tus mensajes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 h-[600px]">
              {/* Lista de conversaciones */}
              <div className="border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Mensajes</h1>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar conversaciones..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedConversation === conv.userId ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conv.userAvatar ? (
                            <img src={conv.userAvatar} alt={conv.userName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            conv.userName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">{conv.userName}</p>
                            {conv.unread > 0 && (
                              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(conv.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Área de chat */}
              <div className="md:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {conversations.find(c => c.userId === selectedConversation)?.userName}
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Mensajes mock */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                          I
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                          <p className="text-gray-900">¡Hola! ¿Cómo estás?</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary-500 text-white rounded-lg px-4 py-2 max-w-xs">
                          <p>¡Hola! Todo bien, gracias</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Escribir mensaje..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              // Enviar mensaje
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <button className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                          <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <PaperAirplaneIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Seleccioná una conversación para comenzar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

