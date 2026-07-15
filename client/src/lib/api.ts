import { z } from 'zod';
import type { IndustryKey, Conversation, Lead } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PersonaInfoSchema = z.object({
  businessName: z.string(),
  accentColor: z.string(),
  quickReplies: z.array(z.string()),
  systemPrompt: z.string().optional(),
});

const CreateConversationResponseSchema = z.object({
  conversationId: z.string(),
  persona: PersonaInfoSchema,
});

export async function createConversation(industryKey: IndustryKey) {
  const response = await fetch(`${API_BASE_URL}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ industryKey })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create conversation');
  }

  const data = await response.json();
  return CreateConversationResponseSchema.parse(data);
}

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ConversationSchema = z.object({
  _id: z.string(),
  industryKey: z.string(),
  messages: z.array(MessageSchema),
  messageCount: z.number(),
  detectedIntent: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const LeadSchema = z.object({
  _id: z.string(),
  conversationId: z.string(),
  industryKey: z.string(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  requestedService: z.string().nullable().optional(),
  preferredDateTime: z.string().nullable().optional(),
  partySize: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  intent: z.string().nullable().optional(),
  sentiment: z.string().nullable().optional(),
  summarySentence: z.string().nullable().optional(),
  nextActionSuggestion: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).nullable();

const FetchConversationResponseSchema = z.object({
  conversation: ConversationSchema,
  lead: LeadSchema,
});

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchConversation(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/conversations/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || 'Failed to fetch conversation');
  }

  const data = await response.json();
  return FetchConversationResponseSchema.parse(data) as unknown as { conversation: Conversation; lead: Lead | null };
}
