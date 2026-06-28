import React from 'react';

export default function TagFilter({ tags, activeTag, onChange, isDark }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
            activeTag === tag
              ? 'border-[#C0C0C0] text-[#C0C0C0] bg-[#C0C0C0]/10'
              : isDark
              ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-[#3A3A3A]'
              : 'border-[#D0D0D0] text-[#999] hover:border-[#A0A0A0]'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
