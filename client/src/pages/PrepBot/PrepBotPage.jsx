import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useChat } from '../../hooks/useChat';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInput from '../../components/chat/ChatInput';
import Button from '../../components/ui/Button';

export default function PrepBotPage() {
  const { isDark } = useThemeStore();
  const { messages, sendMessage, loading, createNewSession } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-64px-80px)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Prep Bot</h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>AI assistant with persistent session memory</p>
        </div>
        <Button variant="secondary" onClick={createNewSession} className="text-xs">New session</Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} isDark={isDark} />
        <div ref={bottomRef} />
      </div>

      <div className="mt-4">
        <ChatInput onSend={sendMessage} loading={loading} isDark={isDark} />
      </div>
    </div>
  );
}