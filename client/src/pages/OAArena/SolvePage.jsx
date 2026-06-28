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

  const startTimeRef = useRef(null);

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
          {question.examples && question.examples.length > 0 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-bold tracking-tight ${textTitleClass}`}>Examples</h3>
              {question.examples.map((ex, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border text-xs font-mono transition-colors ${
                    isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="text-[10px] text-violet-500 font-semibold mb-2 uppercase tracking-wider">
                    Example {i + 1}
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-500">Input:</span>{' '}
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Output:</span>{' '}
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="mt-2 text-gray-400 italic text-[11px]">
                        Explanation: {ex.explanation}
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
              <h3 className={`text-sm font-bold tracking-tight ${textTitleClass}`}>Constraints</h3>
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