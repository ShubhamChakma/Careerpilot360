import React, { useState, useEffect, useRef } from 'react';

export default function OutputPanel({ output, loading, error, isDark, height, setHeight }) {
  const [activeTab, setActiveTab] = useState('console');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // Auto-switch tabs based on compilation outputs
  useEffect(() => {
    if (loading) return;
    if (error) {
      setActiveTab('console');
    } else if (output) {
      if (output.mode === 'submit') {
        setActiveTab('verdict');
      } else {
        setActiveTab('testcases');
      }
      setSelectedCaseIdx(0);
    }
  }, [output, error, loading]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const handleMouseMove = (moveEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(140, Math.min(600, startHeight + deltaY));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const results = output?.results || [];
  const selectedCase = results[selectedCaseIdx];

  // Visual classes based on theme
  const bgClass = isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]';
  const borderClass = isDark ? 'border-[#1E1E1E]' : 'border-[#E2E8F0]';
  const headerBgClass = isDark ? 'bg-[#121212]' : 'bg-[#F1F5F9]';
  const textMutedClass = isDark ? 'text-[#8A8A8A]' : 'text-[#64748B]';
  const textClass = isDark ? 'text-[#E2E8F0]' : 'text-[#1E293B]';

  return (
    <div
      style={{ height }}
      className={`flex flex-col border-t select-none transition-colors duration-150 ${bgClass} ${borderClass}`}
    >
      {/* Resize Handler Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-1.5 w-full cursor-row-resize flex items-center justify-center hover:bg-violet-500/30 transition-all ${
          isDark ? 'bg-[#1E1E1E]' : 'bg-[#E2E8F0]'
        }`}
        title="Drag to resize panel"
      >
        <div className={`w-12 h-1 rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#CBD5E1]'}`} />
      </div>

      {/* Header Tabs */}
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs font-semibold ${headerBgClass} ${borderClass}`}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'console'
                ? isDark
                  ? 'bg-[#1E1E1E] text-white shadow-sm'
                  : 'bg-white text-[#0F172A] shadow-sm'
                : textMutedClass + ' hover:text-violet-500'
            }`}
          >
            Console
          </button>
          {(output || error) && (
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'testcases'
                  ? isDark
                    ? 'bg-[#1E1E1E] text-white shadow-sm'
                    : 'bg-white text-[#0F172A] shadow-sm'
                  : textMutedClass + ' hover:text-violet-500'
              }`}
            >
              Test Cases {results.length > 0 && `(${results.filter(r => r.passed).length}/${results.length})`}
            </button>
          )}
          {output?.mode === 'submit' && (
            <button
              onClick={() => setActiveTab('verdict')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'verdict'
                  ? isDark
                    ? 'bg-[#1E1E1E] text-white shadow-sm'
                    : 'bg-white text-[#0F172A] shadow-sm'
                  : textMutedClass + ' hover:text-violet-500'
              }`}
            >
              Verdict
            </button>
          )}
        </div>

        {/* Short Status */}
        <div className="text-[10px] uppercase font-mono tracking-wider">
          {loading ? (
            <span className="text-violet-500 animate-pulse">Running Code...</span>
          ) : error ? (
            <span className="text-red-500">Execution Error</span>
          ) : output ? (
            <span className={output.allPassed ? 'text-emerald-500' : 'text-amber-500'}>
              {output.allPassed ? 'Passed' : 'Failed'}
            </span>
          ) : (
            <span className={textMutedClass}>Idle</span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {loading ? (
          // Loading Skeleton
          <div className="space-y-3 animate-pulse">
            <div className={`h-4 rounded w-1/3 ${isDark ? 'bg-[#1E1E1E]' : 'bg-[#E2E8F0]'}`} />
            <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-[#1E1E1E]' : 'bg-[#E2E8F0]'}`} />
            <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-[#1E1E1E]' : 'bg-[#E2E8F0]'}`} />
          </div>
        ) : error ? (
          // Error State
          <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg whitespace-pre-wrap">
            {error}
          </div>
        ) : activeTab === 'console' ? (
          // Console Output Tab
          <div className="space-y-3 h-full">
            {output?.results?.[0]?.stderr ? (
              <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg whitespace-pre-wrap">
                <span className="font-semibold text-red-500 block mb-1">Standard Error:</span>
                {output.results[0].stderr}
              </div>
            ) : output?.results?.some(r => r.actualOutput) ? (
              <div className="space-y-4">
                {output.results.map((r, i) => (
                  r.actualOutput ? (
                    <div key={i} className={`p-3 rounded-lg border ${isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
                      <div className="text-[10px] text-gray-500 mb-1">Case {i + 1} Output:</div>
                      <pre className={`whitespace-pre-wrap ${textClass}`}>{r.actualOutput}</pre>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full ${textMutedClass}`}>
                No console output generated. Run code to execute test cases.
              </div>
            )}
          </div>
        ) : activeTab === 'testcases' ? (
          // Detailed Test Cases Tab
          <div className="flex h-full gap-4 overflow-hidden">
            {/* Left sidebar with list of cases */}
            <div className="w-1/3 flex flex-col gap-1.5 overflow-y-auto pr-1">
              {results.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`flex items-center justify-between p-2 rounded-lg text-[11px] border text-left transition-all ${
                    selectedCaseIdx === idx
                      ? isDark
                        ? 'bg-[#1E1E1E] border-violet-500/40 text-white'
                        : 'bg-white border-violet-500/40 text-[#0F172A] shadow-sm'
                      : isDark
                        ? 'bg-[#0E0E0E] border-[#1E1E1E] hover:border-[#2A2A2A] text-gray-400'
                        : 'bg-[#F1F5F9] border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569]'
                  }`}
                >
                  <span className="font-medium">Case {idx + 1}</span>
                  <span className={r.passed ? 'text-emerald-500' : 'text-red-500'}>
                    {r.passed ? '✓' : '✗'}
                  </span>
                </button>
              ))}
            </div>

            {/* Right details panel */}
            {selectedCase && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {/* Input */}
                <div>
                  <div className={`text-[10px] font-semibold mb-1 ${textMutedClass}`}>Input:</div>
                  <pre className={`p-2 rounded border font-mono text-[11px] ${
                    isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  } ${textClass}`}>
                    {selectedCase.input || 'N/A'}
                  </pre>
                </div>

                {/* Expected Output */}
                <div>
                  <div className={`text-[10px] font-semibold mb-1 ${textMutedClass}`}>Expected Output:</div>
                  <pre className={`p-2 rounded border font-mono text-[11px] ${
                    isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  } ${textClass}`}>
                    {selectedCase.expectedOutput || 'N/A'}
                  </pre>
                </div>

                {/* Actual Output */}
                <div>
                  <div className={`text-[10px] font-semibold mb-1 ${textMutedClass}`}>Actual Output:</div>
                  <pre className={`p-2 rounded border font-mono text-[11px] ${
                    selectedCase.passed
                      ? isDark ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isDark ? 'bg-red-950/20 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {selectedCase.actualOutput || 'N/A'}
                  </pre>
                </div>

                {/* Info row */}
                <div className="flex gap-4 text-[10px] text-gray-500">
                  {selectedCase.durationMs !== undefined && (
                    <div>Time Elapsed: <span className="font-semibold">{selectedCase.durationMs}ms</span></div>
                  )}
                  {selectedCase.explanation && (
                    <div className="italic">Note: {selectedCase.explanation}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'verdict' && output ? (
          // Verdict Dashboard (Submission Results)
          <div className="flex flex-col items-center justify-center py-6 px-4 h-full text-center">
            {output.allPassed ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <span className="text-3xl text-emerald-500">✓</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-500">Accepted</h2>
                  <p className={`text-xs mt-1 ${textMutedClass}`}>All {output.total} test cases passed successfully!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <span className="text-3xl text-red-500">✗</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-500">Wrong Answer</h2>
                  <p className={`text-xs mt-1 ${textMutedClass}`}>
                    Passed {output.passed} / {output.total} test cases.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`flex items-center justify-center h-full ${textMutedClass}`}>
            No output data. Click "Run" or "Submit" to execute.
          </div>
        )}
      </div>
    </div>
  );
}