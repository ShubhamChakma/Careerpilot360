import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const features = [
  {
    icon: '⚔️',
    title: 'OA Arena',
    desc: 'Practice 100+ coding questions filtered by topic, difficulty, and company. Real test-case evaluation with a built-in Monaco editor.',
    path: '/oa-arena',
    tag: '100+ Problems',
  },
  {
    icon: '📚',
    title: 'Docs Hub',
    desc: 'AI-generated topic breakdowns across 30 CS concepts — with links to official documentation for deep dives.',
    path: '/docs',
    tag: '30 Topics',
  },
  {
    icon: '🎙️',
    title: 'Interview Studio',
    desc: 'Upload your resume and go through AI-powered mock interviews with real-time feedback reports.',
    path: '/interview',
    tag: 'AI Feedback',
  },
  {
    icon: '🔍',
    title: 'ATS Scanner',
    desc: "Score your resume across 8 ATS parameters. Know exactly what's missing before you apply.",
    path: '/ats-scanner',
    tag: '8 Parameters',
  },
  {
    icon: '🤖',
    title: 'Prep Bot',
    desc: 'A persistent AI chat assistant that helps you prep, explains concepts, and remembers your sessions.',
    path: '/prep-bot',
    tag: 'Persistent Memory',
  },
  {
    icon: '🎯',
    title: 'Job Predict',
    desc: 'Get 5 AI-matched job role predictions based on your resume — with match %, skill gaps, and a career roadmap.',
    path: '/job-predict',
    tag: 'New',
  },
];

const stats = [
  { value: '100+', label: 'Coding Problems' },
  { value: '30', label: 'CS Topic Guides' },
  { value: '8', label: 'ATS Parameters' },
  { value: '5', label: 'Role Predictions' },
];

function useTypewriter(words, speed = 80, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text === current) setTimeout(() => setIsDeleting(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

function ParticleCanvas({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(192,192,192,${p.opacity})` : `rgba(80,80,80,${p.opacity * 0.5})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

export default function Home() {
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();
  const typed = useTypewriter(['land your dream job.', 'ace every OA.', 'crush the ATS.', 'prep smarter.']);

  return (
    <div className="relative overflow-hidden">
      <ParticleCanvas isDark={isDark} />

      {/* HERO */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        {/* Eyebrow */}
        <div className="animate-fade-in delay-100 mb-6">
          <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${isDark ? 'border-[#2A2A2A] bg-[#141414] text-[#A8A8A8]' : 'border-[#D0D0D0] bg-white text-[#555]'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] animate-pulse" />
            AI-powered career preparation platform
          </span>
        </div>

        {/* Main headline */}
        <h1 className="animate-slide-up delay-200 font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight max-w-4xl">
          <span className={`block ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Everything you need to</span>
          <span className="block text-[#C0C0C0] glow-text min-h-[1.2em]">
            {typed}
            <span className="animate-pulse text-[#C0C0C0]/60">|</span>
          </span>
        </h1>

        <p className={`animate-fade-in delay-300 mt-6 text-base sm:text-lg max-w-2xl leading-relaxed ${isDark ? 'text-[#6B6B6B]' : 'text-[#777]'}`}>
          From coding practice to resume scanning, mock interviews to AI job matching — CareerPilot360 is the only platform you need to prepare for technical roles.
        </p>

        {/* CTA */}
        <div className="animate-fade-in delay-400 mt-10 flex flex-col sm:flex-row items-center gap-4">
          {user ? (
            <Link to="/oa-arena" className="btn-metal font-display font-semibold px-8 py-3.5 rounded-xl text-base">
              Go to Arena →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-metal font-display font-semibold px-8 py-3.5 rounded-xl text-base">
                Start for free →
              </Link>
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${isDark ? 'text-[#6B6B6B] hover:text-[#C0C0C0]' : 'text-[#777] hover:text-[#1A1A1A]'}`}
              >
                Already have an account?
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="animate-fade-in delay-500 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#C0C0C0]">{s.value}</span>
              <span className={`text-xs mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className={`font-display font-bold text-3xl sm:text-4xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
            Six tools. One mission.
          </h2>
          <p className={`mt-3 text-sm ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
            Built for serious candidates who want the edge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Link
              key={f.title}
              to={user ? f.path : '/register'}
              className={`metal-card rounded-xl p-6 group animate-slide-up`}
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{f.icon}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${isDark ? 'border-[#3A3A3A] text-[#6B6B6B] bg-[#141414]' : 'border-[#D0D0D0] text-[#999] bg-[#F5F5F5]'}`}>
                  {f.tag}
                </span>
              </div>
              <h3 className={`font-display font-semibold text-base mb-2 group-hover:text-[#C0C0C0] transition-colors ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[#4A4A4A]' : 'text-[#777]'}`}>{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-[#6B6B6B] group-hover:text-[#C0C0C0] transition-colors">
                Open {f.title}
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      {!user && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className={`metal-card rounded-2xl p-10 text-center`}>
            <h2 className={`font-display font-bold text-2xl sm:text-3xl mb-3 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
              Ready to get started?
            </h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-[#4A4A4A]' : 'text-[#777]'}`}>
              Free to use. No credit card. Just sign up and start preparing.
            </p>
            <Link to="/register" className="btn-metal font-display font-semibold px-8 py-3.5 rounded-xl text-base inline-block">
              Create your account →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}