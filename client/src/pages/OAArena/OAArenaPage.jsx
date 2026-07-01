import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import Badge from '../../components/ui/Badge';
import { getAllQuestions } from '../../data/questions/index';

const topics = ['all', 'arrays', 'trees', 'graphs', 'dp', 'strings', 'linkedLists', 'stacks', 'sorting', 'math', 'backtracking'];
const difficulties = ['all', 'easy', 'medium', 'hard'];

export default function OAArenaPage() {
  const { isDark } = useThemeStore();
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('all');
  const [diff, setDiff] = useState('all');

  useEffect(() => {
    let q = getAllQuestions();
    if (topic !== 'all') q = q.filter((x) => x.topic === topic);
    if (diff !== 'all') q = q.filter((x) => x.difficulty === diff);
    setQuestions(q);
  }, [topic, diff]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>OA Arena</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Practice problems with real test-case evaluation</p>
        </div>
        <Link
          to="/oa-arena/submissions"
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border font-semibold transition-all ${
            isDark
              ? 'border-[#2A2A2A] text-[#C0C0C0] hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-400'
              : 'border-slate-300 text-slate-600 hover:border-violet-400/50 hover:bg-violet-50 hover:text-violet-600'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          My Submissions
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                topic === t
                  ? 'border-[#C0C0C0] text-[#C0C0C0] bg-[#C0C0C0]/10'
                  : isDark ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-[#3A3A3A]' : 'border-[#D0D0D0] text-[#999] hover:border-[#A0A0A0]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={`w-px ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#D0D0D0]'} mx-2`} />
        <div className="flex gap-1.5">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                diff === d
                  ? 'border-[#C0C0C0] text-[#C0C0C0] bg-[#C0C0C0]/10'
                  : isDark ? 'border-[#2A2A2A] text-[#6B6B6B]' : 'border-[#D0D0D0] text-[#999]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-[#1E1E1E]' : 'border-[#D0D0D0]'}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`${isDark ? 'bg-[#141414] text-[#6B6B6B]' : 'bg-[#F5F5F5] text-[#999]'} text-xs`}>
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-5 py-3 text-left font-medium">Title</th>
              <th className="px-5 py-3 text-left font-medium">Topic</th>
              <th className="px-5 py-3 text-left font-medium">Difficulty</th>
              <th className="px-5 py-3 text-left font-medium">Company</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr
                key={q.id}
                className={`border-t transition-colors ${isDark ? 'border-[#1A1A1A] hover:bg-[#141414]' : 'border-[#E8E8E8] hover:bg-[#F8F8F8]'}`}
              >
                <td className={`px-5 py-3.5 ${isDark ? 'text-[#4A4A4A]' : 'text-[#C0C0C0]'}`}>{i + 1}</td>
                <td className="px-5 py-3.5">
                  <Link to={`/oa-arena/solve/${q.id}`} className="text-[#C0C0C0] hover:text-[#E8E8E8] font-medium transition-colors">
                    {q.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant="silver">{q.topic}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                </td>
                <td className={`px-5 py-3.5 text-xs ${isDark ? 'text-[#4A4A4A]' : 'text-[#B0B0B0]'}`}>{q.company || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && (
          <div className={`py-16 text-center text-sm ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>No problems match these filters.</div>
        )}
      </div>
    </div>
  );
}