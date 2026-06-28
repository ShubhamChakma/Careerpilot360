import React from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, loading, isDark }) {
  if (!messages.length) return (
    <div className={`flex flex-col items-center justify-center h-full gap-3 ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>
      <span className="text-4xl">🤖</span>
      <p className="text-sm">Ask me anything about coding, interviews, or system design.</p>
    </div>
  );

  return (
    <div className="overflow-y-auto h-full space-y-3 pr-2">
      {messages.map((m, i) => <ChatBubble key={i} message={m} isDark={isDark} />)}
      {loading && <TypingIndicator isDark={isDark} />}
    </div>
  );
}