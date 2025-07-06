'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function NewConversationPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const suggestedTitles = [
    'Carta a mi yo del pasado',
    'Para quien ya no está',
    'Lo que nunca pude decir',
    'Conversación pendiente',
    'Mi verdad sin filtros',
    'Palabras no pronunciadas',
    'Mensaje del corazón',
    'Diálogo interior',
    'Secretos guardados',
    'Reflexiones nocturnas'
  ]

  const handleCreateConversation = async () => {
    if (!title && !customTitle) return
    
    setIsCreating(true)
    
    try {
      const finalTitle = customTitle || title
      
      // TODO: Create conversation in database
      console.log('Creating conversation:', finalTitle)
      
      // For now, redirect to a mock conversation
      setTimeout(() => {
        router.push(`/conversation/new?title=${encodeURIComponent(finalTitle)}`)
      }, 1000)
      
    } catch (error) {
      console.error('Error creating conversation:', error)
      setIsCreating(false)
    }
  }

  const mysteriousFragments = [
    "Cada conversación es un viaje hacia la verdad interior...",
    "En el silencio de las palabras no dichas, nace la sabiduría.",
    "¿Qué secretos guardas en el corazón?",
    "Algunas conversaciones solo pueden suceder en la soledad.",
    "El alma conoce las palabras que la mente teme pronunciar."
  ]

  const randomFragment = mysteriousFragments[Math.floor(Math.random() * mysteriousFragments.length)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Nueva Conversación
            </h1>
            <p className="text-gray-400 text-lg">
              Comienza un diálogo contigo mismo
            </p>
          </div>

          {/* Fragmento misterioso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8 p-6 border border-purple-500/30 bg-black/40 backdrop-blur-sm rounded-lg"
          >
            <p className="text-purple-300 italic text-center">
              "{randomFragment}"
            </p>
          </motion.div>

          {/* Título personalizado */}
          {showCustomInput ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <label className="block text-white text-sm font-medium mb-2">
                Título de tu conversación
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Escribe un título personalizado..."
                className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all duration-300"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomTitle('')
                }}
                className="mt-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          ) : (
            <>
              {/* Títulos sugeridos */}
              <div className="mb-8">
                <h2 className="text-white text-lg font-medium mb-4">
                  Elige un título o crea uno personalizado
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedTitles.map((suggestedTitle, index) => (
                    <motion.button
                      key={suggestedTitle}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setTitle(suggestedTitle)}
                      className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                        title === suggestedTitle
                          ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                          : 'border-purple-500/30 bg-black/40 text-gray-300 hover:border-purple-500/50 hover:bg-black/60'
                      }`}
                    >
                      {suggestedTitle}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Título personalizado */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={() => setShowCustomInput(true)}
                className="w-full p-4 border-2 border-dashed border-purple-500/30 rounded-lg text-purple-300 hover:border-purple-500/50 hover:bg-black/20 transition-all duration-300 mb-8"
              >
                + Crear título personalizado
              </motion.button>
            </>
          )}

          {/* Botón de crear */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center"
          >
            <button
              onClick={handleCreateConversation}
              disabled={(!title && !customTitle) || isCreating}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                (!title && !customTitle) || isCreating
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              {isCreating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </div>
              ) : (
                'Comenzar Conversación'
              )}
            </button>
          </motion.div>

          {/* Nota sobre privacidad */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              🔒 Tu conversación será cifrada y solo tú podrás leerla. 
              Ningún otro usuario, ni siquiera nosotros, tendrá acceso a tus mensajes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 