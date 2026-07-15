import { useState } from 'react';
import { useConversationStore } from '../store/conversationStore';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';

export function SystemPromptViewer() {
  const { persona } = useConversationStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors bg-neutral-900 border border-neutral-800 rounded-lg"
      >
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
          <Terminal size={14} />
          For developers: view this assistant's configuration
        </div>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      
      {expanded && (
        <div className="p-4 border-t border-neutral-800 bg-[#0d0d0d] font-mono text-xs text-neutral-400 overflow-x-auto max-h-[300px] overflow-y-auto">
          {persona?.systemPrompt ? (
            <pre className="whitespace-pre-wrap leading-relaxed">
              {persona.systemPrompt}
            </pre>
          ) : (
            <p>Loading prompt...</p>
          )}
        </div>
      )}
    </div>
  );
}
