import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

const topics = [
  { slug: 'arrays', title: 'Arrays', icon: '📦', category: 'Data Structures' },
  { slug: 'linked-lists', title: 'Linked Lists', icon: '🔗', category: 'Data Structures' },
  { slug: 'trees', title: 'Trees', icon: '🌳', category: 'Data Structures' },
  { slug: 'graphs', title: 'Graphs', icon: '🕸️', category: 'Data Structures' },
  { slug: 'hash-maps', title: 'Hash Maps', icon: '#️⃣', category: 'Data Structures' },
  { slug: 'heaps', title: 'Heaps', icon: '⛰️', category: 'Data Structures' },
  { slug: 'sorting', title: 'Sorting', icon: '📊', category: 'Algorithms' },
  { slug: 'binary-search', title: 'Binary Search', icon: '🔎', category: 'Algorithms' },
  { slug: 'dynamic-programming', title: 'Dynamic Programming', icon: '🧩', category: 'Algorithms' },
  { slug: 'backtracking', title: 'Backtracking', icon: '🔀', category: 'Algorithms' },
  { slug: 'greedy', title: 'Greedy', icon: '💰', category: 'Algorithms' },
  { slug: 'two-pointers', title: 'Two Pointers', icon: '👉', category: 'Algorithms' },
  { slug: 'sliding-window', title: 'Sliding Window', icon: '🪟', category: 'Algorithms' },
  { slug: 'recursion', title: 'Recursion', icon: '🔁', category: 'Algorithms' },
  { slug: 'bit-manipulation', title: 'Bit Manipulation', icon: '⚡', category: 'Systems' },
  { slug: 'os-concepts', title: 'OS Concepts', icon: '🖥️', category: 'Systems' },
  { slug: 'networking', title: 'Networking', icon: '🌐', category: 'Systems' },
  { slug: 'databases', title: 'Databases', icon: '🗄️', category: 'Systems' },
  { slug: 'system-design', title: 'System Design', icon: '🏗️', category: 'Systems' },
  { slug: 'concurrency', title: 'Concurrency', icon: '⚙️', category: 'Systems' },
  { slug: 'react', title: 'React', icon: '⚛️', category: 'Web' },
  { slug: 'node', title: 'Node.js', icon: '🟢', category: 'Web' },
  { slug: 'rest-api', title: 'REST APIs', icon: '🔌', category: 'Web' },
  { slug: 'sql', title: 'SQL', icon: '📋', category: 'Web' },
  { slug: 'git', title: 'Git', icon: '🌿', category: 'Tools' },
  { slug: 'docker', title: 'Docker', icon: '🐳', category: 'Tools' },
  { slug: 'testing', title: 'Testing', icon: '🧪', category: 'Tools' },
  { slug: 'complexity', title: 'Time Complexity', icon: '⏱️', category: 'Fundamentals' },
  { slug: 'oop', title: 'OOP', icon: '🎯', category: 'Fundamentals' },
  { slug: 'design-patterns', title: 'Design Patterns', icon: '🎨', category: 'Fundamentals' },
];

import TopicCard from './TopicCard';

const categories = ['All', 'Data Structures', 'Algorithms', 'Systems', 'Web', 'Tools', 'Fundamentals'];

export default function DocsHubPage() {
  const { isDark } = useThemeStore();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = topics.filter((t) => {
    const catOk = cat === 'All' || t.category === cat;
    const searchOk = t.title.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Docs Hub</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>30 AI-generated topic guides with official references</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics..."
          className={`text-sm px-4 py-2 rounded-lg border flex-1 focus:outline-none focus:border-[#C0C0C0] transition-colors ${isDark ? 'bg-[#141414] border-[#2A2A2A] text-[#E8E8E8] placeholder-[#3A3A3A]' : 'bg-white border-[#D0D0D0] text-[#1A1A1A] placeholder-[#B0B0B0]'}`}
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs px-3 py-2 rounded-lg border transition-all ${cat === c ? 'border-[#C0C0C0] text-[#C0C0C0] bg-[#C0C0C0]/10' : isDark ? 'border-[#2A2A2A] text-[#6B6B6B] hover:border-[#3A3A3A]' : 'border-[#D0D0D0] text-[#999] hover:border-[#A0A0A0]'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map((t) => (
          <TopicCard key={t.slug} topic={t} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}