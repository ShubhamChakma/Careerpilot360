import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { logout } from '../../firebase/auth';

const navItems = [
  { to: '/oa-arena', label: 'OA Arena' },
  { to: '/docs', label: 'Docs Hub' },
  { to: '/interview', label: 'Interview Studio' },
  { to: '/ats-scanner', label: 'ATS Scanner' },
  { to: '/prep-bot', label: 'Prep Bot' },
  { to: '/job-predict', label: 'Job Predict' },
];

export default function Navbar() {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (user?.isDemo) {
      // Demo mode: just clear the store, no Firebase call needed
      useAuthStore.getState().clearUser();
    } else {
      await logout();
    }
    navigate('/');
  };


  return (
    <nav className={`sticky top-0 z-40 border-b ${isDark ? 'bg-[#0D0D0D]/90 border-[#1E1E1E]' : 'bg-white/90 border-[#D0D0D0]'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3A3A3A] to-[#1A1A1A] border border-[#C0C0C0]/30 flex items-center justify-center group-hover:border-[#C0C0C0]/70 transition-all">
              <span className="text-[#C0C0C0] font-bold text-sm font-display">CP</span>
            </div>
            <span className={`font-display font-semibold text-base ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Career<span className="text-[#C0C0C0]">Pilot</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#C0C0C0]/10 text-[#C0C0C0] border border-[#C0C0C0]/20'
                        : isDark
                        ? 'text-[#6B6B6B] hover:text-[#A8A8A8] hover:bg-[#1A1A1A]'
                        : 'text-[#555] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle — GitHub style */}
            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C0C0C0]/30 ${
                isDark ? 'bg-[#2A2A2A]' : 'bg-[#D0D0D0]'
              }`}
              aria-label="Toggle theme"
            >
              <span
                className={`absolute w-5 h-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                  isDark ? 'translate-x-6 bg-[#C0C0C0]' : 'translate-x-0.5 bg-white border border-[#B0B0B0]'
                }`}
              >
                {isDark ? (
                  <svg className="w-3 h-3 text-[#0D0D0D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.isDemo ? (
                  // Demo user badge
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10">
                    <span style={{ fontSize: '0.75rem' }}>⚡</span>
                    <span className="text-xs font-semibold text-orange-400">Demo Mode</span>
                  </div>
                ) : (
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-[#D0D0D0] bg-[#F5F5F5]'}`}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#6B6B6B] flex items-center justify-center">
                      <span className="text-[0.6rem] font-bold text-[#0D0D0D]">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${isDark ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-red-700/50 hover:text-red-400' : 'border-[#D0D0D0] text-[#777] hover:border-red-400 hover:text-red-500'}`}
                >
                  {user.isDemo ? 'Exit Demo' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`text-xs px-3 py-1.5 rounded-lg transition-all ${isDark ? 'text-[#A8A8A8] hover:text-[#E8E8E8]' : 'text-[#555] hover:text-[#1A1A1A]'}`}>
                  Sign in
                </Link>
                <Link to="/register" className="btn-metal text-xs px-4 py-1.5 rounded-lg">
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                className="md:hidden text-[#6B6B6B] hover:text-[#C0C0C0] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && user && (
          <div className={`md:hidden border-t ${isDark ? 'border-[#1E1E1E]' : 'border-[#D0D0D0]'} py-3 animate-fade-in`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm transition-all ${
                    isActive ? 'text-[#C0C0C0] bg-[#C0C0C0]/5' : isDark ? 'text-[#6B6B6B] hover:text-[#A8A8A8]' : 'text-[#555] hover:text-[#1A1A1A]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}