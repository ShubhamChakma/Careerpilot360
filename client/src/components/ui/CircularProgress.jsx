import React from 'react';

export default function CircularProgress({ value = 0, size = 80, strokeWidth = 6, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="relative">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2A2A" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#metalGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#C0C0C0"
          className="font-display font-bold"
          style={{ fontSize: `${Math.round(size * 0.22)}px` }}
        >
          {value}%
        </text>
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#888888" />
            <stop offset="100%" stopColor="#E8E8E8" />
          </linearGradient>
        </defs>
      </svg>
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">
          {label}
        </span>
      )}
    </div>
  );
}