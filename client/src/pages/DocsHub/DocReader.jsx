import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import api from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DocReader() {
  const { slug } = useParams();
  const { isDark } = useThemeStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[DocReader] Loading topic guide for: ${slug}`);
      const res = await api.get(`/docs/${slug}`);
      const payload = res.data?.data || res.data;
      
      setTitle(payload.title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      setContent(payload.content || '');
    } catch (err) {
      console.error('[DocReader] Failed to load topic guide:', err);
      const friendlyMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Connection timed out. Please try again.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      <Link
        to="/docs"
        className={`inline-flex items-center gap-1.5 text-xs mb-6 font-semibold transition-colors ${
          isDark ? 'text-zinc-500 hover:text-indigo-400' : 'text-zinc-400 hover:text-indigo-600'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Docs Hub
      </Link>

      {loading ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" />
            <p className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
              AI is compiling optimized coding solutions and revision notes...
            </p>
          </div>
          <div className={`h-8 w-1/3 rounded animate-pulse ${isDark ? 'bg-zinc-900' : 'bg-gray-200'}`} />
          <div className={`h-48 rounded animate-pulse ${isDark ? 'bg-zinc-900' : 'bg-gray-200'}`} />
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/30 text-center space-y-3">
          <p className="text-red-400 text-sm font-semibold">⚠️ {error}</p>
          <button
            onClick={fetchTopic}
            className="px-4 py-2 text-xs font-semibold bg-red-900/30 text-white border border-red-900/40 rounded-xl hover:bg-red-900/50"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className={`metal-card rounded-2xl p-6 sm:p-10 border ${
          isDark ? 'bg-[#111]/30 border-zinc-800' : 'bg-white border-zinc-300'
        }`}>
          <h1 className={`font-display font-bold text-2xl sm:text-3xl mb-6 ${
            isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'
          }`}>
            {title}
          </h1>

          <div className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${
            isDark ? 'text-[#A8A8A8]' : 'text-[#4A4A4A]'
          }`}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-3 rounded-xl overflow-hidden border border-zinc-800/80 text-xs">
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-zinc-800/60 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                h2: ({ children }) => <h2 className="text-base font-bold text-zinc-300 mt-6 mb-2.5 pb-1.5 border-b border-zinc-800">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-zinc-400 mt-4 mb-2">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-sm">{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 my-3 bg-zinc-950/20 rounded text-zinc-400 italic">
                    {children}
                  </blockquote>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}