import React from 'react';

export default function TypingIndicator({ isDark }) {
  return (
    <div className="flex justify-start">
      <div className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl border ${isDark ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'}`}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A] animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}