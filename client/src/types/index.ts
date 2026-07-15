export type IndustryKey = "restaurant" | "salon" | "dental" | "gym";

export interface PersonaInfo {
  businessName: string;
  accentColor: string;
  quickReplies: string[];
  systemPrompt?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  _id: string;
  industryKey: IndustryKey;
  messages: Message[];
  messageCount: number;
  detectedIntent: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  conversationId: string;
  industryKey: IndustryKey;
  name: string | null;
  phone: string | null;
  email: string | null;
  requestedService: string | null;
  preferredDateTime: string | null;
  partySize: number | null;
  notes: string | null;
  intent: string;
  sentiment: string;
  summarySentence: string | null;
  nextActionSuggestion: string | null;
  createdAt: string;
  updatedAt: string;
}
