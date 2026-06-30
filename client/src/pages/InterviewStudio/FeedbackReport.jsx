import React from 'react';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';

export default function FeedbackReport({ report = {}, onRestart, isDark }) {
  const categories = [
    { key: 'technicalScore', label: 'Technical depth & accuracy' },
    { key: 'communicationScore', label: 'Communication clarity' },
    { key: 'confidenceScore', label: 'Confidence & flow' },
    { key: 'problemSolvingScore', label: 'Problem solving method' },
    { key: 'resumeKnowledgeScore', label: 'Resume & Project familiarity' },
    { key: 'behaviourScore', label: 'Behavioral & Situational' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up py-4 px-4 sm:px-6">
      <div className="metal-card rounded-2xl p-6 text-center">
        <span className="text-3xl block mb-2">🎉</span>
        <h2 className={`font-display font-bold text-2xl mb-1 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          Interview Completed
        </h2>
        <p className={`text-sm ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
          Here is your comprehensive AI-generated technical interview evaluation
        </p>

        <div className="flex flex-col items-center justify-center my-6">
          <span className="text-5xl font-bold text-zinc-300 font-display">
            {report.overallScore || report.score || 0}
          </span>
          <span className={`text-xs mt-1 uppercase tracking-wider font-semibold ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
            Overall Score
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown */}
        <div className="metal-card rounded-2xl p-6 space-y-4">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Performance Breakdown
          </h3>
          {categories.map((c) => (
            <ProgressBar
              key={c.key}
              label={c.label}
              value={report[c.key] || 0}
            />
          ))}
        </div>

        {/* Overview Summary */}
        <div className="metal-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              AI Feedback Summary
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#4A4A4A]'}`}>
              {report.summary}
            </p>
          </div>
          
          {report.suggestions?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">AI Suggestions</h4>
              <ul className="space-y-1.5 text-xs text-[#999]">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-zinc-500">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metal-card rounded-2xl p-6 bg-emerald-950/5 border-emerald-900/10">
          <h3 className="font-display font-semibold text-base text-emerald-400 mb-4">
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {(report.strengths || report.keyStrengths)?.map((str, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2 text-emerald-300/80">
                <span className="text-emerald-400 font-bold">✓</span> <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="metal-card rounded-2xl p-6 bg-red-950/5 border-red-900/10">
          <h3 className="font-display font-semibold text-base text-red-400 mb-4">
            Areas of Improvement / Weaknesses
          </h3>
          <ul className="space-y-2">
            {(report.weaknesses || report.improvements)?.map((imp, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2 text-red-300/80">
                <span className="text-red-400 font-bold">→</span> <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      {report.nextSteps?.length > 0 && (
        <div className="metal-card rounded-2xl p-6 border-zinc-800">
          <h3 className={`font-display font-semibold text-base mb-3 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Actionable Next Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.nextSteps.map((step, idx) => (
              <div key={idx} className="p-3 bg-black/10 rounded-lg border border-zinc-800 text-xs flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                  {idx + 1}
                </span>
                <span className="text-zinc-400">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button onClick={onRestart} className="px-8 py-3">
          Start Another Mock Interview
        </Button>
      </div>
    </div>
  );
}
