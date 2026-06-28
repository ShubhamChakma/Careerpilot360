import React from 'react';
import CircularProgress from '../ui/CircularProgress';
import CareerPathStepper from './CareerPathStepper';

export default function PredictionCard({ prediction, isDark }) {
  const { role, match, reasoning, missingSkills, topCompanies, avgSalary, careerPath } = prediction;
  return (
    <div className="metal-card rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-display font-semibold text-base ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>{role}</h3>
          {avgSalary && <p className="text-xs text-[#6B6B6B] mt-0.5">{avgSalary}</p>}
        </div>
        <div className="shrink-0">
          <CircularProgress value={match} size={64} strokeWidth={5} label="match" />
        </div>
      </div>

      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#4A4A4A]' : 'text-[#777]'}`}>{reasoning}</p>

      {missingSkills?.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-[#6B6B6B] mb-2">Missing Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-red-900/20 text-red-400 border border-red-800/30">{s}</span>
            ))}
          </div>
        </div>
      )}

      {topCompanies?.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-[#6B6B6B] mb-2">Top Companies</p>
          <div className="flex flex-wrap gap-1.5">
            {topCompanies.map((c) => (
              <span key={c} className={`text-[10px] px-2 py-0.5 rounded-full border ${isDark ? 'border-[#2A2A2A] text-[#A8A8A8] bg-[#141414]' : 'border-[#D0D0D0] text-[#555]'}`}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {careerPath?.length > 0 && <CareerPathStepper steps={careerPath} isDark={isDark} />}
    </div>
  );
}