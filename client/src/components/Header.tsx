import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <span className="font-semibold text-lg tracking-tight">ReceptionAI</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold tracking-widest uppercase">Demo</span>
        </div>
      </div>
    </header>
  );
}
