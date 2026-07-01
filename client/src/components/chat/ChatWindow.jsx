import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, loading, isDark }) {
  const containerRef = useRef(null);

  // Scroll the CONTAINER (not the whole page) whenever messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!messages.length) return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center h-full gap-3 ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}
    >
      <span className="text-4xl">🤖</span>
      <p className="text-sm">Ask me anything about coding, interviews, or system design.</p>
    </div>
  );

  return (
    <div ref={containerRef} className="overflow-y-auto h-full space-y-3 pr-2">
      {messages.map((m, i) => <ChatBubble key={i} message={m} isDark={isDark} />)}
      {loading && <TypingIndicator isDark={isDark} />}
    </div>
  );
}