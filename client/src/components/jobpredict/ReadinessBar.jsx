import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function ReadinessBar({ overallReadiness, strongestArea, weakestArea, isDark }) {
  return (
    <div className={`metal-card rounded-2xl p-6`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className={`font-display font-semibold text-base ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Overall Readiness</h2>
          <div className="flex gap-4 mt-1">
            <span className="text-xs text-emerald-400">↑ Strongest: {strongestArea}</span>
            <span className="text-xs text-red-400">↓ Weakest: {weakestArea}</span>
          </div>
        </div>
        <span className="text-3xl font-bold text-[#C0C0C0] font-display">{overallReadiness}%</span>
      </div>
      <ProgressBar value={overallReadiness} />
    </div>
  );
}