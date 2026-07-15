import type { IndustryKey } from '../types';
import { useConversationStore } from '../store/conversationStore';
import { createConversation } from '../lib/api';

const INDUSTRIES: { key: IndustryKey; name: string; emoji: string; desc: string }[] = [
  { key: 'restaurant', name: 'Restaurant', emoji: '🍽️', desc: 'See how an AI front desk handles reservations and menus' },
  { key: 'salon', name: 'Salon', emoji: '💈', desc: 'Book haircuts, manage staff, and answer service FAQs' },
  { key: 'dental', name: 'Dental Clinic', emoji: '🦷', desc: 'Handle appointments with strict medical guardrails' },
  { key: 'gym', name: 'Fitness Gym', emoji: '🏋️', desc: 'Manage class schedules and sell memberships' },
];

export function IndustrySelector() {
  const { industryKey, conversationId, setConversationSession } = useConversationStore();

  const handleSelect = async (key: IndustryKey) => {
    try {
      const data = await createConversation(key);
      setConversationSession(data.conversationId, key, data.persona);
    } catch (error) {
      console.error('Failed to start conversation', error);
      alert('Failed to start conversation. Is the backend running?');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose a business to test</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INDUSTRIES.map((ind) => {
          // FIX #6: Only highlight if there's an active conversation — not stale persisted key
          const isSelected = !!conversationId && industryKey === ind.key;
          return (
            <button
              key={ind.key}
              onClick={() => handleSelect(ind.key)}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-neutral-900 bg-white shadow-md scale-[1.02]' 
                  : 'border-transparent bg-white hover:bg-neutral-50 hover:border-neutral-200 shadow-sm hover:shadow'
              }`}
            >
              <div className="text-4xl mb-3">{ind.emoji}</div>
              <h3 className="text-lg font-bold mb-2">{ind.name}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{ind.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
