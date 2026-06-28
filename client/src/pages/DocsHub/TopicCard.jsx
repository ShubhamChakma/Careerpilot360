import React from 'react';
import { Link } from 'react-router-dom';

export default function TopicCard({ topic, isDark }) {
  return (
    <Link
      to={`/docs/${topic.slug}`}
      className="metal-card rounded-xl p-4 flex flex-col items-center text-center gap-2 group transition-all hover:border-[#C0C0C0]/40"
    >
      <span className="text-2xl">{topic.icon}</span>
      <span className={`text-xs font-semibold group-hover:text-[#C0C0C0] transition-colors ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}>
        {topic.title}
      </span>
      <span className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>
        {topic.category}
      </span>
    </Link>
  );
}
