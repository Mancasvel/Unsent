import { useState, useEffect, useCallback } from 'react'

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ConversationState {
  messages: ConversationMessage[]
  isLoading: boolean
  error: string | null
  conversationId: string | null
}

export interface UseConversationOptions {
  userId?: string
  sessionId?: string
  autoLoad?: boolean
}

export interface SendMessageOptions {
  personProfile?: any
  conversationId?: string
  onSuccess?: (response: any) => void
  onError?: (error: string) => void
}

/**
 * Custom hook for managing persistent conversations in Unsent
 */
export function useConversation(options: UseConversationOptions = {}) {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    error: null,
    conversationId: null
  })

  // Generate sessionId if userId is not provided
  const conversationId = options.userId 
    ? { userId: options.userId }
    : { sessionId: options.sessionId || generateSessionId() }

  /**
   * Generate a unique sessionId for anonymous users
   */
  function generateSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('unsent_session_id')
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('unsent_session_id', sessionId)
      }
      return sessionId
    }
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Load conversation history from server
   */
  const loadConversationHistory = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const params = new URLSearchParams()
      if (conversationId.userId) {
        params.append('userId', conversationId.userId)
      } else if (conversationId.sessionId) {
        params.append('sessionId', conversationId.sessionId)
      }

      const response = await fetch(`/api/conversation?${params}`)
      
      if (!response.ok) {
        throw new Error('Error loading conversation history')
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        messages: data.messages || [],
        conversationId: data.conversation?.id || null,
        isLoading: false
      }))

      return data.messages || []
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      console.error('Error loading conversation history:', error)
      return []
    }
  }, [conversationId.userId, conversationId.sessionId])

  /**
   * Send a message and get the response
   */
  const sendMessage = useCallback(async (
    message: string, 
    options: SendMessageOptions = {}
  ) => {
    if (!message.trim()) {
      const error = 'Message cannot be empty'
      setState(prev => ({ ...prev, error }))
      options.onError?.(error)
      return null
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Add user message immediately to UI
      const userMessage: ConversationMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }))

      // Send to server
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          personProfile: options.personProfile,
          conversationId: options.conversationId,
          ...conversationId
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Create assistant response message
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: JSON.stringify({
          emotionalAnalysis: data.emotionalAnalysis,
          personResponse: data.personResponse,
          mysteriousFragment: data.mysteriousFragment,
          stage: data.stage,
          progression: data.progression
        }),
        timestamp: new Date()
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))

      options.onSuccess?.(data)
      return data

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending message'
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))

      options.onError?.(errorMessage)
      console.error('Error sending message:', error)
      return null
    }
  }, [conversationId])

  /**
   * Clear current conversation
   */
  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      conversationId: null
    })

    // Clear sessionId if exists
    if (typeof window !== 'undefined' && conversationId.sessionId) {
      localStorage.removeItem('unsent_session_id')
    }
  }, [conversationId.sessionId])

  /**
   * Get conversation summary
   */
  const getConversationSummary = useCallback(() => {
    const userMessages = state.messages.filter(msg => msg.role === 'user')
    const assistantMessages = state.messages.filter(msg => msg.role === 'assistant')
    
    return {
      totalMessages: state.messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      lastMessageTime: state.messages.length > 0 ? state.messages[state.messages.length - 1].timestamp : null
    }
  }, [state.messages])

  // Auto-load conversation if requested
  useEffect(() => {
    if (options.autoLoad) {
      loadConversationHistory()
    }
  }, [options.autoLoad, loadConversationHistory])

  return {
    ...state,
    sendMessage,
    clearConversation,
    loadConversationHistory,
    getConversationSummary
  }
}

/**
 * Hook for authenticated user conversations
 */
export function useUserConversation(userId: string, autoLoad = true) {
  return useConversation({ userId, autoLoad })
}

/**
 * Hook for anonymous session conversations
 */
export function useSessionConversation(autoLoad = true) {
  return useConversation({ autoLoad })
} 