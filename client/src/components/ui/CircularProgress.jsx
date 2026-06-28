import React from 'react';

export default function CircularProgress({ value = 0, size = 80, strokeWidth = 6, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2A2A" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#metalGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B6B6B" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center -mt-2 rotate-0" style={{ marginTop: -size / 2 - 2, position: 'relative', top: -size * 0.62 }}>
        <span className="text-lg font-bold text-[#C0C0C0]">{value}%</span>
      </div>
      {label && <span className="text-xs text-[#6B6B6B] mt-1">{label}</span>}
    </div>
  );
}