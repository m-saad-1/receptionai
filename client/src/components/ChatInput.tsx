import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { useChatStream } from '../hooks/useChatStream';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { isStreaming, demoLimitReached } = useConversationStore();
  const { sendMessage } = useChatStream();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || demoLimitReached) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="p-4 bg-white border-t border-neutral-100">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={demoLimitReached ? "Demo limit reached" : "Type a message..."}
          disabled={isStreaming || demoLimitReached}
          className="w-full pl-4 pr-12 py-3 bg-neutral-100 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50 transition-shadow"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming || demoLimitReached}
          className="absolute right-2 p-2 bg-neutral-900 text-white rounded-full disabled:opacity-50 disabled:bg-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
}
