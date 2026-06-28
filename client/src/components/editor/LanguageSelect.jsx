import React from 'react';
import { useThemeStore } from '../../store/themeStore';

const LANGS = [
  { value: 'python',     label: 'Python',      icon: '🐍' },
  { value: 'javascript', label: 'JavaScript',   icon: '🟨' },
  { value: 'java',       label: 'Java',         icon: '☕' },
  { value: 'cpp',        label: 'C++',          icon: '⚡' },
  { value: 'c',          label: 'C',            icon: '🔵' },
];

export default function LanguageSelect({ value, onChange }) {
  const { isDark } = useThemeStore();
  const current = LANGS.find((l) => l.value === value) || LANGS[0];

  return (
    <div className="relative flex items-center">
      <span className="absolute left-2.5 text-xs pointer-events-none select-none z-10">
        {current.icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-8 pr-7 py-1.5 text-xs rounded-lg border appearance-none cursor-pointer font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#C0C0C0]/30 ${
          isDark
            ? 'bg-[#141414] border-[#2A2A2A] text-[#C0C0C0] hover:border-[#3A3A3A]'
            : 'bg-white border-[#D0D0D0] text-[#333] hover:border-[#999]'
        }`}
        style={{ minWidth: 130 }}
      >
        {LANGS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
      {/* dropdown chevron */}
      <svg
        className="absolute right-2 w-3 h-3 pointer-events-none"
        style={{ color: isDark ? '#6B6B6B' : '#999' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export { LANGS };