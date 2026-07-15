import { useEffect, useState } from 'react';
import { useConversationStore } from '../store/conversationStore';
import { User, Phone, Calendar, Clock, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { getTheme } from '../lib/theme';

export function LiveLeadCard() {
  const { lead, persona, industryKey } = useConversationStore();
  const [highlightedFields, setHighlightedFields] = useState<Record<string, boolean>>({});
  
  // Track previous lead state to animate updates
  useEffect(() => {
    if (lead) {
      const highlights: Record<string, boolean> = {};
      Object.entries(lead).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          highlights[key] = true;
        }
      });
      setHighlightedFields(highlights);
      
      // Remove highlight class after animation duration
      const timer = setTimeout(() => {
        setHighlightedFields({});
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lead]);

  const theme = getTheme(industryKey || persona?.key as any);

  const Field = ({ label, value, icon: Icon, fieldKey }: { label: string, value: string | null | undefined, icon: any, fieldKey: string }) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    const isHighlighted = highlightedFields[fieldKey];

    return (
      <div className={clsx(
        "flex items-center gap-2 px-3 py-1.5 border transition-all",
        theme.innerRadius, theme.animationSpeed,
        isHighlighted ? "bg-green-50 border-green-200 shadow-sm" : "bg-white border-neutral-100",
        hasValue ? "" : "opacity-50 hidden sm:flex"
      )}>
        <Icon size={14} className={hasValue ? "text-neutral-700" : "text-neutral-400"} />
        <span className={clsx(
          "text-xs font-medium",
          hasValue ? "text-neutral-900" : "text-neutral-400"
        )}>
          {label}: {hasValue ? value : "—"}
        </span>
      </div>
    );
  };

  return (
    <div className={clsx("bg-white border shadow-sm overflow-hidden flex flex-col transition-all shrink-0", theme.radius, theme.border)}>
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between" style={{ backgroundColor: persona?.accentColor + '10' }}>
        <h3 className={clsx("flex items-center gap-2 transition-all", theme.headerFont)} style={{ color: persona?.accentColor }}>
          <Sparkles size={18} />
          1. What the AI has captured so far
        </h3>
      </div>
      
      <div className="p-5 flex-1 bg-neutral-50/50">
        <p className="text-xs text-neutral-500 mb-4">
          This is what your AI receptionist would send straight to your booking system or inbox — automatically, no typing required.
        </p>

        <div className="mb-5 p-4 bg-white rounded-lg border border-neutral-100 text-sm font-medium text-neutral-800 shadow-sm leading-relaxed">
          {lead?.summarySentence ? lead.summarySentence : "Waiting for the conversation to begin..."}
        </div>

        <div className="flex flex-wrap gap-2">
          <Field label="Name" value={lead?.name} icon={User} fieldKey="name" />
          <Field label="Phone" value={lead?.phone} icon={Phone} fieldKey="phone" />
          <Field label="Request" value={lead?.requestedService} icon={Sparkles} fieldKey="requestedService" />
          <Field label="Date/Time" value={lead?.preferredDateTime} icon={Calendar} fieldKey="preferredDateTime" />
          <Field label="Size" value={lead?.partySize?.toString()} icon={User} fieldKey="partySize" />
          <Field label="Notes" value={lead?.notes} icon={Clock} fieldKey="notes" />
        </div>
      </div>
    </div>
  );
}
