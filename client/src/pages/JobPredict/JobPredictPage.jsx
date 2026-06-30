import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useJobPredict } from '../../hooks/useJobPredict';
import { useJobPredictStore } from '../../store/jobPredictStore';
import { useResume } from '../../hooks/useResume';
import ResumeUploader from '../../components/resume/ResumeUploader';
import PredictButton from '../../components/jobpredict/PredictButton';
import ReadinessBar from '../../components/jobpredict/ReadinessBar';
import PredictionGrid from '../../components/jobpredict/PredictionGrid';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

// ----------------------------------------------------
// Custom Responsive Pentagon Radar Chart
// ----------------------------------------------------
function RadarChart({ data, isDark }) {
  const cx = 150;
  const cy = 150;
  const r = 90;
  const points = data.length;

  if (points === 0) return null;

  const scales = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = scales.map((scale) => {
    const scalePoints = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
      const x = cx + r * scale * Math.cos(angle);
      const y = cy + r * scale * Math.sin(angle);
      scalePoints.push(`${x},${y}`);
    }
    return scalePoints.join(' ');
  });

  const dataPoints = data.map((d, i) => {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
    const valRatio = d.score / 100;
    const x = cx + r * valRatio * Math.cos(angle);
    const y = cy + r * valRatio * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axes = [];
  const labels = [];
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
    const outerX = cx + r * Math.cos(angle);
    const outerY = cy + r * Math.sin(angle);
    axes.push({ x1: cx, y1: cy, x2: outerX, y2: outerY });

    const labelDistance = r + 24;
    const labelX = cx + labelDistance * Math.cos(angle);
    const labelY = cy + labelDistance * Math.sin(angle);
    
    let textAnchor = 'middle';
    if (Math.cos(angle) > 0.1) textAnchor = 'start';
    if (Math.cos(angle) < -0.1) textAnchor = 'end';

    labels.push({
      text: data[i].label,
      score: data[i].score,
      x: labelX,
      y: labelY,
      anchor: textAnchor
    });
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-black/10 rounded-2xl border border-zinc-800">
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        Role Match Matrix
      </h3>
      <svg width="100%" height="100%" viewBox="0 0 300 300" className="max-w-[280px]">
        {/* Grids */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke={isDark ? '#222' : '#e5e5e5'}
            strokeWidth={1}
            strokeDasharray={idx === 3 ? 'none' : '3,3'}
          />
        ))}

        {/* Axes */}
        {axes.map((ax, idx) => (
          <line
            key={idx}
            x1={ax.x1}
            y1={ax.y1}
            x2={ax.x2}
            y2={ax.y2}
            stroke={isDark ? '#222' : '#e5e5e5'}
            strokeWidth={1}
          />
        ))}

        {/* Data area */}
        <polygon
          points={dataPoints}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#6366f1"
          strokeWidth={1.5}
        />

        {/* Data points */}
        {dataPoints.split(' ').map((pt, idx) => {
          const [x, y] = pt.split(',');
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={3}
              fill="#6366f1"
              stroke={isDark ? '#000' : '#fff'}
              strokeWidth={1}
            />
          );
        })}

        {/* Labels */}
        {labels.map((lbl, idx) => (
          <g key={idx} className="text-[8px] font-semibold">
            <text
              x={lbl.x}
              y={lbl.y}
              textAnchor={lbl.anchor}
              fill={isDark ? '#E8E8E8' : '#1A1A1A'}
            >
              {lbl.text.length > 18 ? `${lbl.text.slice(0, 16)}..` : lbl.text}
            </text>
            <text
              x={lbl.x}
              y={lbl.y + 9}
              textAnchor={lbl.anchor}
              fill="#6366f1"
              className="font-bold text-[7px]"
            >
              {lbl.score}% Match
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// Custom Responsive SVG Skill Gap Chart
// ----------------------------------------------------
function SkillGapChart({ predictions, isDark }) {
  const gapCounts = {};
  predictions.forEach((p) => {
    (p.missingSkills || []).forEach((s) => {
      gapCounts[s] = (gapCounts[s] || 0) + 1;
    });
  });

  const sortedGaps = Object.entries(gapCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (sortedGaps.length === 0) {
    return (
      <div className="text-center py-10 text-xs text-zinc-500">
        No major skill gaps identified. You match all roles!
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-black/10 rounded-2xl border border-zinc-800 flex-1">
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        Core Skill Gaps (Top 5)
      </h3>
      {sortedGaps.map((gap, idx) => {
        const gapPct = (gap.count / predictions.length) * 100;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{gap.skill}</span>
              <span className="text-red-400 text-[10px]">Needed in {gap.count} / {predictions.length} Roles</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden w-full ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-red-500/80 to-amber-500/80 rounded-full transition-all duration-500"
                style={{ width: `${gapPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------
// Main Job Prediction Page Component
// ----------------------------------------------------
export default function JobPredictPage() {
  const { isDark } = useThemeStore();
  const { predict, loadCached, loading, error: apiError } = useJobPredict();
  const { predictions, overallReadiness, strongestArea, weakestArea, cachedAt } = useJobPredictStore();

  const { resume, fetchResume, scanResume } = useResume();
  const [useExisting, setUseExisting] = useState(true);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [clientError, setClientError] = useState(null);

  useEffect(() => {
    fetchResume();
    loadCached();
  }, [fetchResume, loadCached]);

  useEffect(() => {
    if (resume && (resume.fileName || resume.resumeText)) {
      setUseExisting(true);
    } else {
      setUseExisting(false);
    }
  }, [resume]);

  const handlePredict = async () => {
    setClientError(null);
    try {
      console.log('🔮 Starting Job Match Prediction Workflow...');
      if (!useExisting && file) {
        console.log('📄 Uploading and parsing new resume file...', file.name);
        setUploadingResume(true);
        try {
          const report = await scanResume(file, 'Assessment for Job Prediction matching');
          console.log('📄 Resume parsed successfully. ATS report summary:', report);
        } catch (uploadErr) {
          console.error('❌ Resume upload/parse failed:', uploadErr);
          throw new Error('Failed to parse and upload resume. Please check console logs or try another file.');
        } finally {
          setUploadingResume(false);
        }
      }

      console.log('🚀 Dispatching backend predict fit request...');
      const response = await predict();
      console.log('✅ Job Prediction matches generated successfully:', response);
    } catch (err) {
      console.error('❌ Job Prediction workflow failed:', err);
      const friendlyMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to predict matching jobs. Please try again.';
      setClientError(friendlyMsg);
    }
  };

  const hasResumeOption = (useExisting && resume && (resume.fileName || resume.resumeText)) || (!useExisting && file);

  const radarData = predictions.slice(0, 5).map((p) => ({
    label: p.role,
    score: p.match
  }));

  const activeError = clientError || apiError;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Job Predict
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
            AI-matched job roles based on your uploaded resume
          </p>
          {cachedAt && (
            <p className={`text-xs mt-1 ${isDark ? 'text-[#3A3A3A]' : 'text-[#999]'}`}>
              Last predicted: {new Date(cachedAt.seconds * 1000 || cachedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <PredictButton
          onPredict={handlePredict}
          loading={loading || uploadingResume}
          disabled={!hasResumeOption}
        />
      </div>

      {/* Resume Upload / Reuse Integration Panel */}
      {!loading && !uploadingResume && (
        <div className={`metal-card rounded-2xl p-5 border mb-6 ${
          isDark ? 'bg-[#111]/30 border-zinc-800' : 'bg-white border-zinc-300'
        }`}>
          <h2 className={`font-display font-semibold text-sm mb-3 ${isDark ? 'text-zinc-350' : 'text-zinc-700'}`}>
            Resume Reference Source
          </h2>
          
          {resume && (resume.fileName || resume.resumeText) && useExisting ? (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              isDark ? 'bg-zinc-900/50 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-xl">📄</span>
                <div className="truncate">
                  <p className="text-xs font-semibold truncate">Resume Found: {resume.fileName || 'Active Resume'}</p>
                  <p className="text-[10px] text-zinc-500">Automatically matched across modules</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setUseExisting(false);
                  setFile(null);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold shrink-0"
              >
                Upload New Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {!(resume && (resume.fileName || resume.resumeText)) && (
                <div className="p-3 rounded-xl bg-red-950/15 border border-red-900/30 text-xs text-red-400 font-medium">
                  ⚠️ No resume uploaded. Please upload your resume first.
                </div>
              )}
              
              <ResumeUploader
                file={file}
                setFile={setFile}
                dragging={dragging}
                setDragging={setDragging}
                isDark={isDark}
              />
              
              {resume && (resume.fileName || resume.resumeText) && (
                <button
                  onClick={() => setUseExisting(true)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold block mt-1"
                >
                  ← Use previously uploaded resume
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error state with user retry option */}
      {activeError && (
        <div className="p-4 rounded-xl mb-6 bg-red-950/20 border border-red-900/30 flex items-center justify-between gap-4">
          <p className="text-red-400 text-xs font-semibold">⚠️ {activeError}</p>
          <Button size="xs" variant="secondary" onClick={handlePredict}>Retry Prediction</Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {(loading || uploadingResume) && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner size="lg" />
            <p className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
              {uploadingResume ? 'Processing resume details...' : 'AI Recruiter is analyzing your skills and matching jobs...'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`h-64 rounded-2xl animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
            <div className={`h-64 rounded-2xl animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
          </div>
        </div>
      )}

      {!loading && !uploadingResume && predictions.length > 0 && (
        <div className="space-y-6">
          <ReadinessBar overallReadiness={overallReadiness} strongestArea={strongestArea} weakestArea={weakestArea} isDark={isDark} />
          
          {/* Custom SVG Charts Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <RadarChart data={radarData} isDark={isDark} />
            <SkillGapChart predictions={predictions} isDark={isDark} />
          </div>

          <div className="mt-8">
            <h3 className={`font-display font-semibold text-lg mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Top 5 Job Matches
            </h3>
            <PredictionGrid predictions={predictions} isDark={isDark} />
          </div>
        </div>
      )}

      {!loading && !uploadingResume && predictions.length === 0 && (
        <div className={`metal-card rounded-2xl p-12 text-center border ${
          isDark ? 'bg-[#111]/30 border-zinc-800' : 'bg-white border-zinc-300'
        }`}>
          <span className="text-4xl block mb-4">🎯</span>
          <h2 className={`font-display font-semibold text-lg mb-2 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            No predictions yet
          </h2>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#6B6B6B]' : 'text-[#999]'}`}>
            Please upload or select your resume above, then click Predict.
          </p>
        </div>
      )}
    </div>
  );
}