import React, { useState } from 'react';

export default function TestCasePanel({ testCases = [], isDark }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!testCases || testCases.length === 0) return null;

  return (
    <div className={`mt-6 border-t pt-4 ${isDark ? 'border-[#1E1E1E]' : 'border-[#D0D0D0]'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Test Cases</p>
      
      <div className="flex gap-2 mb-3">
        {testCases.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              activeTab === i
                ? 'border-[#C0C0C0] text-[#C0C0C0] bg-[#C0C0C0]/10 font-medium'
                : isDark
                ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-[#3A3A3A]'
                : 'border-[#D0D0D0] text-[#999] hover:border-[#A0A0A0]'
            }`}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      <div className={`rounded-lg p-4 border ${isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F5F5F5] border-[#D0D0D0]'}`}>
        <div className="space-y-3 font-mono text-xs">
          <div>
            <span className={`block text-[10px] uppercase font-semibold tracking-wider mb-1 ${isDark ? 'text-[#3A3A3A]' : 'text-[#B0B0B0]'}`}>Input</span>
            <pre className={`p-2 rounded bg-opacity-30 whitespace-pre-wrap ${isDark ? 'bg-black text-[#C0C0C0]' : 'bg-white text-[#333]'}`}>
              {testCases[activeTab]?.input}
            </pre>
          </div>
          <div>
            <span className={`block text-[10px] uppercase font-semibold tracking-wider mb-1 ${isDark ? 'text-[#3A3A3A]' : 'text-[#B0B0B0]'}`}>Expected Output</span>
            <pre className={`p-2 rounded bg-opacity-30 whitespace-pre-wrap ${isDark ? 'bg-black text-[#C0C0C0]' : 'bg-white text-[#333]'}`}>
              {testCases[activeTab]?.output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
