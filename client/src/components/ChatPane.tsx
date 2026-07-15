import React, { useEffect, useRef } from 'react';
import { useConversationStore } from '../store/conversationStore';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { QuickReplyChips } from './QuickReplyChips';
import { RefreshCcw } from 'lucide-react';
import { getTheme } from '../lib/theme';

// FIX #5: Extract Header as a stable top-level component so it never remounts on re-render
interface ChatHeaderProps {
  onBack: () => void;
  onRestart: () => void;
}

function ChatHeader({ onBack, onRestart }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 text-sm font-medium"
          title="Back to Industry Selection"
        >
          <span className="text-lg leading-none">&larr;</span> Back
        </button>
        <h3 className="font-semibold flex items-center gap-2 border-l pl-4 border-neutral-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          AI Assistant
        </h3>
      </div>
      <button
        onClick={onRestart}
        className="text-neutral-500 hover:text-neutral-900 transition-colors"
        title="Restart Chat"
      >
        <RefreshCcw size={18} />
      </button>
    </div>
  );
}

export function ChatPane() {
  const { conversation, persona, isStreaming, resetSession } = useConversationStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation?.messages, isStreaming, autoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setAutoScroll(isBottom);
    }
  };

  const theme = getTheme(conversation?.industryKey || persona?.key || null);

  if (!conversation || !persona) {
    return (
      <div className="flex flex-col h-full bg-neutral-50">
        <ChatHeader onBack={resetSession} onRestart={resetSession} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-400">Session expired or not found.</p>
          <button
            onClick={resetSession}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  const messages = conversation.messages.length === 0
    ? [{ role: 'assistant' as const, content: `Hi! Welcome to ${persona.businessName} — I can help you book an appointment or answer questions. What can I do for you today?` }]
    : conversation.messages;

  return (
    <div className={`flex flex-col h-full bg-neutral-50/50 ${theme.bodyFont}`}>
      <ChatHeader onBack={resetSession} onRestart={resetSession} />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 flex flex-col"
      >
        {messages.map((msg, idx) => {
          const isErrorMsg = msg.content === 'Something went wrong — please try again';
          return (
            <div key={idx} className="flex flex-col">
              <ChatBubble
                role={msg.role}
                content={msg.content}
                accentColor={persona.accentColor}
              />
              {isErrorMsg && idx === messages.length - 1 && (
                <div className="flex justify-start mb-4">
                  <p className="text-xs font-medium text-red-500 px-3">
                    Something went wrong. Please type your message again.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {conversation.messages.length === 0 && (
          <QuickReplyChips />
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput />
    </div>
  );
}
