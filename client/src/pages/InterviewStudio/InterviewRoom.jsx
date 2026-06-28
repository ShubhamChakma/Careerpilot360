import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useResume } from '../../hooks/useResume';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import Button from '../../components/ui/Button';
import ResumeGate from './ResumeGate';
import InterviewCard from './InterviewCard';
import FeedbackReport from './FeedbackReport';
import api from '../../lib/api';

export default function InterviewRoom() {
  const { isDark } = useThemeStore();
  const { resume, fetchResume } = useResume();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const [bypassGate, setBypassGate] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const startTimeRef = useRef(null);

  useEffect(() => {
    fetchResume();
    api.get('/api/interview/templates')
      .then((res) => {
        setTemplates(res.data.templates || []);
        if (res.data.templates?.length > 0) {
          setSelectedTemplateId(res.data.templates[0].id);
        }
      })
      .catch(() => {});
  }, [fetchResume]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/interview/start', { templateId: selectedTemplateId || 'frontend-general' });
      setSessionId(res.data.sessionId);
      setMessages([{ role: 'assistant', content: res.data.message || res.data.firstMessage }]);
      setStarted(true);
      startTimeRef.current = Date.now();
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await api.post('/api/interview/message', { sessionId, message: text });
      setMessages((m) => [...m, { role: 'assistant', content: res.data.message || res.data.reply }]);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
      const res = await api.post('/api/interview/save', { sessionId, elapsedSeconds: elapsed });
      setFeedback(res.data.score);
      setStarted(false);
      setMessages([]);
      setSessionId(null);
    } catch (err) {
      setStarted(false);
      setMessages([]);
      setSessionId(null);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setFeedback(null);
    setStarted(false);
  };

  // 1. Show feedback report if complete
  if (feedback) {
    return <FeedbackReport report={feedback} onRestart={restart} isDark={isDark} />;
  }

  // 2. Show resume gate if no resume on file and not bypassed
  const hasResume = resume && (resume.fileName || resume.rawText);
  if (!hasResume && !bypassGate) {
    return <ResumeGate onProceedGeneric={() => setBypassGate(true)} isDark={isDark} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-64px-80px)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Interview Studio</h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>AI-powered mock interviews with real-time feedback</p>
        </div>
        {started && (
          <Button variant="danger" onClick={endInterview} loading={loading}>
            End & Evaluate Session
          </Button>
        )}
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col overflow-y-auto pr-2 gap-6">
          <div className="metal-card rounded-2xl p-6 text-center max-w-xl mx-auto">
            <span className="text-3xl block mb-2">🎙️</span>
            <h2 className={`font-display font-semibold text-lg mb-1 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Select Interview Template
            </h2>
            <p className={`text-xs mb-4 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
              Choose a specific role focus. The interviewer will align questions with this topic.
            </p>
            <Button onClick={startInterview} loading={loading} className="w-full justify-center">
              Start Selected Mock Interview
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((t) => (
              <InterviewCard
                key={t.id}
                template={t}
                active={selectedTemplateId === t.id}
                onSelect={setSelectedTemplateId}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden">
            <ChatWindow messages={messages} loading={loading} isDark={isDark} />
          </div>
          <div className="mt-4">
            <ChatInput onSend={sendMessage} loading={loading} isDark={isDark} />
          </div>
        </>
      )}
    </div>
  );
}