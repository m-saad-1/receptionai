import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Lead, IndustryKey, PersonaInfo } from '../types';

interface ConversationState {
  conversationId: string | null;
  industryKey: IndustryKey | null;
  persona: PersonaInfo | null;
  conversation: Conversation | null;
  lead: Lead | null;
  isStreaming: boolean;
  isExtracting: boolean;
  hasUnseenInsights: boolean;
  demoLimitReached: boolean;
  setConversationSession: (id: string, key: IndustryKey, persona: PersonaInfo) => void;
  setConversationData: (conversation: Conversation, lead: Lead | null) => void;
  setStreaming: (isStreaming: boolean) => void;
  setExtracting: (isExtracting: boolean) => void;
  markInsightsSeen: () => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  updateLastMessage: (content: string) => void;
  setDemoLimitReached: (reached: boolean) => void;
  resetSession: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
  conversationId: null,
  industryKey: null,
  persona: null,
  conversation: null,
  lead: null,
  isStreaming: false,
  isExtracting: false,
  hasUnseenInsights: false,
  demoLimitReached: false,

  setConversationSession: (id, key, persona) => set({ 
    conversationId: id, 
    industryKey: key, 
    persona,
    conversation: { _id: id, industryKey: key, messages: [], messageCount: 0, detectedIntent: '', createdAt: '', updatedAt: '' },
    lead: null,
    demoLimitReached: false,
    isExtracting: false,
    hasUnseenInsights: false,
  }),

  setConversationData: (conversation, lead) => set((state) => {
    const newlyFinishedExtraction = state.isExtracting;
    return { 
      conversation: {
        ...conversation,
        messages: state.conversation && state.conversation.messages.length > conversation.messages.length
          ? state.conversation.messages
          : conversation.messages,
      }, 
      lead,
      isExtracting: false,
      hasUnseenInsights: state.hasUnseenInsights || newlyFinishedExtraction,
      demoLimitReached: state.demoLimitReached || conversation.messageCount >= 20
    };
  }),

  setStreaming: (isStreaming) => set({ isStreaming }),
  setExtracting: (isExtracting) => set({ isExtracting }),
  markInsightsSeen: () => set({ hasUnseenInsights: false }),

  addMessage: (role, content) => set((state) => {
    if (!state.conversation) return state;
    return {
      conversation: {
        ...state.conversation,
        messages: [...state.conversation.messages, { role, content }],
        messageCount: role === 'user' ? state.conversation.messageCount + 1 : state.conversation.messageCount
      }
    };
  }),

  updateLastMessage: (content) => set((state) => {
    if (!state.conversation || state.conversation.messages.length === 0) return state;
    const messages = [...state.conversation.messages];
    const lastIndex = messages.length - 1;
    if (messages[lastIndex].role === 'assistant') {
      messages[lastIndex] = { ...messages[lastIndex], content };
    }
    return { conversation: { ...state.conversation, messages } };
  }),

  setDemoLimitReached: (reached) => set({ demoLimitReached: reached }),

  resetSession: () => set({
    conversationId: null,
    industryKey: null,
    persona: null,
    conversation: null,
    lead: null,
    demoLimitReached: false
  })
}),
{
  name: 'receptionai-storage',
    // Persist all necessary state so it doesn't reset on refresh
    partialize: (state) => ({ 
      conversationId: state.conversationId,
      industryKey: state.industryKey,
      persona: state.persona,
      conversation: state.conversation,
      lead: state.lead,
      demoLimitReached: state.demoLimitReached
    }),
  }
));
