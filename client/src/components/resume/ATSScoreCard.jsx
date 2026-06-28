import React from 'react';

export default function ATSScoreCard({ score = 0, isDark }) {
  let feedback = 'Needs Improvement';
  let color = 'text-red-400';
  if (score >= 80) {
    feedback = 'Excellent';
    color = 'text-emerald-400';
  } else if (score >= 65) {
    feedback = 'Good Match';
    color = 'text-[#C0C0C0]';
  }

  return (
    <div className={`metal-card rounded-2xl p-6 flex flex-col items-center justify-center text-center`}>
      <span className="text-sm font-semibold tracking-wider uppercase mb-2 text-[#6B6B6B]">Overall ATS Score</span>
      <div className="relative flex items-center justify-center w-28 h-28 my-2">
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isDark ? '#1C1C1C' : '#E0E0E0'}
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
            className="text-[#C0C0C0] transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="text-3xl font-bold font-display text-[#E8E8E8]">{score}</span>
      </div>
      <span className={`text-sm font-semibold mt-2 ${color}`}>{feedback}</span>
    </div>
  );
}
