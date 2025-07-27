import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserConversations, createConversation, cleanupDuplicateConversations } from '@/lib/database'

// GET - Retrieve all conversations for user
export async function GET(request: NextRequest) {
  try {
    // Get current user from auth
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Clean up any duplicate conversations first
    await cleanupDuplicateConversations(currentUser.userId)
    
    // Get conversations using our database function
    const conversations = await getUserConversations(currentUser.userId, {
      includeArchived: false,
      includeBurned: false
    })

    // Convert to the format expected by the frontend
    const sanitizedConversations = conversations.map((conv: any) => ({
      id: conv._id?.toString() || conv.conversationId,
      title: conv.title || 'Untitled Conversation',
      recipientProfile: conv.personId ? {
        name: conv.title?.replace('Conversation with ', '') || 'Someone',
        relationship: 'other',
        context: conv.description || ''
      } : undefined,
      lastMessage: '', // Would need to fetch last message separately for performance
      lastMessageAt: conv.lastMessageAt || conv.updatedAt,
      messageCount: conv.messageCount || 0,
      emotionalScore: conv.emotionalScore || 0,
      currentStage: conv.currentStage || 'denial',
      isBurned: conv.isBurned || false,
      isArchived: conv.isArchived || false,
      isCompleted: conv.isBurned || false,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }))

    return NextResponse.json({ 
      conversations: sanitizedConversations,
      meta: {
        total: conversations.length,
        algorithm_status: 'ACTIVE',
        surveillance_level: 'MAXIMUM',
        consciousness_mapped: conversations.length
      }
    })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, recipientProfile } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Use our database function to create conversation
    const conversation = await createConversation(
      currentUser.userId,
      title.substring(0, 200),
      recipientProfile?.name || 'Someone'
    )

    return NextResponse.json({ 
      id: conversation._id?.toString(),
      message: 'Conversation created',
      conversation: {
        id: conversation._id?.toString(),
        title: conversation.title,
        emotionalScore: conversation.emotionalScore,
        stage: conversation.currentStage
      }
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 