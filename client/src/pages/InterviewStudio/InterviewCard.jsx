import React from 'react';
import Badge from '../../components/ui/Badge';

export default function InterviewCard({ template, onSelect, active, isDark }) {
  return (
    <div
      onClick={() => onSelect(template.id)}
      className={`metal-card rounded-xl p-5 cursor-pointer transition-all border ${
        active
          ? 'border-[#C0C0C0] bg-[#C0C0C0]/5 shadow-sm'
          : isDark
          ? 'border-[#2A2A2A] hover:border-[#3A3A3A]'
          : 'border-[#D0D0D0] hover:border-[#A0A0A0]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant={template.difficulty === 'Senior' ? 'hard' : template.difficulty === 'Mid' ? 'medium' : 'easy'}>
          {template.difficulty}
        </Badge>
        <span className={`text-[10px] font-semibold tracking-wider ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
          {template.role}
        </span>
      </div>
      <h3 className={`font-display font-semibold text-base mb-2 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
        {template.title}
      </h3>
      <div className="flex flex-wrap gap-1 mt-3">
        {template.focus?.map((f) => (
          <span
            key={f}
            className={`text-[9px] px-1.5 py-0.5 rounded border ${
              isDark ? 'border-[#1E1E1E] bg-[#141414] text-[#6B6B6B]' : 'border-[#E0E0E0] bg-[#F5F5F5] text-[#999]'
            }`}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
