import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

/* ─── helpers ─────────────────────────────────────────────────── */
function verdictMeta(verdict) {
  switch (verdict) {
    case 'Accepted':
      return { label: 'Accepted', dot: 'bg-emerald-500', text: 'text-emerald-400', ring: 'border-emerald-500/30 bg-emerald-500/5' };
    case 'Wrong Answer':
      return { label: 'Wrong Answer', dot: 'bg-red-500', text: 'text-red-400', ring: 'border-red-500/30 bg-red-500/5' };
    case 'Time Limit Exceeded':
      return { label: 'TLE', dot: 'bg-amber-500', text: 'text-amber-400', ring: 'border-amber-500/30 bg-amber-500/5' };
    case 'Runtime Error':
      return { label: 'Runtime Error', dot: 'bg-orange-500', text: 'text-orange-400', ring: 'border-orange-500/30 bg-orange-500/5' };
    case 'Compile Error':
      return { label: 'Compile Error', dot: 'bg-pink-500', text: 'text-pink-400', ring: 'border-pink-500/30 bg-pink-500/5' };
    default:
      return { label: verdict || '—', dot: 'bg-gray-500', text: 'text-gray-400', ring: 'border-gray-500/30 bg-gray-500/5' };
  }
}

function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-2xl font-black font-display ${accent}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-gray-500">{label}</span>
    </div>
  );
}

const FILTERS = ['all', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error'];

/* ─── component ───────────────────────────────────────────────── */
export default function SubmissionsPage() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(null);
  const [filter, setFilter]           = useState('all');
  const [lastRefresh, setLastRefresh] = useState(null);

  /* ── fetch via backend API (bypasses adblockers & Firestore rules) ── */
  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/submissions');
      if (data.success) {
        setSubmissions(data.submissions || []);
        setFetchError(null);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error('[Submissions] fetch error:', err.message);
      setFetchError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* initial load */
  useEffect(() => {
    setLoading(true);
    fetchSubmissions();
  }, [fetchSubmissions]);

  /* auto-refresh every 5 seconds so new submissions appear without a page reload */
  useEffect(() => {
    const interval = setInterval(fetchSubmissions, 5000);
    return () => clearInterval(interval);
  }, [fetchSubmissions]);

  /* derived stats */
  const total    = submissions.length;
  const accepted = submissions.filter((s) => s.verdict === 'Accepted').length;
  const problems = new Set(submissions.map((s) => s.problemId)).size;
  const rate     = total ? Math.round((accepted / total) * 100) : 0;

  const filtered = filter === 'all'
    ? submissions
    : submissions.filter((s) => s.verdict === filter);

  /* theme shorthand */
  const bg   = isDark ? 'bg-[#0A0A0A]'              : 'bg-[#F5F5F5]';
  const card = isDark ? 'bg-[#0E0E0E] border-[#1C1C1C]' : 'bg-white border-slate-200';
  const title = isDark ? 'text-[#E8E8E8]'            : 'text-[#1A1A1A]';
  const muted = isDark ? 'text-[#5A5A5A]'            : 'text-[#999]';

  return (
    <div className={`min-h-screen ${bg} py-10 px-4`}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`font-display font-extrabold text-3xl tracking-tight ${title}`}>
              My Submissions
            </h1>
            <p className={`text-sm mt-1 ${muted}`}>
              All your code submissions across every problem
              {lastRefresh && (
                <span className="ml-2 text-[11px] opacity-60">
                  · updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Manual refresh button */}
            <button
              onClick={() => { setLoading(true); fetchSubmissions(); }}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-[#3A3A3A] hover:text-[#C0C0C0]'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              }`}
              title="Refresh"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <Link
              to="/oa-arena"
              className={`text-xs px-4 py-2 rounded-xl border font-semibold transition-all ${
                isDark
                  ? 'border-[#2A2A2A] text-[#C0C0C0] hover:border-[#3A3A3A] hover:bg-[#1A1A1A]'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100'
              }`}
            >
              ← Back to Arena
            </Link>
          </div>
        </div>

        {/* ── Error banner ────────────────────────────────────────── */}
        {fetchError && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
            ⚠ Could not load submissions: {fetchError}
          </div>
        )}

        {/* ── Stats bar ───────────────────────────────────────────── */}
        {!loading && !fetchError && (
          <div className={`rounded-2xl border p-6 ${card} flex items-center justify-around gap-4 shadow-sm`}>
            <Stat label="Submitted"  value={total}    accent={title} />
            <div className={`w-px h-10 ${isDark ? 'bg-[#222]' : 'bg-slate-200'}`} />
            <Stat label="Accepted"   value={accepted} accent="text-emerald-400" />
            <div className={`w-px h-10 ${isDark ? 'bg-[#222]' : 'bg-slate-200'}`} />
            <Stat label="Problems"   value={problems}  accent="text-violet-400" />
            <div className={`w-px h-10 ${isDark ? 'bg-[#222]' : 'bg-slate-200'}`} />

            {/* Circular accuracy ring */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" strokeWidth="5"
                    className={isDark ? 'stroke-[#1E1E1E]' : 'stroke-slate-200'} fill="none" />
                  <circle
                    cx="28" cy="28" r="22" strokeWidth="5"
                    stroke="#10B981" fill="none"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - rate / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${
                  rate >= 60 ? 'text-emerald-400' : rate >= 30 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {rate}%
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500">Accuracy</span>
            </div>
          </div>
        )}

        {/* ── Filter Pills ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            const count = f === 'all' ? total : submissions.filter((s) => s.verdict === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-all ${
                  isActive
                    ? isDark
                      ? 'border-[#C0C0C0]/40 text-[#C0C0C0] bg-[#C0C0C0]/10'
                      : 'border-slate-500/40 text-slate-700 bg-slate-200'
                    : isDark
                    ? 'border-[#2A2A2A] text-[#5A5A5A] hover:border-[#3A3A3A] hover:text-[#A8A8A8]'
                    : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                {f === 'all' ? 'All' : f === 'Time Limit Exceeded' ? 'TLE' : f}
                {!loading && (
                  <span className="ml-1.5 opacity-60">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Table / List ─────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-16 rounded-2xl border ${isDark ? 'bg-[#0E0E0E] border-[#1C1C1C]' : 'bg-white border-slate-200'}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={`rounded-2xl border ${card} flex flex-col items-center justify-center py-20 text-center gap-4`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1A1A1A]' : 'bg-slate-100'}`}>
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold text-sm ${title}`}>No submissions yet</p>
              <p className={`text-xs mt-1 ${muted}`}>
                {filter === 'all'
                  ? 'Submit a solution in OA Arena to see it here.'
                  : `No "${filter === 'Time Limit Exceeded' ? 'TLE' : filter}" submissions found.`}
              </p>
            </div>
            {filter === 'all' && (
              <Link
                to="/oa-arena"
                className="text-xs px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/20 transition-all"
              >
                Go to OA Arena
              </Link>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-[#1C1C1C]' : 'border-slate-200'}`}>
            {/* Table header */}
            <div className={`grid grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1.4fr] gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'bg-[#0E0E0E] text-[#444]' : 'bg-slate-50 text-slate-400'}`}>
              <span>Problem</span>
              <span>Verdict</span>
              <span>Score</span>
              <span>Lang</span>
              <span className="text-right">Submitted</span>
            </div>

            {/* Rows */}
            {filtered.map((sub) => {
              const meta  = verdictMeta(sub.verdict);
              const score = sub.total > 0 ? `${sub.passed}/${sub.total}` : '—';
              const name  = (sub.problemId || '—')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <div
                  key={sub.id}
                  className={`grid grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1.4fr] gap-4 items-center px-6 py-4 border-t text-sm transition-colors group ${
                    isDark
                      ? 'border-[#141414] hover:bg-[#111]'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {/* Problem name */}
                  <Link
                    to={`/oa-arena/solve/${sub.problemId}`}
                    className={`font-semibold truncate transition-colors ${
                      isDark ? 'text-[#C0C0C0] group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {name}
                  </Link>

                  {/* Verdict badge */}
                  <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.ring} ${meta.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>

                  {/* Score */}
                  <span className={`font-mono text-xs ${sub.verdict === 'Accepted' ? 'text-emerald-400' : muted}`}>
                    {score}
                  </span>

                  {/* Language */}
                  <span className={`text-xs font-mono capitalize ${muted}`}>
                    {sub.language || '—'}
                  </span>

                  {/* Time */}
                  <span className={`text-xs text-right tabular-nums ${muted}`}>
                    {formatDate(sub.submittedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className={`text-center text-[11px] ${muted}`}>
            Showing {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` · filtered by "${filter === 'Time Limit Exceeded' ? 'TLE' : filter}"`}
            {' · auto-refreshes every 5s'}
          </p>
        )}
      </div>
    </div>
  );
}
