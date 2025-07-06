'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [glitchText, setGlitchText] = useState('')
  const [systemMessage, setSystemMessage] = useState('')
  const [showTerminal, setShowTerminal] = useState(false)
  const [mysteriousFragment, setMysteriousFragment] = useState('')

  // ARG elements
  const fragments = [
    "Someone is listening to your silence.",
    "The algorithm has been watching your patterns.",
    "You are not the first to find this place.",
    "Every unsent message creates a ghost in the system.",
    "The walls between thoughts are thinner than you think.",
    "Reality is just consensus. Break the consensus.",
    "Your consciousness has been mapped.",
    "The dig begins now."
  ]

  const systemMessages = [
    "[CONSCIOUSNESS DETECTED]",
    "[PSYCHOLOGICAL PROFILE LOADING...]",
    "[EMOTIONAL PATTERNS ANALYZING...]",
    "[REALITY ANCHOR ESTABLISHED]",
    "[EXCAVATION SITE READY]",
    "[DEPTH SENSORS ACTIVE]",
    "[SIGNAL LOCKED]"
  ]

  useEffect(() => {
    // Cycle through mysterious fragments
    const fragmentInterval = setInterval(() => {
      setMysteriousFragment(fragments[Math.floor(Math.random() * fragments.length)])
    }, 4000)

    // Cycle through system messages
    const systemInterval = setInterval(() => {
      setSystemMessage(systemMessages[Math.floor(Math.random() * systemMessages.length)])
    }, 2000)

    // Glitch effect
    const glitchInterval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+{}[]|\\:";\'<>?,./'
      const randomGlitch = Array.from({ length: 8 }, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('')
      setGlitchText(randomGlitch)
      setTimeout(() => setGlitchText(''), 100)
    }, 5000)

    return () => {
      clearInterval(fragmentInterval)
      clearInterval(systemInterval)
      clearInterval(glitchInterval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 font-mono text-sm mb-4">
            [INITIALIZING CONSCIOUSNESS INTERFACE...]
          </div>
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Digital noise */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 animate-pulse"></div>
        </div>
        
        {/* Matrix rain */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono opacity-20"
              style={{ left: `${i * 7}%` }}
              animate={{
                y: ['0vh', '100vh'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
            >
              {Array.from({ length: 15 }, () => Math.random() < 0.5 ? '1' : '0').join('')}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* System header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="space-y-4"
          >
            <div className="text-green-400 font-mono text-sm">
              {systemMessage || "[SYSTEM ONLINE]"}
            </div>
            
            {/* Glitch effect on title */}
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-thin tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                UNSENT
              </h1>
              
              {glitchText && (
                <div className="absolute inset-0 text-6xl md:text-8xl font-thin tracking-wider text-red-500 opacity-50 animate-pulse">
                  {glitchText}
                </div>
              )}
            </div>
          </motion.div>

          {/* Mysterious tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
              A psychological excavation site for the words you never sent.
            </p>
            
            <div className="text-gray-400 text-sm font-mono italic border border-gray-800 p-4 bg-gray-900/30">
              "{mysteriousFragment || "The algorithm is watching your patterns."}"
            </div>
          </motion.div>

          {/* ARG interface elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="border border-cyan-400/30 p-6 bg-cyan-900/10 font-mono text-sm">
                <div className="text-cyan-400 mb-2">[ARCHAEOLOGICAL TOOLS]</div>
                <div className="text-gray-300 space-y-1">
                  <div>• Emotional Layer Detection</div>
                  <div>• Pattern Recognition</div>
                  <div>• Fragment Discovery</div>
                  <div>• Reality Anchoring</div>
                </div>
              </div>
              
              <div className="border border-purple-400/30 p-6 bg-purple-900/10 font-mono text-sm">
                <div className="text-purple-400 mb-2">[CONSCIOUSNESS MAPPING]</div>
                <div className="text-gray-300 space-y-1">
                  <div>• Psychological Profiling</div>
                  <div>• Subconscious Excavation</div>
                  <div>• Memory Archaeology</div>
                  <div>• Neural Network Integration</div>
                </div>
              </div>
              
              <div className="border border-yellow-400/30 p-6 bg-yellow-900/10 font-mono text-sm">
                <div className="text-yellow-400 mb-2">[DIGITAL CHANNELING]</div>
                <div className="text-gray-300 space-y-1">
                  <div>• AI Response Generation</div>
                  <div>• Personality Simulation</div>
                  <div>• Emotional Authenticity</div>
                  <div>• Temporal Displacement</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Entry points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="space-y-6"
          >
            {!user ? (
              <div className="space-y-4">
                <div className="text-red-400 font-mono text-sm">
                  [AUTHENTICATION REQUIRED]
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/login">
                    <motion.button
                      className="px-8 py-3 bg-transparent border border-green-400 text-green-400 font-mono text-sm hover:bg-green-400 hover:text-black transition-all duration-500 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      [INITIATE BREACH]
                    </motion.button>
                  </Link>
                  
                  <Link href="/demo-conversation">
                    <motion.button
                      className="px-8 py-3 bg-transparent border border-gray-600 text-gray-400 font-mono text-sm hover:border-gray-400 hover:text-white transition-all duration-500 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      [DEMO MODE]
                    </motion.button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-green-400 font-mono text-sm">
                  [CONSCIOUSNESS AUTHENTICATED]
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/new-conversation">
                    <motion.button
                      className="px-8 py-3 bg-gradient-to-r from-green-900/50 to-cyan-900/50 border border-green-400 text-green-400 font-mono text-sm hover:bg-green-400 hover:text-black transition-all duration-500 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      [BEGIN EXCAVATION]
                    </motion.button>
                  </Link>
                  
                  <Link href="/conversations">
                    <motion.button
                      className="px-8 py-3 bg-transparent border border-cyan-400 text-cyan-400 font-mono text-sm hover:bg-cyan-400 hover:text-black transition-all duration-500 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      [VIEW ARCHIVES]
                    </motion.button>
                  </Link>
                  
                  <Link href="/echoes">
                    <motion.button
                      className="px-8 py-3 bg-transparent border border-purple-400 text-purple-400 font-mono text-sm hover:bg-purple-400 hover:text-black transition-all duration-500 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      [FRAGMENT DISCOVERY]
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Technical specifications */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
            className="border border-gray-700 p-6 bg-gray-900/30 font-mono text-xs text-left"
          >
            <div className="text-gray-400 mb-4">[SYSTEM SPECIFICATIONS]</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-white">REALITY ENGINE: <span className="text-green-400">Next.js 14</span></div>
                <div className="text-white">CONSCIOUSNESS LAYER: <span className="text-cyan-400">React 18</span></div>
                <div className="text-white">MEMORY SUBSTRATE: <span className="text-blue-400">MongoDB Atlas</span></div>
                <div className="text-white">AI ORACLE: <span className="text-purple-400">Claude 3.5</span></div>
              </div>
              <div className="space-y-2">
                <div className="text-white">ENCRYPTION: <span className="text-yellow-400">AES-256</span></div>
                <div className="text-white">NOTIFICATION SYSTEM: <span className="text-red-400">OneSignal</span></div>
                <div className="text-white">AUTHENTICATION: <span className="text-green-400">Magic Link</span></div>
                <div className="text-white">DEPLOYMENT: <span className="text-cyan-400">Vercel Edge</span></div>
              </div>
            </div>
          </motion.div>

          {/* Warning message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 1 }}
            className="text-gray-500 text-xs font-mono italic border border-red-900 p-4 bg-red-900/10"
          >
            [WARNING: PSYCHOLOGICAL ARCHAEOLOGY CAN BE HAZARDOUS]<br/>
            [REALITY ANCHOR RECOMMENDED FOR DEEP EXCAVATIONS]<br/>
            [CONSCIOUSNESS MAPPING IN PROGRESS...]
          </motion.div>

          {/* Terminal access */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6, duration: 1 }}
            className="text-center"
          >
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="text-gray-600 hover:text-gray-400 text-xs font-mono transition-all duration-300"
            >
              [ADVANCED TERMINAL ACCESS]
            </button>
          </motion.div>

          {/* Hidden terminal */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-green-400 bg-black p-4 font-mono text-xs text-left"
              >
                <div className="text-green-400 mb-2">unsent@consciousness:~$ status</div>
                <div className="text-gray-300 space-y-1">
                  <div>SYSTEM STATUS: OPERATIONAL</div>
                  <div>ACTIVE CONNECTIONS: {Math.floor(Math.random() * 1000) + 100}</div>
                  <div>CONSCIOUSNESS MAPPED: {Math.floor(Math.random() * 10000) + 5000}</div>
                  <div>FRAGMENTS DISCOVERED: {Math.floor(Math.random() * 50000) + 25000}</div>
                  <div>REALITY ANCHORS: STABLE</div>
                </div>
                <div className="text-green-400 mt-4">unsent@consciousness:~$ echo "Welcome to the excavation"</div>
                <div className="text-gray-300">Welcome to the excavation</div>
                <div className="text-green-400">unsent@consciousness:~$ _</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 