import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { User, AuthSession } from './types'

const JWT_SECRET = process.env.JWT_SECRET || "pawsitive-secret-key-2024"

interface JWTPayload {
  userId: string
  email: string
  name: string
  iat: number
  exp: number
}

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('Error verificando token:', error)
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Intentar obtener token de cookie
  const token = request.cookies.get('auth-token')?.value
  
  if (token) {
    return token
  }

  // Intentar obtener token de header Authorization
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export function getCurrentUser(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  return verifyToken(token)
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = getCurrentUser(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Genera un token de enlace mágico
 */
export function generateMagicLinkToken(): { token: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
  
  return { token, expiresAt }
}

/**
 * Envía email con enlace mágico
 */
export async function sendMagicLinkEmail(email: string, magicLinkUrl: string): Promise<void> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@unsent.app',
      to: email,
      subject: 'Tu enlace mágico para Unsent',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; font-size: 2.5em; margin: 0; text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);">UNSENT</h1>
            <p style="color: #a855f7; font-size: 1.2em; margin: 10px 0 0 0;">Mensajes que nunca se enviaron</p>
          </div>
          
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; padding: 20px; margin: 20px 0;">
            <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hola,<br><br>
              Has solicitado acceso a tu espacio personal en Unsent. Haz clic en el enlace de abajo para continuar:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                Acceder a Unsent
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin: 20px 0 0 0;">
              Este enlace expirará en 15 minutos por seguridad.
            </p>
          </div>
          
          <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
              🔒 Tus mensajes están cifrados y son completamente privados<br>
              Si no solicitaste este enlace, puedes ignorar este email
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error enviando email:', error)
    throw new Error('Error enviando email de verificación')
  }
}

/**
 * Verifica si un token de enlace mágico es válido
 */
export function verifyMagicLinkToken(token: string, storedToken: string, expiresAt: Date): boolean {
  if (!token || !storedToken) return false
  if (new Date() > expiresAt) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken))
}

/**
 * Genera un token de sesión
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Crea una sesión de usuario
 */
export function createUserSession(user: User): AuthSession {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
  
  return {
    userId: user._id!.toString(),
    email: user.email,
    name: user.name,
    isPremium: user.isPremium,
    isActive: user.isActive,
    expiresAt
  }
}

/**
 * Valida una sesión de usuario
 */
export function validateSession(session: AuthSession): boolean {
  if (!session) return false
  if (new Date() > session.expiresAt) return false
  if (!session.isActive) return false
  
  return true
}

/**
 * Genera un hash seguro para almacenar tokens
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Verifica si un hash coincide con un token
 */
export function verifyTokenHash(token: string, hash: string): boolean {
  const tokenHash = hashToken(token)
  return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(hash))
}

/**
 * Genera un identificador único para dispositivos
 */
export function generateDeviceId(): string {
  return crypto.randomUUID()
}

/**
 * Calcula el tiempo restante para expiración
 */
export function getTimeUntilExpiration(expiresAt: Date): number {
  return Math.max(0, expiresAt.getTime() - Date.now())
}

/**
 * Formatea tiempo restante en texto legible
 */
export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

/**
 * Limpia tokens expirados de la base de datos
 */
export async function cleanupExpiredTokens(db: any): Promise<void> {
  try {
    const usersCollection = db.collection('users')
    const now = new Date()
    
    await usersCollection.updateMany(
      { magicLinkExpiration: { $lt: now } },
      { 
        $unset: { 
          magicLinkToken: "",
          magicLinkExpiration: "" 
        }
      }
    )
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
  }
} 