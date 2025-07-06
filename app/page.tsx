'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Input, Button, Card, CardBody, Divider, Spinner } from '@heroui/react'
import { NavbarComponent } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

import { useAuth } from '@/lib/AuthContext'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  petContext?: any
}

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [mysteriousFragment, setMysteriousFragment] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Mostrar fragmento misterioso aleatorio
    const fragments = [
      "Algunas palabras solo esperan el momento adecuado para ser escritas...",
      "En el silencio de la noche, los pensamientos no enviados cobran vida",
      "¿Qué dirías si supieras que nadie más lo leería?",
      "Los secretos más profundos nacen en la oscuridad",
      "Cada mensaje no enviado es una puerta hacia la verdad interior"
    ]
    const randomFragment = fragments[Math.floor(Math.random() * fragments.length)]
    setMysteriousFragment(randomFragment)
  }, [])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowWelcome(true)
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-purple-300 text-lg">Cargando...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse"></div>
        
        {/* Luces de neón flotantes */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-pulse delay-2000"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-2xl"
          >
            {/* Logo/Título */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)",
                filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.8))"
              }}
            >
              UNSENT
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 font-light"
            >
              Mensajes que nunca se enviaron
            </motion.p>

            {/* Fragmento misterioso */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mb-12 p-6 border border-purple-500/30 bg-black/40 backdrop-blur-sm rounded-lg"
            >
              <p className="text-purple-300 italic text-lg leading-relaxed">
                "{mysteriousFragment}"
              </p>
            </motion.div>

            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="space-y-4"
            >
              <Link
                href="/auth/login"
                className="block w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                style={{
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
                }}
              >
                Comenzar a escribir
              </Link>
              
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Un espacio seguro para escribir lo que nunca pudiste decir. 
                Procesa tus emociones y encuentra la paz.
              </p>
            </motion.div>
          </motion.div>

          {/* Advertencia sobre cifrado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center max-w-md"
          >
            <p className="text-xs text-gray-500 leading-relaxed">
              🔒 Todos tus mensajes están cifrados localmente. Si cambias de dispositivo sin hacer backup, no podrás recuperar tus conversaciones.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Bienvenido{user?.name ? `, ${user.name}` : ''}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Link
                href="/conversations"
                className="p-6 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all duration-300 hover:bg-black/60"
              >
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Conversaciones</h3>
                <p className="text-gray-400 text-sm">Ver todas tus conversaciones</p>
              </Link>
              
              <Link
                href="/new-conversation"
                className="p-6 bg-black/40 backdrop-blur-sm border border-pink-500/30 rounded-lg hover:border-pink-500/50 transition-all duration-300 hover:bg-black/60"
              >
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Nueva Conversación</h3>
                <p className="text-gray-400 text-sm">Comenzar a escribir</p>
              </Link>
              
              <Link
                href="/echoes"
                className="p-6 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all duration-300 hover:bg-black/60"
              >
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Ecos</h3>
                <p className="text-gray-400 text-sm">Fragmentos misteriosos</p>
              </Link>
              
              <Link
                href="/premium"
                className="p-6 bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-black/60"
              >
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">Premium</h3>
                <p className="text-gray-400 text-sm">Respuestas de IA</p>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 