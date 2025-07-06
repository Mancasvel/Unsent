export enum EmotionStage {
  DENIAL = 'denial',
  ANGER = 'anger',
  BARGAINING = 'bargaining',
  DEPRESSION = 'depression',
  ACCEPTANCE = 'acceptance'
}

export interface EmotionStageData {
  name: string
  description: string
  keywords: string[]
  minScore: number
  maxScore: number
  color: string
  glowColor: string
  aiPrompt: string
  mysteriousFragments: string[]
}

export const EMOTION_STAGES: Record<EmotionStage, EmotionStageData> = {
  [EmotionStage.DENIAL]: {
    name: 'Negación',
    description: 'Negándose a aceptar la realidad',
    keywords: ['no', 'nunca', 'imposible', 'mentira', 'no es cierto', 'no puede ser', 'equivocado'],
    minScore: 0,
    maxScore: 20,
    color: '#6366f1',
    glowColor: '#8b5cf6',
    aiPrompt: 'Responde con comprensión y gentileza, validando los sentimientos sin confrontar la negación directamente.',
    mysteriousFragments: [
      'A veces la verdad duele más que la mentira...',
      'Los ojos cerrados no hacen desaparecer la realidad',
      'Hay cosas que el corazón tarda en aceptar'
    ]
  },
  [EmotionStage.ANGER]: {
    name: 'Ira',
    description: 'Sintiendo rabia y frustración',
    keywords: ['odio', 'furioso', 'enojado', 'injusto', 'culpa', 'idiota', 'estúpido', 'maldito'],
    minScore: 21,
    maxScore: 40,
    color: '#ef4444',
    glowColor: '#f97316',
    aiPrompt: 'Responde con calma y comprensión, ayudando a canalizar la ira de manera constructiva.',
    mysteriousFragments: [
      'El fuego que quema por dentro busca salida...',
      'La rabia es dolor vestido de fuerza',
      'Incluso las tormentas encuentran su calma'
    ]
  },
  [EmotionStage.BARGAINING]: {
    name: 'Negociación',
    description: 'Buscando alternativas y soluciones',
    keywords: ['si tan solo', 'ojalá', 'quizás', 'podría', 'debería', 'habría', 'tal vez', 'por favor'],
    minScore: 41,
    maxScore: 60,
    color: '#eab308',
    glowColor: '#f59e0b',
    aiPrompt: 'Responde con esperanza cautelosa, ayudando a explorar posibilidades mientras mantienes los pies en la tierra.',
    mysteriousFragments: [
      'Algunos caminos se cierran para que otros se abran...',
      'El tiempo no se negocia, pero los corazones sí sanan',
      'Las respuestas no siempre vienen cuando las pedimos'
    ]
  },
  [EmotionStage.DEPRESSION]: {
    name: 'Depresión',
    description: 'Sintiendo tristeza profunda y vacío',
    keywords: ['triste', 'vacío', 'solo', 'perdido', 'dolor', 'llorar', 'oscuridad', 'nada'],
    minScore: 61,
    maxScore: 80,
    color: '#6b7280',
    glowColor: '#9ca3af',
    aiPrompt: 'Responde con calidez y compasión, ofreciendo consuelo y recordando que la tristeza es temporal.',
    mysteriousFragments: [
      'En la oscuridad más profunda, la luz es más preciada...',
      'Los corazones rotos aprenden a latir de nuevo',
      'El dolor que no se habla se vuelve susurro en el alma'
    ]
  },
  [EmotionStage.ACCEPTANCE]: {
    name: 'Aceptación',
    description: 'Encontrando paz y comprensión',
    keywords: ['acepto', 'paz', 'entiendo', 'está bien', 'gracias', 'perdón', 'libre', 'soltar'],
    minScore: 81,
    maxScore: 100,
    color: '#10b981',
    glowColor: '#059669',
    aiPrompt: 'Responde con sabiduría y serenidad, celebrando el crecimiento y la fortaleza encontrada.',
    mysteriousFragments: [
      'La paz llega cuando dejamos de luchar contra lo inevitable...',
      'Soltar no es perder, es elegir ser libre',
      'El alma que acepta encuentra su hogar en cualquier lugar'
    ]
  }
}

/**
 * Determina la etapa emocional basada en el puntaje
 */
export function getEmotionStage(score: number): EmotionStage {
  for (const stage of Object.values(EmotionStage)) {
    const stageData = EMOTION_STAGES[stage]
    if (score >= stageData.minScore && score <= stageData.maxScore) {
      return stage
    }
  }
  return EmotionStage.DENIAL // Default
}

/**
 * Obtiene un fragmento misterioso aleatorio para la etapa actual
 */
export function getRandomFragment(stage: EmotionStage): string {
  const fragments = EMOTION_STAGES[stage].mysteriousFragments
  return fragments[Math.floor(Math.random() * fragments.length)]
}

/**
 * Verifica si el usuario está listo para el ritual de cierre
 */
export function isReadyForClosure(stage: EmotionStage, score: number): boolean {
  return stage === EmotionStage.ACCEPTANCE && score >= 90
}

/**
 * Obtiene el prompt de IA para la etapa actual
 */
export function getAIPrompt(stage: EmotionStage): string {
  return EMOTION_STAGES[stage].aiPrompt
}

/**
 * Obtiene los colores de tema para la etapa actual
 */
export function getStageColors(stage: EmotionStage): { color: string; glowColor: string } {
  return {
    color: EMOTION_STAGES[stage].color,
    glowColor: EMOTION_STAGES[stage].glowColor
  }
} 