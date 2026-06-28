import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label, className = '' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-[#A8A8A8]">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6B6B6B, #C0C0C0)' }}
        />
      </div>
    </div>
  );
}