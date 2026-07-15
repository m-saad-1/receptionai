# ReceptionAI — Multi-Vertical AI Receptionist Demo

A portfolio-grade, production-quality full-stack application demonstrating an AI receptionist built for four different business verticals: Restaurant, Salon, Dental Clinic, and Fitness Gym.

Built by Muhammad Saad.

## Architecture
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB with Mongoose.
- **LLM Engine**: Google Gemini (via `@google/generative-ai`), streaming token-by-token.
- **Realtime Updates**: Server-Sent Events (SSE) and client-side polling.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a Mongo Atlas URI)
- Google Gemini API Key

### 2. Backend Setup
\`\`\`bash
cd server
npm install
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and MONGODB_URI
npm run seed  # Seed the initial persona configs to the DB
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd client
npm install
cp .env.example .env
npm run dev
\`\`\`

## Adding a New Industry (e.g., Hotel)
The system is built dynamically using a Persona Registry.

1. Create \`server/src/personas/hotel.ts\` with the system prompt template.
2. Open \`server/src/personas/index.ts\` and:
   - Add \`"hotel"\` to \`IndustryKey\`.
   - Add the hotel object to the \`personas\` registry.
3. Open \`server/src/seed.ts\` and add the hotel to \`personasData\`. Run \`npm run seed\` again.
4. Open \`client/src/components/IndustrySelector.tsx\` and add the hotel to the \`INDUSTRIES\` array.
5. That's it!

## Features
- **Strict Guardrails**: Dental persona actively refuses to give medical advice. Prompt injections are deflected in-character.
- **Structured Data Extraction**: The system runs a secondary LLM call (fire-and-forget) to extract booking details into a JSON schema on the backend.
- **Live Demo UI**: The \`LiveLeadCard\` actively updates to show visitors how data is structured behind the scenes.
- **Admin Panel**: Visit \`/admin\` (password is \`secret\` by default) to view all captured leads and conversion metrics.
