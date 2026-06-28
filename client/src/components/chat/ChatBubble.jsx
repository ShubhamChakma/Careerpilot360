import React from 'react';

export default function ChatBubble({ message, isDark }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-[#C0C0C0]/15 text-[#E8E8E8] border border-[#C0C0C0]/20'
          : isDark
          ? 'bg-[#1A1A1A] text-[#A8A8A8] border border-[#2A2A2A]'
          : 'bg-white text-[#333] border border-[#D0D0D0]'
      }`}>
        {message.content}
      </div>
    </div>
  );
}