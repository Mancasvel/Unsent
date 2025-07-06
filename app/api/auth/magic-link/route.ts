import { NextRequest, NextResponse } from 'next/server'
import { withUnsentDB } from '@/lib/mongodb'
import { generateMagicLinkToken, sendMagicLinkEmail } from '@/lib/auth'
import { User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validación básica
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const result = await withUnsentDB(async (db) => {
      const usersCollection = db.collection<User>('users')
      
      // Buscar o crear usuario
      let user = await usersCollection.findOne({ email: email.toLowerCase() })
      
      if (!user) {
        // Crear nuevo usuario
        const newUser: User = {
          email: email.toLowerCase(),
          name: email.split('@')[0], // Nombre temporal basado en email
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          isPremium: false,
          totalConversations: 0,
          emotionalJourney: []
        }
        
        const insertResult = await usersCollection.insertOne(newUser)
        user = { ...newUser, _id: insertResult.insertedId }
      }

      // Generar token de enlace mágico
      const { token, expiresAt } = generateMagicLinkToken()
      
      // Actualizar usuario con token
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            magicLinkToken: token,
            magicLinkExpiration: expiresAt,
            updatedAt: new Date()
          }
        }
      )

      return { user, token }
    })

    // Enviar email con enlace mágico
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${result.token}`
    
    await sendMagicLinkEmail(email, magicLinkUrl)

    return NextResponse.json({
      message: 'Enlace mágico enviado correctamente',
      success: true
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error en magic link:', error)
    
    if (error.message.includes('Email')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 