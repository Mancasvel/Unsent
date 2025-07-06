'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { EmotionStage, getStageColors } from '@/lib/emotionStages'
import Link from 'next/link'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  lastMessageAt: Date
  messageCount: number
  emotionalScore: number
  currentStage: EmotionStage
  isBurned: boolean
  isArchived: boolean
}

export default function ConversationsPage() {
  const { user, isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')

  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch real conversations from API
      // For now, using mock data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Carta a mi padre',
          lastMessage: 'Nunca pude decirte lo que realmente sentía...',
          lastMessageAt: new Date('2024-01-15'),
          messageCount: 12,
          emotionalScore: 75,
          currentStage: 'acceptance',
          isBurned: false,
          isArchived: false
        },
        {
          id: '2',
          title: 'Para mi yo del pasado',
          lastMessage: 'Ojalá hubiera sabido entonces lo que sé ahora...',
          lastMessageAt: new Date('2024-01-10'),
          messageCount: 8,
          emotionalScore: 45,
          currentStage: 'bargaining',
          isBurned: false,
          isArchived: false
        },
        {
          id: '3',
          title: 'Conversación archivada',
          lastMessage: 'Esta conversación fue archivada',
          lastMessageAt: new Date('2024-01-05'),
          messageCount: 15,
          emotionalScore: 90,
          currentStage: 'acceptance',
          isBurned: false,
          isArchived: true
        }
      ]
      setConversations(mockConversations)
      setLoading(false)
    }
  }, [isAuthenticated])

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'archived') return conv.isArchived
    if (filter === 'active') return !conv.isArchived && !conv.isBurned
    return !conv.isBurned
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Conversaciones</h1>
          <p className="text-gray-400">Todas las conversaciones que has tenido contigo mismo</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'active' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              Activas
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'archived' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              Archivadas
            </button>
          </div>

          {/* New Conversation Button */}
          <Link
            href="/new-conversation"
            className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            + Nueva Conversación
          </Link>

          {/* Conversations List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredConversations.map((conversation) => {
                const stageColor = getStageColors(conversation.currentStage)
                
                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300 hover:bg-black/60"
                  >
                    <Link href={`/conversation/${conversation.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {conversation.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{conversation.messageCount} mensajes</span>
                            <span>•</span>
                            <span>{conversation.lastMessageAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span 
                              className="font-medium"
                              style={{ color: stageColor }}
                            >
                              {conversation.currentStage}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="w-16 h-2 bg-gray-700 rounded-full mb-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${conversation.emotionalScore}%`,
                                backgroundColor: stageColor
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {conversation.emotionalScore}/100
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {filter === 'all' 
                  ? 'No tienes conversaciones aún' 
                  : filter === 'archived' 
                  ? 'No tienes conversaciones archivadas'
                  : 'No tienes conversaciones activas'
                }
              </p>
              <Link
                href="/new-conversation"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Comenzar tu primera conversación
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 