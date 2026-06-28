import React, { useState } from 'react';

export default function ChatInput({ onSend, loading, isDark }) {
  const [val, setVal] = useState('');

  const handle = () => {
    if (!val.trim() || loading) return;
    onSend(val.trim());
    setVal('');
  };

  return (
    <div className={`flex items-end gap-3 border rounded-xl p-3 ${isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'}`}>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handle(); } }}
        placeholder="Ask anything... (Enter to send)"
        rows={1}
        className={`flex-1 resize-none text-sm bg-transparent focus:outline-none ${isDark ? 'text-[#E8E8E8] placeholder-[#3A3A3A]' : 'text-[#1A1A1A] placeholder-[#C0C0C0]'}`}
      />
      <button
        onClick={handle}
        disabled={!val.trim() || loading}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${val.trim() && !loading ? 'bg-[#C0C0C0] text-[#0D0D0D] hover:bg-[#E8E8E8]' : 'bg-[#2A2A2A] text-[#3A3A3A]'}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}