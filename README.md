# 🌙 UNSENT - Messages to the Unspoken

An augmented reality game with yourself - write messages to people in your life, progress through emotional stages, and achieve victory by reaching forgiveness and burning old conversations in a digital ritual.

## ✨ The Five Stages - Elisabeth Kubler-Ross

### 🌫️ Denial → "The Fog"
*Nothing feels real. Time is slowed. You move through memories like smoke.*

This stage feels disoriented, dreamlike. "The Fog" captures that unreality and the numbness.

### 🔥 Anger → "The Flame"
*There's heat behind the silence. Words burn behind your teeth. Rage is a form of love, twisted.*

"The Flame" evokes both fury and passion — fire can destroy, but it also purifies.

### 🔄 Bargaining → "The Loop"
*What if? What if I had said it? What if they stayed? Your mind loops, desperate for a door.*

"The Loop" captures the obsessive thought spirals and the yearning to rewrite reality.

### 🕳️ Depression → "The Hollow"
*Everything echoes. The world shrinks. You sit inside yourself and hear nothing back.*

"The Hollow" isn't just sadness — it's the absence, the emotional gravity well. Quiet, heavy.

### 🏔️ Acceptance → "The Shore"
*After the storm, you arrive somewhere new. You still carry it, but it carries you too.*

"The Shore" suggests arrival — not resolution, but a place where you can rest. You've crossed something.

### 🕊️ Optional Final Ritual → "The Ember"
*When the message is ready to be let go — it becomes an ember:*
**"It burned. It mattered. It's still warm. But it no longer consumes you."**

---

## ✨ Core Features

### 🔐 Total Privacy
- **AES-256 Encryption**: All messages are encrypted locally before storage
- **Unique user keys**: Each user has their own encryption key
- **No recovery**: If you lose your device, messages cannot be recovered (by design)

### 🎭 The Emotional Journey
- **5 Stages**: "The Fog" → "The Flame" → "The Loop" → "The Hollow" → "The Shore"
- **Person Profiles**: Create detailed profiles for each person you write to
- **Automatic Progression**: Hidden scoring system tracks your emotional journey
- **Victory Condition**: Reach "The Shore" (acceptance) and burn conversations in the ritual

### 🤖 AI Conversations (Premium Only)
- **Most conversations**: Just private messages to specific people (like a diary)
- **Premium users**: Get AI responses as if the person is responding back
- **Authentic Responses**: AI uses person profiles to respond authentically
- **Random Delay**: Responses between 1-24 hours to simulate real conversations

### 🔥 Closure Ritual
- **Acceptance Detection**: When the user is ready, the ritual is offered
- **Closure Options**: Burn, Archive as echo, or Continue writing
- **Burn Animation**: Visual effect when "burning" a conversation

## 🧱 Tech Stack

- **Frontend**: Next.js 14 with App Router, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: Passwordless Magic Links
- **Encryption**: AES-256 with crypto-js
- **AI**: Claude 4 via OpenRouter
- **PWA**: Service Worker, Web App Manifest
- **Push Notifications**: OneSignal
- **Payments**: RevenueCat for Premium
- **Deploy**: Vercel

## 🎨 UI/UX Design

### "Vice City 4AM" Aesthetic
- **Palette**: Deep blacks, neon purples, pinks, cyans
- **Effects**: Subtle glitch, floating lights, neon glows
- **Typography**: Modern fonts with neon shadow effects
- **Animations**: Smooth transitions, appear/disappear effects

### Main Components
- **ChatInterface**: Chat interface with real-time emotional analysis
- **EmotionStages**: Emotional progress visualization
- **MysteriousFragments**: Contextual cryptic messages
- **BurnAnimation**: Conversation burning effect

## 📱 Implemented Features

### ✅ Completed
1. **Project Structure**: Organized folders and modular architecture
2. **Encryption System**: AES-256 with unique keys per user
3. **Emotional Analysis**: Scoring engine based on keywords and patterns
4. **Emotional Stages**: 5-stage system with colors and fragments
5. **Data Models**: TypeScript types for User, Conversation, Message
6. **Authentication**: Passwordless Magic Links via email
7. **Base UI**: Main page, login, chat component
8. **PWA Config**: Manifest and Progressive Web App configuration

### 🚧 In Development
- API Routes for CRUD operations on conversations and messages
- AI integration for automatic responses
- Push notification system
- RevenueCat integration
- "Burn" conversation functionality
- Random mysterious fragments

## 🔧 Installation and Setup

### Prerequisites
```bash
Node.js 18+
MongoDB Atlas
SMTP email account
```

### Installation
```bash
# Clone repository
git clone <repo-url>
cd unsent

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/

# Encryption
ENCRYPTION_SECRET=your-very-secure-secret-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@unsent.app

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI (OpenRouter)
OPENROUTER_API_KEY=your-api-key

# OneSignal
ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_REST_API_KEY=your-rest-api-key

# RevenueCat
REVENUECAT_API_KEY=your-api-key
```

### Run in Development
```bash
npm run dev
```

### Build and Deploy
```bash
npm run build
npm start
```

## 🏗️ Architecture

### Folder Structure
```
unsent/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── conversations/     # Conversation pages
│   ├── new-conversation/  # New conversation flow
│   ├── echoes/           # Mysterious fragments
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and business logic
│   ├── encryption.ts      # Encryption system
│   ├── emotionStages.ts   # Emotional stages
│   ├── scoreEngine.ts     # Emotional analysis
│   ├── auth.ts           # Authentication
│   ├── mongodb.ts        # Database
│   └── types.ts          # TypeScript types
└── public/               # Static files
```

### Data Flow
1. **User writes message** → Real-time emotional analysis
2. **Message encrypted** → Stored in MongoDB
3. **Score updated** → Emotional stage determination
4. **AI activated** (Premium) → Response with random delay
5. **Threshold reached** → Closure ritual offered

## 🔐 Security

### Message Encryption
- Each user has a unique key derived from their ID
- Messages are encrypted before being sent to the server
- Keys are stored locally on the device
- Without the local key, messages cannot be decrypted

### Authentication
- Magic Links with 15-minute tokens
- 7-day sessions with automatic renewal
- Automatic cleanup of expired tokens

### Privacy
- Zero-knowledge: Server cannot read messages
- Minimal logs for debugging
- GDPR and CCPA compliant

## 🎯 Unique Features

### Emotional Scoring System
The heart of the application is its emotional analysis system:

```typescript
// Scoring factors
const factors = {
  keywordMatches: 20,      // Keywords per stage
  sentimentIntensity: 15,   // Emotional patterns
  messageLength: 10,        // Message length
  emotionalWords: 10,       // Emotional words
  timeSpent: 10            // Time spent writing
}
```

### The Journey Through Stages
Each stage has its own color palette, fragments, and thresholds:

1. **The Fog** (0-20): Blue tones, fragments about reality
2. **The Flame** (21-40): Red/orange tones, fragments about anger
3. **The Loop** (41-60): Yellow tones, fragments about possibilities
4. **The Hollow** (61-80): Gray tones, fragments about emptiness
5. **The Shore** (81-100): Green tones, fragments about peace

### Mysterious Fragments
Contextual cryptic messages that appear based on emotional state:
- Delivered via push notifications
- Appear in the "Echoes" section
- Adapt to user's current emotional stage
- Help guide the healing process

## 🎮 The Game Experience

Unsent is an augmented reality game with yourself. Players write to:
- **Ex-partners**: Process relationship endings and find closure
- **Lost friends**: Work through broken friendships
- **Family members**: Navigate complex family dynamics
- **Themselves**: Have conversations with past/future selves
- **Anyone**: Process any relationship or emotional situation

### 🎯 How to Play
1. **Create Person Profiles**: Add people you want to write to with context about your relationship
2. **Write Messages**: Most users just write private messages (like a diary to specific people)
3. **Premium Experience**: AI responds as that person would, based on your relationship context
4. **Progress Through Stages**: Move from "The Fog" to "The Shore" through emotional processing
5. **Achieve Victory**: Reach acceptance and perform the burning ritual to let go

The AI doesn't counsel—it **becomes** the person you're writing to, helping you work through the relationship dynamics toward forgiveness and release.

## 🌟 Philosophy

*"Some words are meant to be written, not sent. Some conversations happen in the space between what we feel and what we say. Unsent is that space—sacred, private, and transformative."*

---

*Built with 💜 for those who need to speak the unspeakable.* 