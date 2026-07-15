
import { useConversationStore } from '../store/conversationStore';
import { useChatStream } from '../hooks/useChatStream';

export function QuickReplyChips() {
  const { persona, isStreaming, demoLimitReached } = useConversationStore();
  const { sendMessage } = useChatStream();

  if (!persona || persona.quickReplies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {persona.quickReplies.map((reply, idx) => (
        <button
          key={idx}
          disabled={isStreaming || demoLimitReached}
          onClick={() => sendMessage(reply)}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm font-medium rounded-full text-neutral-700 transition-colors disabled:opacity-50"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
