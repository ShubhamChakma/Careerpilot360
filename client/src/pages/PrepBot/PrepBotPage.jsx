import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useChat } from '../../hooks/useChat';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

export default function PrepBotPage() {
  const { isDark } = useThemeStore();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const {
    messages,
    sendMessage,
    retryMessage,
    loading,
    error,
    createNewSession
  } = useChat(activeSessionId);

  const bottomRef = useRef(null);

  const loadSessions = async () => {
    try {
      const res = await api.get('/chat-sessions');
      const list = res.data.data || [];
      setSessions(list);
      if (list.length > 0 && !activeSessionId) {
        setActiveSessionId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to load chat sessions:', err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewSession = async () => {
    try {
      const newId = await createNewSession();
      setActiveSessionId(newId);
      await loadSessions();
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat-sessions/${id}`);
      if (activeSessionId === id) {
        setActiveSessionId(null);
      }
      await loadSessions();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px-80px)] flex gap-6">
      
      {/* Sessions Sidebar */}
      <div className={`hidden md:flex flex-col w-64 shrink-0 rounded-2xl p-4 border ${
        isDark ? 'bg-[#111] border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-bold text-sm ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Chat Sessions
          </h3>
          <button
            onClick={handleNewSession}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {sessions.map((s) => {
            const isActive = activeSessionId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isActive
                    ? isDark
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-100 text-zinc-900 font-semibold'
                    : isDark
                    ? 'hover:bg-zinc-900/50 text-[#888] hover:text-[#bbb]'
                    : 'hover:bg-zinc-50 text-[#666] hover:text-[#333]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>💬</span>
                  <span className="truncate">{s.title || 'Untitled Session'}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-[#999] hover:text-red-400 text-[10px] transition-opacity"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <p className="text-[11px] text-zinc-500 text-center py-6">No previous chats.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Prep Bot
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
              AI assistant with persistent session memory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleNewSession} className="text-xs md:hidden">
              New Chat
            </Button>
          </div>
        </div>

        {/* Chat Window Container */}
        <div className={`flex-1 overflow-hidden border rounded-2xl p-4 flex flex-col justify-between ${
          isDark ? 'bg-[#111]/30 border-[#2A2A2A]' : 'bg-white border-[#D0D0D0]'
        }`}>
          <div className="flex-1 overflow-hidden">
            <ChatWindow messages={messages} loading={loading} isDark={isDark} />
            <div ref={bottomRef} />
          </div>

          {/* Error Banner with Retry button */}
          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-950/20 border border-red-900/30 flex items-center justify-between text-xs text-red-400">
              <span>{error}</span>
              <button
                onClick={retryMessage}
                className="font-bold text-white px-2 py-0.5 rounded bg-red-900/40 hover:bg-red-900/60"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="mt-4">
          <ChatInput onSend={sendMessage} loading={loading} isDark={isDark} />
        </div>
      </div>

    </div>
  );
}