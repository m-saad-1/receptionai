import { useConversationStore } from '../store/conversationStore';
import { MessageSquare, Target, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { getTheme } from '../lib/theme';

export function AnalyticsStrip() {
  const { conversation, lead, persona, industryKey } = useConversationStore();

  if (!conversation) return null;

  const theme = getTheme(industryKey || persona?.key as any);

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '🙂';
      case 'negative': return '🙁';
      default: return '😐';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section 2 */}
      <div className={clsx("bg-white border shadow-sm overflow-hidden transition-all", theme.radius, theme.border)}>
        <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="font-bold flex items-center gap-2 text-neutral-800 text-sm">
            <Activity size={16} />
            2. Conversation Intelligence
          </h3>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-xs font-medium text-neutral-700">
              <Target size={14} />
              Intent: <span className="capitalize">{lead?.intent || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-xs font-medium text-neutral-700">
              Sentiment: 
              <span className="text-sm">{getSentimentEmoji(lead?.sentiment)}</span>
              <span className="capitalize">{lead?.sentiment || 'Neutral'}</span>
            </div>
          </div>
          <div className="text-sm text-neutral-600 italic">
            "{lead?.summarySentence || "Monitoring conversation..."}"
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className={clsx("bg-white border shadow-sm overflow-hidden border-l-4 border-l-blue-500 transition-all", theme.radius, theme.border)}>
        <div className="px-5 py-3 border-b border-neutral-100 bg-blue-50/30">
          <h3 className="font-bold flex items-center gap-2 text-blue-900 text-sm">
            <MessageSquare size={16} />
            3. What happens next
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-neutral-800">
            {lead?.nextActionSuggestion || "Gathering context to determine next steps..."}
          </p>
        </div>
      </div>
    </div>
  );
}
