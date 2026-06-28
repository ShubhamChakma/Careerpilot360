import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

export default function Footer() {
  const { isDark } = useThemeStore();
  return (
    <footer className={`border-t ${isDark ? 'border-[#1A1A1A] bg-[#0D0D0D]' : 'border-[#D0D0D0] bg-[#F5F5F5]'} py-8 mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-[#C0C0C0]">CareerPilot360</span>
          <span className={`text-xs ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>— Your launchpad to landing the job</span>
        </div>
        <div className="flex items-center gap-6">
          {['/oa-arena', '/docs', '/interview', '/ats-scanner', '/prep-bot'].map((path, i) => {
            const labels = ['OA Arena', 'Docs', 'Interview', 'ATS', 'Bot'];
            return (
              <Link key={path} to={path} className={`text-xs transition-colors ${isDark ? 'text-[#4A4A4A] hover:text-[#A8A8A8]' : 'text-[#999] hover:text-[#333]'}`}>
                {labels[i]}
              </Link>
            );
          })}
        </div>
        <p className={`text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#B0B0B0]'}`}>© 2025 CareerPilot360</p>
      </div>
    </footer>
  );
}