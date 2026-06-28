import React from 'react';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';

export default function FeedbackReport({ report = {}, onRestart, isDark }) {
  const categories = [
    { key: 'technical', label: 'Technical Accuracy' },
    { key: 'communication', label: 'Communication Clarity' },
    { key: 'problemSolving', label: 'Problem Solving Method' },
    { key: 'depth', label: 'Response Depth & Detail' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up py-4">
      <div className="metal-card rounded-2xl p-6 text-center">
        <span className="text-3xl block mb-2">🎉</span>
        <h2 className={`font-display font-bold text-2xl mb-1 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          Interview Completed
        </h2>
        <p className={`text-sm ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
          Here is your AI-generated technical interview evaluation
        </p>

        <div className="flex flex-col items-center justify-center my-6">
          <span className="text-5xl font-bold text-[#C0C0C0] font-display">{report.overallScore}</span>
          <span className={`text-xs mt-1 uppercase tracking-wider font-semibold ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
            Overall Score
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown */}
        <div className="metal-card rounded-2xl p-6 space-y-4">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Category Ratings
          </h3>
          {categories.map((c) => (
            <ProgressBar
              key={c.key}
              label={c.label}
              value={report.categories?.[c.key] ?? 0}
            />
          ))}
        </div>

        {/* Overview Summary */}
        <div className="metal-card rounded-2xl p-6">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            AI Feedback Summary
          </h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
            {report.summary}
          </p>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metal-card rounded-2xl p-6 bg-emerald-950/5 border-emerald-900/15">
          <h3 className="font-display font-semibold text-base text-emerald-400 mb-4">
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths?.map((str, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2 text-emerald-300/80">
                <span>✓</span> <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="metal-card rounded-2xl p-6 bg-red-950/5 border-red-900/15">
          <h3 className="font-display font-semibold text-base text-red-400 mb-4">
            Areas of Improvement
          </h3>
          <ul className="space-y-2">
            {report.improvements?.map((imp, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2 text-red-300/80">
                <span>→</span> <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={onRestart} className="px-8 py-3">
          Start Another Mock Interview
        </Button>
      </div>
    </div>
  );
}
