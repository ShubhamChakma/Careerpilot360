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
      <div className="mb-8">
        <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>OA Arena</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Practice problems with real test-case evaluation</p>
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