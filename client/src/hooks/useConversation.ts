import { useEffect, useRef } from 'react';
import { useConversationStore } from '../store/conversationStore';
import { fetchConversation, ApiError } from '../lib/api';

export function useConversationPolling(streamEndedAt?: React.MutableRefObject<number>) {
  const { conversationId, setConversationData } = useConversationStore();

  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(async () => {
      const state = useConversationStore.getState();

      // Don't poll while streaming
      if (state.isStreaming) return;

      // Don't poll within 3s of stream ending — server needs time to persist the reply
      if (streamEndedAt?.current && Date.now() - streamEndedAt.current < 3000) return;

      try {
        const data = await fetchConversation(conversationId);
        if (!useConversationStore.getState().isStreaming) {
          setConversationData(data.conversation, data.lead);
        }
      } catch (error: any) {
        // If conversation is gone (server restarted — in-memory DB wiped), reset to selector
        if (error instanceof ApiError && error.status === 404) {
          console.warn('Session expired — resetting to industry selector');
          useConversationStore.getState().resetSession();
        }
        // All other errors: ignore silently (network blip etc.)
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, setConversationData, streamEndedAt]);
}
