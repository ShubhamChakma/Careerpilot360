import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../firebase/auth';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@careerpilot360.dev',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true,
  isDemo: true,
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.includes('user-not-found') ? 'No account with that email.' : 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try { await loginWithGoogle(); navigate('/'); }
    catch (err) { setError('Google sign-in failed.'); }
  };

  const handleDemoLogin = () => {
    setUser(DEMO_USER);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Welcome back</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Sign in to CareerPilot360</p>
        </div>

        {/* ── Demo mode banner ── */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-xs font-medium cursor-pointer select-none transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ff9a00 0%, #ff6500 100%)', color: '#fff' }}
          onClick={handleDemoLogin}
          id="demo-login-banner"
        >
          <span style={{ fontSize: '1.1em' }}>⚡</span>
          <span className="flex-1">Try Demo — access all pages instantly, no account needed</span>
          <span className="bg-white/20 rounded-md px-2 py-0.5">Demo</span>
        </div>

        <div className="metal-card rounded-2xl p-6">
          <button
            onClick={handleGoogle}
            className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border text-sm font-medium transition-all mb-5 ${isDark ? 'border-[#2A2A2A] text-[#A8A8A8] hover:border-[#3A3A3A] hover:text-[#E8E8E8]' : 'border-[#D0D0D0] text-[#555] hover:border-[#999]'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className={`flex items-center gap-3 mb-5 text-xs ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>
            <div className={`flex-1 h-px ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#D0D0D0]'}`} />
            or
            <div className={`flex-1 h-px ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#D0D0D0]'}`} />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" loading={loading} className="w-full justify-center mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className={`text-center text-xs mt-5 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
          No account?{' '}
          <Link to="/register" className="text-[#C0C0C0] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}