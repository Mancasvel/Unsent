import { ObjectId } from 'mongodb'
import { EmotionStage } from './emotionStages'

// Tipos para el Usuario
export interface User {
  _id?: ObjectId
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
  isPremium: boolean
  premiumExpiration?: Date
  magicLinkToken?: string
  magicLinkExpiration?: Date
  totalConversations: number
  emotionalJourney: EmotionStage[]
  encryptionKeyHash?: string // Hash de la clave de cifrado para verificación
}

// Tipos para perfiles de personas
export interface PersonProfile {
  _id?: ObjectId
  userId: string
  name: string
  relationship: string // 'ex-partner', 'friend', 'family', 'colleague', 'stranger', 'self', 'other'
  description?: string
  context: string // Contexto personal sobre esta persona
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
  conversationCount: number
  lastConversationAt?: Date
  tags: string[]
  isActive: boolean
}

// Tipos para la Conversación
export interface Conversation {
  _id?: ObjectId
  userId: string
  personId: string // Referencia al perfil de la persona
  title: string // Título generado automáticamente o por el usuario
  description?: string // Descripción opcional
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
  isActive: boolean
  isArchived: boolean
  isBurned: boolean // Si fue "quemada" en el ritual
  burnedAt?: Date
  messageCount: number
  emotionalScore: number
  currentStage: EmotionStage
  stageHistory: EmotionStageHistory[]
  aiEnabled: boolean // Si tiene respuestas de IA activadas (solo premium)
  aiLastResponse?: Date
  aiNextResponse?: Date // Programada para respuesta con delay
  readyForClosure: boolean
  closureOfferedAt?: Date
  closureAction?: 'burn' | 'archive' | 'continue'
  closureReason?: string
  metadata: ConversationMetadata
}

// Historial de etapas emocionales
export interface EmotionStageHistory {
  stage: EmotionStage
  score: number
  reachedAt: Date
  duration: number // Tiempo en esta etapa en minutos
}

// Metadatos de conversación
export interface ConversationMetadata {
  totalWords: number
  avgWordsPerMessage: number
  totalTimeSpent: number // En minutos
  mostUsedKeywords: string[]
  intensityPeaks: Date[]
  mysteriousFragmentsShown: string[]
}

// Tipos para el Mensaje
export interface Message {
  _id?: ObjectId
  conversationId: string
  userId: string
  content: string // Contenido cifrado
  contentHash: string // Hash del contenido para verificación
  createdAt: Date
  updatedAt?: Date
  isEdited: boolean
  editHistory?: MessageEdit[]
  messageType: 'user' | 'ai' | 'system'
  emotionalAnalysis: MessageEmotionalAnalysis
  aiResponse?: AIResponse
  timeSpent: number // Tiempo invertido escribiendo en segundos
  wordCount: number
  characterCount: number
  isDeleted: boolean
  deletedAt?: Date
  metadata: MessageMetadata
}

// Análisis emocional del mensaje
export interface MessageEmotionalAnalysis {
  score: number
  stage: EmotionStage
  keywords: string[]
  intensity: number
  progressToNext: number
  factors: {
    keywordMatches: number
    sentimentIntensity: number
    messageLength: number
    emotionalWords: number
    timeSpent: number
  }
}

// Respuesta de IA
export interface AIResponse {
  content: string // Contenido cifrado
  generatedAt: Date
  deliveredAt?: Date
  model: string // 'claude-3' | 'gpt-4'
  prompt: string
  stage: EmotionStage
  delay: number // Delay programado en minutos
  wasDelivered: boolean
  emotionalTone: string
  mysteriousFragment?: string
}

// Historial de edición de mensajes
export interface MessageEdit {
  content: string // Contenido cifrado
  editedAt: Date
  reason?: string
}

// Metadatos del mensaje
export interface MessageMetadata {
  deviceInfo?: string
  location?: string
  mood?: string
  tags?: string[]
  attachments?: string[]
  reactions?: string[]
}

// Tipos para el sistema de notificaciones
export interface NotificationSettings {
  userId: string
  pushEnabled: boolean
  mysteriousFragments: boolean
  aiResponses: boolean
  weeklyReports: boolean
  remindersToContinue: boolean
  oneSignalPlayerId?: string
  createdAt: Date
  updatedAt: Date
}

// Tipos para el sistema de fragmentos misteriosos
export interface MysteriousFragment {
  _id?: ObjectId
  userId: string
  content: string
  stage: EmotionStage
  shownAt: Date
  wasRead: boolean
  readAt?: Date
  context: string // Contexto en el que se mostró
  type: 'notification' | 'in_app' | 'daily_fragment'
}

// Tipos para el sistema premium
export interface PremiumFeature {
  name: string
  description: string
  isActive: boolean
  usageLimit?: number
  usageCount?: number
  resetDate?: Date
}

// Tipos para estadísticas del usuario
export interface UserStats {
  userId: string
  totalMessages: number
  totalConversations: number
  avgEmotionalScore: number
  timeSpent: number
  favoriteStage: EmotionStage
  progressionRate: number
  streakDays: number
  lastActiveDate: Date
  createdAt: Date
  updatedAt: Date
}

// Tipos para el sistema de respaldo
export interface BackupData {
  userId: string
  conversations: Conversation[]
  messages: Message[]
  settings: NotificationSettings
  stats: UserStats
  createdAt: Date
  encrypted: boolean
  version: string
}

// Tipos para la API
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Tipos para la autenticación
export interface AuthSession {
  userId: string
  email: string
  name?: string
  isPremium: boolean
  isActive: boolean
  expiresAt: Date
}

// Tipos para el análisis de IA
export interface AIAnalysisRequest {
  messages: string[]
  currentStage: EmotionStage
  emotionalScore: number
  userContext: string
}

export interface AIAnalysisResponse {
  response: string
  suggestedStage: EmotionStage
  emotionalTone: string
  mysteriousFragment?: string
  shouldOfferClosure: boolean
  delay: number
} 