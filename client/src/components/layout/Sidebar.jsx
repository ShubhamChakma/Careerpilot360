import React from 'react';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

export default function Sidebar({ items }) {
  const { isDark } = useThemeStore();
  return (
    <aside className={`w-56 flex-shrink-0 border-r ${isDark ? 'border-[#1E1E1E] bg-[#0D0D0D]' : 'border-[#D0D0D0] bg-white'} py-4 px-3 flex flex-col gap-1`}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive
                ? 'bg-[#C0C0C0]/10 text-[#C0C0C0] border border-[#C0C0C0]/15'
                : isDark
                ? 'text-[#6B6B6B] hover:text-[#A8A8A8] hover:bg-[#141414]'
                : 'text-[#555] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]'
            }`
          }
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
}