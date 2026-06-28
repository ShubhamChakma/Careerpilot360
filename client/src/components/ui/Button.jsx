import React from 'react';

const variants = {
  primary: 'btn-metal font-medium px-5 py-2.5 rounded-lg text-sm',
  secondary: 'bg-transparent border border-[#2A2A2A] text-[#A8A8A8] hover:border-[#C0C0C0] hover:text-[#E8E8E8] px-5 py-2.5 rounded-lg text-sm transition-all duration-200',
  ghost: 'bg-transparent text-[#A8A8A8] hover:text-[#E8E8E8] hover:bg-[#1A1A1A] px-4 py-2 rounded-lg text-sm transition-all duration-200',
  danger: 'bg-red-900/30 border border-red-700/50 text-red-400 hover:bg-red-800/40 px-5 py-2.5 rounded-lg text-sm transition-all duration-200',
};

export default function Button({ children, variant = 'primary', className = '', loading = false, disabled = false, ...props }) {
  return (
    <button
      className={`${variants[variant]} ${className} ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} inline-flex items-center gap-2`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}