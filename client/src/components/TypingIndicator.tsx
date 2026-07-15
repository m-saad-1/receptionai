

export function TypingIndicator({ accentColor }: { accentColor?: string }) {
  return (
    <div className="flex justify-start mb-4">
      <div 
        className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-neutral-100 shadow-sm flex items-center gap-1"
        style={accentColor ? { borderLeft: `4px solid ${accentColor}` } : {}}
      >
        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
