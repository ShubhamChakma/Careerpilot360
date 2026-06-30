import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useResume } from '../../hooks/useResume';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import Button from '../../components/ui/Button';
import ResumeUploader from '../../components/resume/ResumeUploader';
import FeedbackReport from './FeedbackReport';
import api from '../../lib/api';

const STANDARD_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'ML Engineer',
  'Data Scientist',
  'Cyber Security Analyst',
  'Android Developer',
  'Product Manager',
  'UI/UX Designer'
];

export default function InterviewRoom() {
  const { isDark } = useThemeStore();
  const { resume, fetchResume, scanResume } = useResume();
  
  // Selection States
  const [option, setOption] = useState(null); // 'resume' or 'generic'
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  
  // Resume uploading states
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [useExisting, setUseExisting] = useState(true);

  // Chat/Session states
  const [messages, setMessages] = useState([]);
  const [currentTips, setCurrentTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  useEffect(() => {
    if (resume && (resume.fileName || resume.resumeText)) {
      setUseExisting(true);
    } else {
      setUseExisting(false);
    }
  }, [resume]);

  const handleStartInterview = async () => {
    setLoading(true);
    setApiError(null);

    let finalResumeText = '';
    const finalJobTitle = jobTitle === 'custom' ? customJobTitle : jobTitle;

    try {
      // 1. If using Option 1 (Resume) and uploading a new file
      if (option === 'resume' && !useExisting && file) {
        setUploadingResume(true);
        try {
          // Perform a fast scan to extract and parse the resume
          await scanResume(file, `Mock technical interview for ${finalJobTitle}`);
          finalResumeText = resume?.resumeText || '';
        } catch (uploadErr) {
          throw new Error('Failed to parse and upload resume. Please try another file.');
        } finally {
          setUploadingResume(false);
        }
      } else if (option === 'resume' && useExisting) {
        finalResumeText = resume?.resumeText || '';
      }

      // 2. Trigger start API on the backend
      const res = await api.post('/interview/start', {
        jobTitle: finalJobTitle,
        experienceLevel,
        resumeText: finalResumeText
      });

      const { id, question, tips, currentQuestionIndex } = res.data.data;
      setSessionId(id);
      setMessages([{ role: 'assistant', content: question }]);
      setCurrentTips(tips || '');
      setCurrentIdx(currentQuestionIndex || 0);
      setStarted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to start mock interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    setApiError(null);
    try {
      const res = await api.post('/interview/submit-answer', {
        sessionId,
        answer: text
      });

      const { completed, nextQuestion, nextQuestionTips, currentQuestionIndex, score } = res.data.data;
      
      if (completed) {
        setFeedback(score);
        setStarted(false);
        setMessages([]);
        setSessionId(null);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: nextQuestion }]);
        setCurrentTips(nextQuestionTips || '');
        setCurrentIdx(currentQuestionIndex || 0);
      }
    } catch (err) {
      setApiError('Failed to submit answer. Please retry your message.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await api.post('/interview/save', { sessionId });
      const score = res.data.data?.score || res.data.score;
      setFeedback(score);
      setStarted(false);
      setMessages([]);
      setSessionId(null);
    } catch (err) {
      setApiError('Failed to finalize interview evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setFeedback(null);
    setStarted(false);
    setOption(null);
    setFile(null);
    fetchResume();
  };

  // 1. Show feedback report if complete
  if (feedback) {
    return <FeedbackReport report={feedback} onRestart={restart} isDark={isDark} />;
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col ${
      started ? 'h-[calc(100vh-64px-80px)] overflow-hidden' : 'min-h-[calc(100vh-64px-80px)] pb-12'
    }`}>
      <div className="flex items-center justify-between mb-5 no-print">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Interview Studio
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
            AI-powered mock technical interviews with real-time evaluation
          </p>
        </div>
        {started && (
          <Button variant="danger" onClick={handleEndInterview} loading={loading}>
            End & Evaluate early
          </Button>
        )}
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col overflow-y-auto pr-2 justify-center max-w-2xl mx-auto w-full gap-6">
          
          {option === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {/* Option 1: Resume-based */}
              <div
                onClick={() => setOption('resume')}
                className={`metal-card rounded-2xl p-6 text-center cursor-pointer transition-all border hover:border-zinc-500/50 ${
                  isDark ? 'bg-[#111]/40 border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
                }`}
              >
                <span className="text-4xl block mb-3">📄</span>
                <h3 className={`font-display font-semibold text-base mb-1 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                  Interview using Resume
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#6B6B6B]' : 'text-[#888]'}`}>
                  Generates highly personalized questions based on the skills, frameworks, and projects listed on your resume.
                </p>
              </div>

              {/* Option 2: Generic */}
              <div
                onClick={() => setOption('generic')}
                className={`metal-card rounded-2xl p-6 text-center cursor-pointer transition-all border hover:border-zinc-500/50 ${
                  isDark ? 'bg-[#111]/40 border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
                }`}
              >
                <span className="text-4xl block mb-3">🎙️</span>
                <h3 className={`font-display font-semibold text-base mb-1 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                  Generic Profile Interview
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#6B6B6B]' : 'text-[#888]'}`}>
                  No resume required. Prepare by selecting any target software engineering or product management role.
                </p>
              </div>
            </div>
          ) : (
            <div className={`metal-card rounded-2xl p-6 border ${
              isDark ? 'bg-[#111]/40 border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
            }`}>
              <button
                onClick={() => setOption(null)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-4 flex items-center gap-1"
              >
                ← Back to options
              </button>

              <h2 className={`font-display font-semibold text-lg mb-4 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                {option === 'resume' ? 'Setup Resume Interview' : 'Setup Generic Interview'}
              </h2>

              {/* Resume Selection */}
              {option === 'resume' && (
                <div className="mb-5">
                  {resume && (resume.fileName || resume.resumeText) && useExisting ? (
                    <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                      isDark ? 'bg-[#1a1a1a] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">📄</span>
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">Using resume: {resume.fileName || 'Active Resume'}</p>
                          <p className="text-[10px] text-zinc-500">Auto-detected from ATS Scanner</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUseExisting(false)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold shrink-0"
                      >
                        Upload Another
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold mb-2">Upload Resume (PDF, DOCX, DOC)</label>
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
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold mt-1"
                        >
                          Use previously uploaded resume
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Role selection */}
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1.5">What role are you preparing for?</label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className={`w-full rounded-xl p-3 text-xs border outline-none ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-850'
                  }`}
                >
                  {STANDARD_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="custom">-- Other (Specify) --</option>
                </select>
              </div>

              {jobTitle === 'custom' && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5">Enter Custom Job Role</label>
                  <input
                    type="text"
                    value={customJobTitle}
                    onChange={(e) => setCustomJobTitle(e.target.value)}
                    placeholder="e.g. Embedded Firmware Engineer"
                    className={`w-full rounded-xl p-3 text-xs border outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-850'
                    }`}
                  />
                </div>
              )}

              {/* Experience level selection */}
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1.5">Experience Level</label>
                <div className="flex gap-3">
                  {['Entry-Level', 'Mid-Level', 'Senior-Level'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        experienceLevel === lvl
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : isDark
                          ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {apiError && (
                <p className="text-red-400 text-xs mb-4">⚠️ {apiError}</p>
              )}

              <Button
                onClick={handleStartInterview}
                loading={loading || uploadingResume}
                disabled={(option === 'resume' && !useExisting && !file) || (jobTitle === 'custom' && !customJobTitle.trim())}
                className="w-full justify-center"
              >
                {uploadingResume ? 'Uploading & Parsing Resume...' : loading ? 'Starting Mock Interview...' : 'Start Mock Technical Interview'}
              </Button>

            </div>
          )}

        </div>
      ) : (
        <div className="flex-1 flex gap-6 h-[calc(100vh-64px-160px)] min-h-0">
          
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-semibold text-indigo-400">
                Question {currentIdx + 1} of 5
              </span>
              <span className="text-[10px] text-zinc-500">
                Topics: HR, Technical, STAR Behavioral, Problem Solving
              </span>
            </div>

            {/* Chat window */}
            <div className={`flex-1 overflow-hidden border rounded-2xl p-4 flex flex-col justify-between ${
              isDark ? 'bg-[#111]/30 border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
            }`}>
              <div className="flex-1 overflow-hidden">
                <ChatWindow messages={messages} loading={loading} isDark={isDark} />
              </div>
              
              {apiError && (
                <div className="mt-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl">
                  {apiError}
                </div>
              )}
            </div>

            <div className="mt-4">
              <ChatInput onSend={handleSendMessage} loading={loading} isDark={isDark} />
            </div>
          </div>

          {/* Sidebar with Tips */}
          {currentTips && (
            <div className={`hidden lg:flex flex-col w-72 shrink-0 rounded-2xl p-5 border overflow-y-auto ${
              isDark ? 'bg-[#111] border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💡</span>
                <h3 className={`font-display font-bold text-xs uppercase tracking-wider ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                  Interviewer Tips & Hint
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
                {currentTips}
              </p>

              <div className="mt-auto pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 leading-normal">
                <p className="font-semibold mb-1 text-zinc-400">💡 Performance advice</p>
                Explain your thought process step-by-step. Focus on metrics where possible, and outline architecture choices in detail.
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}