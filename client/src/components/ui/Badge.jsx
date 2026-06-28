import React from 'react';

const colors = {
  easy: 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40',
  medium: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/40',
  hard: 'bg-red-900/40 text-red-400 border border-red-700/40',
  default: 'bg-[#1A1A1A] text-[#A8A8A8] border border-[#2A2A2A]',
  silver: 'bg-[#2A2A2A] text-[#C0C0C0] border border-[#3A3A3A]',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}