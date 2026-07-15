import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  accentColor?: string;
}

export function ChatBubble({ role, content, accentColor }: ChatBubbleProps) {
  const isUser = role === 'user';
  
  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[85%] px-4 py-3 text-[15px] leading-relaxed shadow-sm",
          isUser 
            ? "bg-neutral-900 text-white rounded-2xl rounded-tr-sm" 
            : "bg-white text-neutral-800 rounded-2xl rounded-tl-sm border border-neutral-100 prose prose-sm max-w-none"
        )}
        style={!isUser && accentColor ? { borderLeft: `4px solid ${accentColor}` } : {}}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{content || <span className="opacity-50 italic">...</span>}</span>
        ) : (
          content ? (
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 last:mb-0" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 last:mb-0" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center space-x-1 h-5 px-1 py-1">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
