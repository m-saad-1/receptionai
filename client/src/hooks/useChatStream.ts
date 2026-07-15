import { useState, useCallback, useRef } from 'react';
import { useConversationStore } from '../store/conversationStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function useChatStream() {
  const { conversationId, addMessage, updateLastMessage, setStreaming, setExtracting, setDemoLimitReached } = useConversationStore();
  const [error, setError] = useState<string | null>(null);
  // FIX #2: Track when streaming ended so polling waits before overwriting
  const streamEndedAt = useRef<number>(0);

  const sendMessage = useCallback(async (message: string) => {
    if (!conversationId) return;

    setError(null);
    addMessage('user', message);
    addMessage('assistant', ''); // Placeholder for streaming
    setStreaming(true);
    streamEndedAt.current = 0;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message }),
      });

      if (response.status === 429) {
        setDemoLimitReached(true);
        updateLastMessage("Demo limit reached — Contact Saad to see the full version");
        setStreaming(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder('utf-8');
      let done = false;
      let fullContent = '';
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // FIX #1: Split on actual newline '\n', NOT literal two-char '\\n'
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep last incomplete line in buffer

          let eventName = '';
          let chunkUpdated = false;

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('event: ')) {
              eventName = trimmed.slice(7).trim();
            } else if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6).trim();
              try {
                const data = JSON.parse(dataStr);

                if (eventName === 'token') {
                  fullContent += data.text;
                  chunkUpdated = true;
                } else if (eventName === 'error') {
                  setError(data.message);
                  updateLastMessage('Something went wrong — please try again');
                } else if (eventName === 'done') {
                  if (data.fullText) {
                    fullContent = data.fullText;
                    chunkUpdated = true;
                  }
                }
              } catch {
                // Ignore malformed SSE lines silently
              }
            }
          }

          if (chunkUpdated) {
            updateLastMessage(fullContent);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong — please try again');
      updateLastMessage('Something went wrong — please try again');
    } finally {
      setStreaming(false);
      setExtracting(true);
      // Record when stream ended — polling uses this to wait 3s before syncing
      streamEndedAt.current = Date.now();
    }
  }, [conversationId, addMessage, updateLastMessage, setStreaming, setExtracting, setDemoLimitReached]);

  return { sendMessage, error, streamEndedAt };
}
