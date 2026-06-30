import React from 'react';
import CircularProgress from '../ui/CircularProgress';
import ProgressBar from '../ui/ProgressBar';
import CareerPathStepper from './CareerPathStepper';

export default function PredictionCard({ prediction, isDark }) {
  const {
    role,
    match,
    confidence = 80,
    selectionProbability = 75,
    avgSalary,
    requiredSkills = [],
    missingSkills = [],
    reasoning,
    suggestions = [],
    learningTime = '2-4 weeks',
    topCompanies = [],
    careerPath = []
  } = prediction;

  return (
    <div className="metal-card rounded-2xl p-6 flex flex-col gap-4 border border-zinc-800 bg-[#111]/30">
      
      {/* Role & Salary */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-display font-bold text-base ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            {role}
          </h3>
          {avgSalary && (
            <p className="text-xs text-indigo-400 font-semibold mt-0.5">
              Est. Salary: {avgSalary}
            </p>
          )}
        </div>
        <div className="shrink-0">
          <CircularProgress value={match} size={60} strokeWidth={5} label="match" />
        </div>
      </div>

      {/* Probabilities & Confidence */}
      <div className="grid grid-cols-2 gap-4 bg-black/10 p-3 rounded-xl border border-zinc-900/50">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">AI Confidence</span>
          <span className="text-xs font-bold text-zinc-300">{confidence}%</span>
          <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${confidence}%` }} />
          </div>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Selection Chance</span>
          <span className={`text-xs font-bold ${selectionProbability > 75 ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {selectionProbability}%
          </span>
          <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectionProbability}%` }} />
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
        {reasoning}
      </p>

      {/* Skills Comparison */}
      <div className="space-y-3">
        {requiredSkills?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-[#6B6B6B] mb-1 uppercase tracking-wider">Strong Skills Matching</p>
            <div className="flex flex-wrap gap-1">
              {requiredSkills.map((s) => (
                <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {missingSkills?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-[#6B6B6B] mb-1 uppercase tracking-wider">Missing Skills Gap</p>
            <div className="flex flex-wrap gap-1">
              {missingSkills.map((s) => (
                <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-red-950/20 text-red-400 border border-red-900/30">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions and Learning Path */}
      {suggestions?.length > 0 && (
        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/20">
          <p className="text-[10px] font-bold text-indigo-400 mb-1.5 uppercase tracking-wider flex justify-between">
            <span>Improvement Plan</span>
            <span className="text-zinc-500 font-normal normal-case">Est: {learningTime}</span>
          </p>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li key={i} className="text-[10px] text-zinc-400 flex items-start gap-2">
                <span className="text-indigo-400">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Companies */}
      {topCompanies?.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-[#6B6B6B] mb-1 uppercase tracking-wider">Top Hiring Companies</p>
          <div className="flex flex-wrap gap-1.5">
            {topCompanies.map((c) => (
              <span key={c} className={`text-[9px] px-2 py-0.5 rounded border ${
                isDark ? 'border-[#2A2A2A] text-[#A8A8A8] bg-[#141414]' : 'border-[#D0D0D0] text-[#555]'
              }`}>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career path */}
      {careerPath?.length > 0 && (
        <div className="pt-2 border-t border-zinc-900">
          <CareerPathStepper steps={careerPath} isDark={isDark} />
        </div>
      )}

    </div>
  );
}