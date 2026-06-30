import React from 'react';
import ATSScoreCard from '../../components/resume/ATSScoreCard';
import ScoreBreakdown from '../../components/resume/ScoreBreakdown';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function ScoreReport({ atsData, parsedResume, isDark }) {
  if (!atsData) return null;

  // Fallbacks if parsedResume is empty or nested
  const resume = parsedResume || atsData.parsedData || {};

  const skillGroups = [
    { key: 'languages', label: 'Languages' },
    { key: 'frameworks', label: 'Frameworks' },
    { key: 'libraries', label: 'Libraries' },
    { key: 'databases', label: 'Databases' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'tools', label: 'Tools' },
    { key: 'softSkills', label: 'Soft Skills' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Self-contained styling for clean vector PDF printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
            background: none !important;
            color: #000 !important;
          }
          #ats-report-print-area, #ats-report-print-area * {
            visibility: visible !important;
          }
          #ats-report-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: 1px solid #ddd !important;
            margin-bottom: 1.5rem !important;
            padding: 1.5rem !important;
            page-break-inside: avoid !important;
            background: #fff !important;
          }
          .print-title {
            color: #111 !important;
            font-size: 1.5rem !important;
            border-bottom: 2px solid #333 !important;
            padding-bottom: 0.5rem !important;
          }
          .badge-print {
            border: 1px solid #aaa !important;
            color: #333 !important;
            background: #f0f0f0 !important;
            padding: 0.2rem 0.5rem !important;
            margin: 0.2rem !important;
            display: inline-block !important;
          }
        }
      `}} />

      <div className="flex justify-between items-center no-print">
        <h2 className={`font-display font-bold text-xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          Analysis Report
        </h2>
        <Button onClick={handlePrint} variant="secondary" className="flex items-center gap-2">
          <span>📥</span> Download PDF Report
        </Button>
      </div>

      {/* Main Print Container */}
      <div id="ats-report-print-area" className="space-y-6">
        
        {/* Score and Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="print-card metal-card rounded-2xl p-6">
            <ATSScoreCard score={atsData.score || atsData.overall} isDark={isDark} />
          </div>
          <div className="print-card metal-card rounded-2xl p-6">
            <ScoreBreakdown breakdown={atsData.breakdown || atsData.scores} isDark={isDark} />
          </div>
        </div>

        {/* Compatibility and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="print-card metal-card rounded-2xl p-6">
            <h3 className={`font-display font-semibold text-base mb-3 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              ATS Compatibility Assessment
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#4A4A4A]'}`}>
              {atsData.compatibility || "Evaluation complete."}
            </p>
          </div>
          <div className="print-card metal-card rounded-2xl p-6">
            <h3 className={`font-display font-semibold text-base mb-3 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Resume Summary
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#4A4A4A]'}`}>
              {atsData.summary || resume.summary || "No parsed summary available."}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="print-card metal-card rounded-2xl p-6 bg-emerald-950/5 border-emerald-900/10">
            <h3 className="font-display font-semibold text-base text-emerald-400 mb-3 print-title">
              Strengths
            </h3>
            <ul className="space-y-2">
              {atsData.strengths?.map((str, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-emerald-300/80">
                  <span className="text-emerald-400 font-semibold">✓</span> <span>{str}</span>
                </li>
              )) || <li className="text-xs text-gray-500">None identified.</li>}
            </ul>
          </div>
          <div className="print-card metal-card rounded-2xl p-6 bg-red-950/5 border-red-900/10">
            <h3 className="font-display font-semibold text-base text-red-400 mb-3 print-title">
              Weaknesses
            </h3>
            <ul className="space-y-2">
              {atsData.weaknesses?.map((wk, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-red-300/80">
                  <span className="text-red-400 font-semibold">→</span> <span>{wk}</span>
                </li>
              )) || <li className="text-xs text-gray-500">None identified.</li>}
            </ul>
          </div>
        </div>

        {/* Keywords section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="print-card metal-card rounded-2xl p-6">
            <h3 className={`font-display font-semibold text-base mb-4 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Matched Keywords ({atsData.matchedKeywords?.length ?? 0})
            </h3>
            {atsData.matchedKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atsData.matchedKeywords.map((kw, idx) => (
                  <Badge key={idx} variant="easy" className="text-[10px] badge-print">
                    {kw}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>No matching keywords identified.</p>
            )}
          </div>

          <div className="print-card metal-card rounded-2xl p-6">
            <h3 className={`font-display font-semibold text-base mb-4 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Missing Keywords ({atsData.missingKeywords?.length ?? 0})
            </h3>
            {atsData.missingKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atsData.missingKeywords.map((kw, idx) => (
                  <Badge key={idx} variant="hard" className="text-[10px] badge-print">
                    {kw}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>Great! No major keywords are missing.</p>
            )}
          </div>
        </div>

        {/* Formatting Issues */}
        {atsData.formattingIssues?.length > 0 && (
          <div className="print-card metal-card rounded-2xl p-6 bg-amber-950/5 border-amber-900/10">
            <h3 className="font-display font-semibold text-base text-amber-400 mb-3 print-title">
              ATS Formatting Issues Detected
            </h3>
            <ul className="space-y-2">
              {atsData.formattingIssues.map((issue, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-amber-300/80">
                  <span className="text-amber-400 font-semibold">⚠</span> <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions & Recommended changes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {atsData.suggestions?.length > 0 && (
            <div className="print-card metal-card rounded-2xl p-6">
              <h3 className={`font-display font-semibold text-base mb-4 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
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

          {atsData.recommendedChanges?.length > 0 && (
            <div className="print-card metal-card rounded-2xl p-6">
              <h3 className={`font-display font-semibold text-base mb-4 print-title ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                Recommended Resume Wording Changes
              </h3>
              <ul className="space-y-3">
                {atsData.recommendedChanges.map((change, i) => (
                  <li key={i} className={`text-sm flex items-start gap-3 ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
                    <span className="text-indigo-400 font-bold mt-0.5">→</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* EXTRACTED RESUME SECTIONS */}
        {resume.name && (
          <div className="border-t border-[#2A2A2A] pt-8 mt-8 no-print">
            <h2 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Extracted Resume Profile
            </h2>
            <div className="print-card metal-card rounded-2xl p-6 space-y-6">
              
              {/* Contact info */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-[#1A1A1A] pb-4">
                {resume.name && <p className="text-sm font-semibold">Name: <span className="font-normal text-[#999]">{resume.name}</span></p>}
                {resume.email && <p className="text-sm font-semibold">Email: <span className="font-normal text-[#999]">{resume.email}</span></p>}
                {resume.phone && <p className="text-sm font-semibold">Phone: <span className="font-normal text-[#999]">{resume.phone}</span></p>}
              </div>

              {/* Grouped Skills */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Extracted Technical Skills</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {skillGroups.map((g) => {
                    const list = resume.skills?.[g.key] || [];
                    if (list.length === 0) return null;
                    return (
                      <div key={g.key} className="bg-black/10 p-3 rounded-lg border border-[#1C1C1C]">
                        <p className="text-xs font-semibold text-[#888] mb-1.5">{g.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {list.map((s, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Experience */}
              {resume.experience?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 border-b border-[#1A1A1A] pb-1">Experience</h4>
                  <div className="space-y-4">
                    {resume.experience.map((exp, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between font-semibold text-zinc-300">
                          <span>{exp.role} at {exp.company}</span>
                          <span className="text-zinc-500 font-normal">{exp.duration}</span>
                        </div>
                        <p className="text-zinc-400 mt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 border-b border-[#1A1A1A] pb-1">Projects</h4>
                  <div className="space-y-4">
                    {resume.projects.map((proj, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="font-semibold text-zinc-300">
                          {proj.title} {proj.technologies?.length > 0 && <span className="text-[9px] text-[#6B6B6B] ml-2">({proj.technologies.join(', ')})</span>}
                        </div>
                        <p className="text-zinc-400 mt-1 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resume.education?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 border-b border-[#1A1A1A] pb-1">Education</h4>
                  <div className="space-y-3">
                    {resume.education.map((edu, idx) => (
                      <div key={idx} className="text-xs flex justify-between text-zinc-400">
                        <div>
                          <span className="font-semibold text-zinc-300">{edu.degree}</span> - {edu.institution}
                        </div>
                        <div>
                          {edu.year} {edu.score && <span className="text-zinc-500 font-normal">({edu.score})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications / Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume.certifications?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 border-b border-[#1A1A1A] pb-1">Certifications</h4>
                    <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                      {resume.certifications.map((cert, idx) => <li key={idx}>{cert}</li>)}
                    </ul>
                  </div>
                )}
                {resume.achievements?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 border-b border-[#1A1A1A] pb-1">Key Achievements</h4>
                    <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                      {resume.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
