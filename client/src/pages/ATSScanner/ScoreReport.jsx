import React from 'react';
import ATSScoreCard from '../../components/resume/ATSScoreCard';
import ScoreBreakdown from '../../components/resume/ScoreBreakdown';
import Badge from '../../components/ui/Badge';

export default function ScoreReport({ atsData, isDark }) {
  if (!atsData) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ATSScoreCard score={atsData.overall} isDark={isDark} />
        <ScoreBreakdown breakdown={atsData.breakdown || atsData.scores} isDark={isDark} />
      </div>

      {/* Keywords section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metal-card rounded-2xl p-6">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Matched Keywords ({atsData.matchedKeywords?.length ?? 0})
          </h3>
          {atsData.matchedKeywords?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {atsData.matchedKeywords.map((kw, idx) => (
                <Badge key={idx} variant="easy" className="text-[10px]">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className={`text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>No matching keywords identified.</p>
          )}
        </div>

        <div className="metal-card rounded-2xl p-6">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Missing Keywords ({atsData.missingKeywords?.length ?? 0})
          </h3>
          {atsData.missingKeywords?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {atsData.missingKeywords.map((kw, idx) => (
                <Badge key={idx} variant="hard" className="text-[10px]">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className={`text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>Great! No major keywords are missing.</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {atsData.suggestions?.length > 0 && (
        <div className="metal-card rounded-2xl p-6">
          <h3 className={`font-display font-semibold text-base mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Actionable Optimization Suggestions
          </h3>
          <ul className="space-y-3">
            {atsData.suggestions.map((s, i) => (
              <li key={i} className={`text-sm flex items-start gap-3 ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
                <span className="text-[#C0C0C0] font-bold mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
