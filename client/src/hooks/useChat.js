import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';
import { getChatSession, saveChatSession } from '../firebase/firestore';
import { useAuthStore } from '../store/authStore';

export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const user = useAuthStore((s) => s.user);
  const saveTimer = useRef(null);
  const lastUserMessageRef = useRef('');

  useEffect(() => {
    if (!sessionId) return;
    getChatSession(sessionId).then((session) => {
      if (session?.messages) {
        setMessages(session.messages);
      } else {
        // Welcoming message if session is empty
        setMessages([
          {
            role: 'assistant',
            content: 'Hello! I am PrepBot, your AI study companion. Ask me anything about programming, DSA, roadmaps, system design, or interview preparation!',
            timestamp: Date.now()
          }
        ]);
      }
    });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || messages.length <= 1) return; // don't auto-save if only welcome message exists
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveChatSession(sessionId, { messages, userId: user?.uid });
    }, 1000);
    return () => clearTimeout(saveTimer.current);
  }, [messages, sessionId, user?.uid]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;
      
      const userMsg = { role: 'user', content: text, timestamp: Date.now() };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInputValue('');
      setLoading(true);
      setError(null);
      lastUserMessageRef.current = text;

      try {
        const sanitized = updated.map(({ role, content }) => ({ role, content }));
        const res = await api.post('/ai/chat', {
          messages: sanitized,
          sessionId,
        });

        const reply = res.data?.content || res.data?.reply || res.data?.data?.reply || 'Received an empty response from PrepBot.';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply, timestamp: Date.now() },
        ]);
      } catch (err) {
        const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Connection timed out or network error. Please try again.';
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Failed to get response: ${errMsg}. Please click Retry above the input.`,
            timestamp: Date.now(),
            isError: true
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, sessionId, loading]
  );

  const retryMessage = useCallback(async () => {
    if (!lastUserMessageRef.current || loading) return;
    
    // Clean up previous error message bubble if any
    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1]?.isError) {
        copy.pop(); // remove error assistant bubble
      }
      if (copy[copy.length - 1]?.role === 'user' && copy[copy.length - 1]?.content === lastUserMessageRef.current) {
        copy.pop(); // remove user duplicate bubble because sendMessage will re-add it
      }
      return copy;
    });

    await sendMessage(lastUserMessageRef.current);
  }, [sendMessage, loading]);

  const createNewSession = useCallback(async () => {
    const { data } = await api.post('/chat-sessions', { title: 'New Chat' });
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I am PrepBot, your AI study companion. Ask me anything about programming, DSA, roadmaps, system design, or interview preparation!',
        timestamp: Date.now()
      }
    ]);
    return data.data?.id || data.id;
  }, []);

  return { messages, sendMessage, retryMessage, loading, error, inputValue, setInputValue, createNewSession };
}
