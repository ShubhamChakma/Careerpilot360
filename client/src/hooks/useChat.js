import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';
import { getChatSession, saveChatSession } from '../firebase/firestore';
import { useAuthStore } from '../store/authStore';

export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const user = useAuthStore((s) => s.user);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!sessionId) return;
    getChatSession(sessionId).then((session) => {
      if (session?.messages) setMessages(session.messages);
    });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || messages.length === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveChatSession(sessionId, { messages, userId: user?.uid });
    }, 1000);
    return () => clearTimeout(saveTimer.current);
  }, [messages, sessionId, user?.uid]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;
      const userMsg = { role: 'user', content: text, timestamp: Date.now() };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInputValue('');
      setLoading(true);

      try {
        const { data } = await api.post('/api/ai/chat', {
          messages: updated,
          sessionId,
        });
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content, timestamp: Date.now() },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, sessionId]
  );

  const createNewSession = useCallback(async () => {
    const { data } = await api.post('/api/chat-sessions', { title: 'New Chat' });
    setMessages([]);
    return data.id;
  }, []);

  return { messages, sendMessage, loading, inputValue, setInputValue, createNewSession };
}
