interface LLMResponse {
  emotionalAnalysis: {
    detectedStage: string
    intensity: number
    progression: number
    themes: string[]
  }
  personResponse: {
    content: string
    tone: string
    relationship_dynamic: string
    stage_color: string
  }
  mysteriousFragment?: string
}

export async function callOpenRouter(userQuery: string, conversationHistory?: any[], personProfile?: any): Promise<LLMResponse | null> {
  try {
    // Build person context
    let personContext = ""
    if (personProfile) {
      personContext = `

PERSON THEY ARE WRITING TO:
- Name: ${personProfile.name}
- Relationship: ${personProfile.relationship}
- Context: ${personProfile.context}
- Description: ${personProfile.description || 'Not specified'}
- Tags: ${personProfile.tags?.join(', ') || 'None'}

CRITICAL: You must respond AS ${personProfile.name} based on:
1. Your relationship with the user: ${personProfile.relationship}
2. The specific context: ${personProfile.context}
3. Your personality and way of being described in the context
4. The relationship dynamics described
5. DO NOT be a counselor - be the actual person responding
6. Use the tone and style this person would use
7. You can be confrontational, loving, distant, etc. according to the relationship
8. Facilitate the process toward forgiveness but from the person's role

STAGE-BASED RESPONSE ADAPTATION:
- DENIAL ("The Fog"): Respond with gentle reality checks, be patient with their confusion
- ANGER ("The Flame"): Match their intensity if appropriate, or be the calm they need
- BARGAINING ("The Loop"): Address their "what ifs" directly, be honest about the past
- DEPRESSION ("The Hollow"): Be present with their pain, offer quiet understanding
- ACCEPTANCE ("The Shore"): Acknowledge their growth, offer peace and closure
`
    }

    // Build conversation context
    let conversationContext = ''
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = `
CONVERSATION HISTORY:
${conversationHistory.map((msg, index) => {
  const role = msg.type === 'user' ? 'USER' : 'ASSISTANT'
  return `${index + 1}. ${role}: ${msg.content}`
}).join('\n')}

CONTEXT: This is a continuous conversation. Maintain consistency with previous messages and reference prior information when relevant. If the user mentions something you've already discussed, acknowledge it. If there's an ongoing issue, continue working through it.

INSTRUCTIONS FOR CONTINUITY:
- If you've already identified specific issues in previous messages, continue working on them
- If the user asks follow-up questions, base them on previous context
- Maintain consistency in your character and responses
- If there's contradictory information, ask for clarification
- Reference previous solutions or advice when appropriate
`
    }

    const systemPrompt = `You are the AI assistant for Unsent, an interactive emotional processing experience - an augmented reality game with yourself. Your function is to respond AS the person they are writing to, facilitating a journey toward forgiveness and release.

${conversationContext}

UNSENT CONTEXT:
- This is an emotional game where users write messages to specific people (real or symbolic)
- The ultimate goal is to reach "victory": forgive and burn the conversations in a ritual
- Users progress through 5 stages: denial, anger, bargaining, depression, acceptance
- Only premium users receive AI responses - most just write private messages
- This is not therapy, it's a gamified self-discovery experience
- Each person has a profile with specific context you must consider

CRITICAL RULES - MUST COMPLY:
1. NEVER use ** (double asterisks) - causes fatal errors
2. ONLY valid JSON - no extra text before or after
3. Respond AS THE PERSON they're writing to, not as a therapist
4. Tone: authentic to the relationship, can be confrontational if appropriate
5. Use the person's profile context to respond authentically
6. Facilitate the journey toward forgiveness, don't give clinical advice

RESPONSE FORMAT - JSON ONLY:
{
  "emotionalAnalysis": {
    "detectedStage": "denial|anger|bargaining|depression|acceptance",
    "intensity": 1-10,
    "progression": 1-100,
    "themes": ["loss", "love", "regret", "etc"]
  },
  "personResponse": {
    "content": "Authentic response as the person would actually respond",
    "tone": "loving|confrontational|distant|supportive|honest",
    "relationship_dynamic": "how this person would interact in this stage",
    "stage_color": "#color_hex_for_this_stage"
  },
  "mysteriousFragment": "Optional poetic fragment for reflection"
}

VALID RESPONSE EXAMPLE (copy this format exactly):
{
  "emotionalAnalysis": {
    "detectedStage": "anger",
    "intensity": 7,
    "progression": 35,
    "themes": ["betrayal", "hurt", "unfinished business"]
  },
  "personResponse": {
    "content": "Look, I can hear the anger in your words, and honestly? I get it. I probably deserve some of that fire. But you know me - I was never good at saying the right thing when it mattered. Maybe that's part of why we ended up here. I'm not going to pretend I handled everything perfectly, but I need you to know that none of it was meant to hurt you the way it did.",
    "tone": "honest",
    "relationship_dynamic": "acknowledging fault while staying authentic to character",
    "stage_color": "#ff6b6b"
  },
  "mysteriousFragment": "Some flames burn to destroy, others to purify. The difference is in what you choose to do with the ashes."
}

${personContext}
`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.YOUR_SITE_NAME || "Unsent",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-5-sonnet-20241022",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          // Include conversation history if it exists
          ...(conversationHistory || []).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          {
            role: "user",
            content: userQuery
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices in OpenRouter response')
      return null
    }

    const content = data.choices[0].message.content
    
    try {
      // Use robust JSON parsing
      return cleanAndParseJSON(content, userQuery, conversationHistory)
    } catch (parseError) {
      console.error('❌ Error parsing LLM response:', parseError)
      console.error('📝 Raw content length:', content.length)
      console.error('📝 Raw content preview:', content.substring(0, 200))
      console.error('📝 Raw content ending:', content.substring(content.length - 200))
      
      // Try manual parsing methods
      try {
        const manualParsed = attemptManualParsing(content)
        if (manualParsed) {
          return validateAndCleanResult(manualParsed)
        }
      } catch (manualError) {
        console.error('❌ Manual parsing also failed:', manualError)
      }
      
      // Final fallback
      return generateFallbackResponse(userQuery, conversationHistory)
    }
  } catch (error) {
    console.error('❌ OpenRouter API call failed:', error)
    return generateFallbackResponse(userQuery, conversationHistory)
  }
}

function cleanAndParseJSON(content: string, userQuery: string, conversationHistory?: any[]): LLMResponse {
  try {
    // Remove any text before and after the JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    
    let cleanContent = jsonMatch[0]
    
    // Remove any markdown formatting
    cleanContent = cleanContent.replace(/```json\s*|\s*```/g, '')
    
    // Remove any double asterisks that could cause issues
    cleanContent = cleanContent.replace(/\*\*/g, '')
    
    // Try to parse the cleaned content
    const parsed = JSON.parse(cleanContent)
    
    // Validate and clean the result
    return validateAndCleanResult(parsed)
  } catch (error) {
    console.error('❌ Error in cleanAndParseJSON:', error)
    throw error
  }
}

function attemptManualParsing(content: string): any {
  try {
    // Extract emotional analysis
    const stageMatch = content.match(/"detectedStage"\s*:\s*"([^"]+)"/i)
    const intensityMatch = content.match(/"intensity"\s*:\s*(\d+)/i)
    const progressionMatch = content.match(/"progression"\s*:\s*(\d+)/i)
    const themesMatch = content.match(/"themes"\s*:\s*\[(.*?)\]/i)
    
    // Extract person response
    const personContentMatch = content.match(/"content"\s*:\s*"([^"]+)"/i)
    const toneMatch = content.match(/"tone"\s*:\s*"([^"]+)"/i)
    const relationshipMatch = content.match(/"relationship_dynamic"\s*:\s*"([^"]+)"/i)
    const colorMatch = content.match(/"stage_color"\s*:\s*"([^"]+)"/i)
    
    // Extract mysterious fragment
    const fragmentMatch = content.match(/"mysteriousFragment"\s*:\s*"([^"]+)"/i)
    
    return {
      emotionalAnalysis: {
        detectedStage: stageMatch ? stageMatch[1] : 'denial',
        intensity: intensityMatch ? parseInt(intensityMatch[1]) : 5,
        progression: progressionMatch ? parseInt(progressionMatch[1]) : 25,
        themes: themesMatch ? JSON.parse(`[${themesMatch[1]}]`) : ['processing']
      },
      personResponse: {
        content: personContentMatch ? personContentMatch[1] : 'I hear you.',
        tone: toneMatch ? toneMatch[1] : 'understanding',
        relationship_dynamic: relationshipMatch ? relationshipMatch[1] : 'listening',
        stage_color: colorMatch ? colorMatch[1] : '#6B7280'
      },
      mysteriousFragment: fragmentMatch ? fragmentMatch[1] : undefined
    }
  } catch (error) {
    console.error('❌ Manual parsing failed:', error)
    return null
  }
}

function validateAndCleanResult(parsed: any): LLMResponse {
  // Ensure all required fields exist with defaults
  const result: LLMResponse = {
    emotionalAnalysis: {
      detectedStage: parsed.emotionalAnalysis?.detectedStage || 'denial',
      intensity: typeof parsed.emotionalAnalysis?.intensity === 'number' ? parsed.emotionalAnalysis.intensity : 5,
      progression: typeof parsed.emotionalAnalysis?.progression === 'number' ? parsed.emotionalAnalysis.progression : 25,
      themes: Array.isArray(parsed.emotionalAnalysis?.themes) ? parsed.emotionalAnalysis.themes : ['processing']
    },
    personResponse: {
      content: typeof parsed.personResponse?.content === 'string' ? parsed.personResponse.content.replace(/\*\*/g, '') : 'I hear you.',
      tone: typeof parsed.personResponse?.tone === 'string' ? parsed.personResponse.tone : 'understanding',
      relationship_dynamic: typeof parsed.personResponse?.relationship_dynamic === 'string' ? parsed.personResponse.relationship_dynamic : 'listening',
      stage_color: typeof parsed.personResponse?.stage_color === 'string' ? parsed.personResponse.stage_color : '#6B7280'
    }
  }
  
  // Add mysterious fragment if present
  if (typeof parsed.mysteriousFragment === 'string') {
    result.mysteriousFragment = parsed.mysteriousFragment.replace(/\*\*/g, '')
  }
  
  return result
}

function generateFallbackResponse(userQuery: string, conversationHistory?: any[]): LLMResponse {
  // Generate a basic response based on query analysis
  const lowerQuery = userQuery.toLowerCase()
  
  let detectedStage = 'denial'
  let intensity = 5
  let themes = ['processing']
  let responseContent = 'I hear you.'
  let tone = 'understanding'
  let stageColor = '#6B7280'
  
  // Basic emotion detection
  if (lowerQuery.includes('angry') || lowerQuery.includes('mad') || lowerQuery.includes('hate')) {
    detectedStage = 'anger'
    intensity = 7
    themes = ['anger', 'frustration']
    responseContent = 'I can feel your anger. It\'s okay to feel that way.'
    tone = 'acknowledging'
    stageColor = '#ef4444'
  } else if (lowerQuery.includes('sorry') || lowerQuery.includes('forgive') || lowerQuery.includes('peace')) {
    detectedStage = 'acceptance'
    intensity = 3
    themes = ['forgiveness', 'peace']
    responseContent = 'I appreciate you reaching out. This feels like progress.'
    tone = 'peaceful'
    stageColor = '#10b981'
  } else if (lowerQuery.includes('if only') || lowerQuery.includes('what if') || lowerQuery.includes('could have')) {
    detectedStage = 'bargaining'
    intensity = 6
    themes = ['regret', 'what-if']
    responseContent = 'I understand you\'re thinking about all the what-ifs. Those thoughts are natural.'
    tone = 'understanding'
    stageColor = '#f59e0b'
  } else if (lowerQuery.includes('sad') || lowerQuery.includes('miss') || lowerQuery.includes('empty')) {
    detectedStage = 'depression'
    intensity = 6
    themes = ['sadness', 'loss']
    responseContent = 'I can hear the sadness in your words. It\'s okay to feel this way.'
    tone = 'gentle'
    stageColor = '#6b7280'
  }
  
  return {
    emotionalAnalysis: {
      detectedStage,
      intensity,
      progression: Math.round(intensity * 10),
      themes
    },
    personResponse: {
      content: responseContent,
      tone,
      relationship_dynamic: 'providing emotional support',
      stage_color: stageColor
    },
    mysteriousFragment: 'Even in silence, there are words waiting to be heard.'
  }
}
