import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { IndustrySelector } from '../components/IndustrySelector';
import { ChatPane } from '../components/ChatPane';

import { LiveLeadCard } from '../components/LiveLeadCard';
import { AnalyticsStrip } from '../components/AnalyticsStrip';
import { useConversationStore } from '../store/conversationStore';
import { useConversationPolling } from '../hooks/useConversation';
import { useChatStream } from '../hooks/useChatStream';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { getTheme } from '../lib/theme';

export function DemoPage() {
  const { conversationId, industryKey, isExtracting, hasUnseenInsights, markInsightsSeen } = useConversationStore();
  const [showMobilePane, setShowMobilePane] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);

  // FIX #2: Pass streamEndedAt ref down to polling so it can enforce cooldown
  const { streamEndedAt } = useChatStream();
  useConversationPolling(streamEndedAt);

  const theme = getTheme(industryKey);

  return (
    <div className={clsx("flex flex-col min-h-screen font-sans transition-colors duration-500", theme.bg)}>
      <Header />
      
      {showBanner && conversationId && industryKey && (
        <div className="w-full bg-blue-50 border-b border-blue-100 p-3 relative flex items-center justify-center">
          <div className="text-xs sm:text-sm text-blue-800 text-center pr-8">
            👋 You're chatting with a live AI demo built for {industryKey} businesses. Try booking something or asking a question — everything below is real AI, simulated business.
          </div>
          <button 
            onClick={() => setShowBanner(false)} 
            className="absolute right-4 text-blue-500 hover:text-blue-700 font-bold text-lg"
          >
            &times;
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
        {!conversationId ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center py-12">
            <IndustrySelector />
          </div>
        ) : (
          <div className="w-full flex flex-col lg:flex-row gap-6 items-start relative">
            
            {/* Chat Pane */}
            <div className={clsx("w-full lg:w-[58%] h-[70vh] lg:h-[65vh] min-h-[400px] sm:min-h-[500px] max-h-[800px] shadow-sm border overflow-hidden flex flex-col z-10 transition-all duration-500", theme.panelBg, theme.radius, theme.border)}>
              <ChatPane />
            </div>

            {/* Business View Pane - Desktop */}
            <div className="hidden lg:flex w-[42%] flex-col gap-4 pr-2 pb-4">
              <h2 className={clsx("text-xl flex items-center gap-2 mb-2 transition-all", theme.headerFont)}>🧠 Assistant Insights</h2>
              <LiveLeadCard />
              <div className="shrink-0">
                <AnalyticsStrip />
              </div>

            </div>

            {/* Business View Pane - Mobile Accordion */}
            <div className={clsx(
              "lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 text-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 z-50 flex flex-col",
              showMobilePane ? "translate-y-0 h-[80vh]" : "translate-y-[calc(100%-60px)] h-[80vh]"
            )}>
              <button 
                onClick={() => {
                  setShowMobilePane(!showMobilePane);
                  if (!showMobilePane) {
                    markInsightsSeen();
                  }
                }}
                className="w-full h-[60px] flex items-center justify-center gap-2 font-bold text-lg border-b border-neutral-800"
              >
                {showMobilePane ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                🧠 Assistant Insights
                {(isExtracting || hasUnseenInsights) && !showMobilePane && (
                  <span className="relative flex h-2.5 w-2.5 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <div className="text-black">
                  <LiveLeadCard />
                </div>
                <div className="bg-neutral-800 p-1 rounded-xl">
                  <AnalyticsStrip />
                </div>

              </div>
            </div>

            {/* Overlay for mobile pane */}
            {showMobilePane && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/20 z-40"
                onClick={() => setShowMobilePane(false)}
              />
            )}
            
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
