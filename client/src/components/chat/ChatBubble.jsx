import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatBubble({ message, isDark }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
        isUser
          ? 'bg-[#C0C0C0]/15 text-[#E8E8E8] border-[#C0C0C0]/20 rounded-tr-none'
          : isDark
          ? 'bg-[#1A1A1A] text-[#E8E8E8] border-[#2A2A2A] rounded-tl-none'
          : 'bg-white text-[#333] border-[#D0D0D0] rounded-tl-none'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-2 rounded-lg overflow-hidden border border-zinc-800 text-xs">
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
                    <code className="bg-zinc-800/50 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}