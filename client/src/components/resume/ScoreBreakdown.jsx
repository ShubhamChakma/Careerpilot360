import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function ScoreBreakdown({ breakdown = {}, isDark }) {
  const categories = [
    { key: 'keywords', label: 'Keywords Match' },
    { key: 'formatting', label: 'Resume Formatting' },
    { key: 'experience', label: 'Experience Depth' },
    { key: 'skills', label: 'Technical Skills' },
    { key: 'education', label: 'Education Alignment' },
  ];

  return (
    <div className={`metal-card rounded-2xl p-6`}>
      <h3 className={`font-display font-semibold text-base mb-5 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
        ATS Category Breakdown
      </h3>
      <div className="space-y-4">
        {categories.map((c) => (
          <ProgressBar
            key={c.key}
            label={c.label}
            value={breakdown[c.key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
