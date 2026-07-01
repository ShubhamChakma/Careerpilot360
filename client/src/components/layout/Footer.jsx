import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

export default function Footer() {
  const { isDark } = useThemeStore();

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark 
        ? 'border-zinc-900 bg-[#080808] text-zinc-400' 
        : 'border-zinc-200 bg-[#fafafa] text-zinc-600'
    } pt-16 pb-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className={`font-display font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                CareerPilot<span className="text-zinc-500">360</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Your ultimate companion for technical prep, resume scanning, mock interviews, and personalized career roadmaps. Built with next-gen AI.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {/* GitHub */}
              <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
              {/* Twitter / X */}
              <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform Columns */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Platform Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: '⚔️ OA Arena', path: '/oa-arena' },
                { label: '📚 Docs Hub', path: '/docs' },
                { label: '🎙️ Interview Studio', path: '/interview' },
                { label: '🔍 ATS Scanner', path: '/ats-scanner' },
                { label: '🤖 Prep Bot', path: '/prep-bot' },
                { label: '🎯 Job Predict', path: '/job-predict' }
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers Column */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Developers
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Pawan', url: 'https://github.com/Pawankumar1188' },
                { name: 'Shivam', url: 'https://github.com/Shivam17-ai' },
                { name: 'Shubham Chakma', url: 'https://github.com/ShubhamChakma' }
              ].map((dev) => (
                <li key={dev.name}>
                  <a 
                    href={dev.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center gap-2 transition-colors ${
                      isDark ? 'hover:text-white text-zinc-400' : 'hover:text-zinc-950 text-zinc-600'
                    }`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                    <span>{dev.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback Column */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Help & Support
            </h4>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/20 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} space-y-3`}>
              <p className="text-xs leading-relaxed">
                Spotted a bug or have an idea to make CareerPilot360 even better? Let us know!
              </p>
              <Link 
                to="/feedback"
                className={`inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'bg-zinc-100 text-black hover:bg-white' 
                    : 'bg-zinc-900 text-white hover:bg-black'
                }`}
              >
                💬 Submit Feedback
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-[1px] w-full ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} CareerPilot360. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/feedback" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>Feedback Form</Link>
            <span>•</span>
            <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>Privacy Policy</a>
            <span>•</span>
            <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}