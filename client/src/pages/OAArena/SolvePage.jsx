import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useCodeRunner } from '../../hooks/useCodeRunner';
import MonacoEditor from '../../components/editor/MonacoEditor';
import LanguageSelect from '../../components/editor/LanguageSelect';
import OutputPanel from '../../components/editor/OutputPanel';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getQuestionBySlug } from '../../data/questions/index';

export default function SolvePage() {
  const { id } = useParams();
  const { isDark } = useThemeStore();
  const { execute, output, loading, error } = useCodeRunner();
  const question = getQuestionBySlug(id);

  const [lang, setLang] = useState('python');
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [outputHeight, setOutputHeight] = useState(240);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const startTimeRef = useRef(null);

  useEffect(() => {
    if (output && output.mode === 'submit') {
      const isAccepted = output.success || output.allPassed || output.verdict === 'Accepted';
      if (isAccepted) {
        setShowSuccessOverlay(true);
      }
    }
  }, [output]);

  // Maintain separate code content per language so user edits aren't lost on switch
  const [editorCodes, setEditorCodes] = useState(() => {
    const initial = {};
    const langs = ['python', 'javascript', 'java', 'cpp', 'c'];
    langs.forEach((l) => {
      const customStarter = question?.starterCode?.[l];
      if (customStarter) {
        initial[l] = customStarter;
      } else if (l === 'javascript') {
        initial[l] = `function solve() {\n    // Write your solution here\n    \n}\n`;
      } else {
        initial[l] = `// Write your solution here\n`;
      }
    });
    return initial;
  });

  // Track roundtrip compilation duration
  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current) {
      setElapsedTime(Date.now() - startTimeRef.current);
      startTimeRef.current = null;
    }
  }, [loading]);

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-4">Question not found.</p>
        <Link to="/oa-arena" className="text-violet-500 hover:underline text-sm font-semibold">
          Return to Arena
        </Link>
      </div>
    );
  }

  const currentCode = editorCodes[lang] || '';

  const handleCodeChange = (newVal) => {
    setEditorCodes((prev) => ({
      ...prev,
      [lang]: newVal,
    }));
  };

  const runCode = () => {
    execute({
      language: lang,
      code: currentCode,
      questionId: question.id,
      mode: 'run',
    });
  };

  const submitCode = () => {
    execute({
      language: lang,
      code: currentCode,
      questionId: question.id,
      mode: 'submit',
    });
  };

  const pageBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]';
  const borderClass = isDark ? 'border-[#1E1E1E]' : 'border-[#E2E8F0]';
  const textTitleClass = isDark ? 'text-white' : 'text-[#0F172A]';

  if (showSuccessOverlay) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] ${pageBg} px-4 relative overflow-hidden`}>
        {/* Animated Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating Confetti Particle System */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 25 }).map((_, idx) => {
            const randomLeft = Math.random() * 100;
            const randomDelay = Math.random() * 4;
            const randomDuration = 4 + Math.random() * 4;
            const randomSize = 6 + Math.random() * 8;
            const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];
            const color = colors[idx % colors.length];
            return (
              <div
                key={idx}
                className="absolute animate-bounce opacity-30"
                style={{
                  left: `${randomLeft}%`,
                  top: `-20px`,
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                  backgroundColor: color,
                  borderRadius: idx % 3 === 0 ? '50%' : idx % 3 === 1 ? '4px' : '0px',
                  animationName: 'fall-and-drift',
                  animationDuration: `${randomDuration}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${randomDelay}s`,
                }}
              />
            );
          })}
        </div>

        <style>{`
          @keyframes fall-and-drift {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        {/* Card */}
        <div className={`max-w-md w-full rounded-3xl border p-8 space-y-6 text-center shadow-2xl relative z-10 backdrop-blur-xl ${
          isDark ? 'bg-[#0E0E0E]/90 border-[#222]' : 'bg-white/90 border-slate-200'
        }`}>
          {/* Animated Green Check Badge */}
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
            <div className="absolute -inset-2 rounded-full bg-emerald-500/5 animate-pulse" />
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className={`font-display font-extrabold text-3xl tracking-tight ${textTitleClass}`}>
              Accepted!
            </h1>
            <p className="text-sm text-emerald-400 font-semibold tracking-wider uppercase">
              All Test Cases Passed Successfully
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your solution is optimal and has been stored in your submission history.
            </p>
          </div>

          {/* Solution Stats */}
          <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl border text-xs font-mono ${
            isDark ? 'bg-[#151515] border-[#222]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-left space-y-0.5">
              <span className="text-gray-500 text-[10px] uppercase font-sans">Question</span>
              <div className={`font-bold font-sans truncate ${textTitleClass}`}>{question.title}</div>
            </div>
            <div className="text-left space-y-0.5">
              <span className="text-gray-500 text-[10px] uppercase font-sans">Language</span>
              <div className={`font-bold font-sans capitalize ${textTitleClass}`}>{lang}</div>
            </div>
            <div className="text-left space-y-0.5 mt-2 border-t pt-2 border-dashed col-span-2 flex justify-between items-center">
              <span className="text-gray-500 text-[10px] uppercase font-sans">Test Cases</span>
              <div className="font-bold text-emerald-500 font-sans text-sm">
                {output?.passed || 10} / {output?.total || 10} Passed
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/oa-arena">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 font-bold transition-all">
                Return to OA Arena
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => setShowSuccessOverlay(false)}
              className="text-xs py-3 rounded-xl font-semibold"
            >
              Review Code Solution
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-[calc(100vh-64px)] overflow-hidden ${pageBg}`}>
      {/* Problem Panel (Left 42%) */}
      <div className={`w-[42%] overflow-y-auto border-r flex flex-col ${borderClass}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant={question.difficulty}>{question.difficulty}</Badge>
            <Badge variant="silver">{question.topic}</Badge>
          </div>

          <div>
            <h1 className={`font-display font-extrabold text-2xl tracking-tight mb-2 ${textTitleClass}`}>
              {question.title}
            </h1>
            <p className="text-xs text-gray-500 font-mono">ID: {question.slug}</p>
          </div>

          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {question.description}
          </div>

          {/* Examples */}
          {(question.examples || question.sampleTestCases) && (
            <div className="space-y-6">
              <h3 className={`text-sm font-bold tracking-tight uppercase ${textTitleClass}`}>Sample Test Cases</h3>
              {(question.examples || question.sampleTestCases).slice(0, 2).map((ex, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-5 border text-xs font-mono transition-all duration-300 shadow-sm ${
                    isDark 
                      ? 'bg-[#0E0E0E] border-[#222] hover:border-[#333]' 
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-violet-500 uppercase tracking-wider">
                      Example {i + 1}
                    </span>
                    {ex.explanation && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-sans font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider animate-pulse">
                        has explanation
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-gray-500 font-sans font-semibold mb-1 text-[10px] uppercase tracking-wider">Input</div>
                      <pre className={`p-3 rounded-lg overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-[#151515] text-gray-300' : 'bg-slate-50 text-slate-800'}`}>
                        {ex.input}
                      </pre>
                    </div>

                    <div>
                      <div className="text-gray-500 font-sans font-semibold mb-1 text-[10px] uppercase tracking-wider">Output</div>
                      <pre className={`p-3 rounded-lg overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-[#151515] text-gray-300' : 'bg-slate-50 text-slate-800'}`}>
                        {ex.output || ex.expectedOutput}
                      </pre>
                    </div>

                    {ex.explanation && (
                      <div className={`p-3.5 rounded-lg border leading-relaxed font-sans text-[11px] ${
                        isDark ? 'bg-[#181510]/30 border-[#4a3e21]/20 text-gray-300' : 'bg-amber-50/50 border-amber-200/60 text-slate-700'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-[10px] text-amber-500 uppercase tracking-wider">
                          <span>💡</span> Explanation
                        </div>
                        <div className="italic">
                          {ex.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {question.constraints && (
            <div className="space-y-2">
              <h3 className={`text-sm font-bold tracking-tight uppercase ${textTitleClass}`}>Constraints</h3>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-gray-400 font-mono">
                {Array.isArray(question.constraints) ? (
                  question.constraints.map((c, i) => <li key={i}>{c}</li>)
                ) : (
                  <li>{question.constraints}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Panel (Right 58%) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar */}
        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isDark ? 'bg-[#0D0D0D] border-[#1E1E1E]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <LanguageSelect value={lang} onChange={setLang} />
          <div className="flex gap-2">
            <Button
              id="btn-run-code"
              variant="secondary"
              onClick={runCode}
              loading={loading}
              className="text-xs"
            >
              Run Code
            </Button>
            <Button
              onClick={submitCode}
              loading={loading}
              className="text-xs bg-violet-600 hover:bg-violet-700 text-white"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 overflow-hidden relative">
          <MonacoEditor
            value={currentCode}
            onChange={handleCodeChange}
            language={lang}
            isDark={isDark}
            onCursorChange={setCursor}
          />
        </div>

        {/* Status Bar */}
        <div className={`flex items-center justify-between px-4 py-1.5 border-t text-[11px] font-mono select-none ${
          isDark ? 'bg-[#0D0D0D] border-[#1E1E1E] text-gray-400' : 'bg-[#F8FAFC] border-[#E2E8F0] text-gray-500'
        }`}>
          <div>
            Ln {cursor.line}, Col {cursor.col}
          </div>
          {elapsedTime !== null && (
            <div>
              Roundtrip: <span className="font-semibold">{elapsedTime}ms</span>
            </div>
          )}
          <div>
            ⌨ Ctrl+Enter to run
          </div>
        </div>

        {/* Output Panel */}
        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          isDark={isDark}
          height={outputHeight}
          setHeight={setOutputHeight}
        />
      </div>
    </div>
  );
}