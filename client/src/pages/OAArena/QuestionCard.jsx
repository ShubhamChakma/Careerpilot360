import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import DifficultyBadge from './DifficultyBadge';

export default function QuestionCard({ question, isDark }) {
  return (
    <div className={`metal-card rounded-xl p-5 flex flex-col gap-3 justify-between transition-all hover:border-[#C0C0C0]/45`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex gap-1.5">
            <DifficultyBadge difficulty={question.difficulty} />
            <Badge variant="silver">{question.topic}</Badge>
          </div>
          {question.company && (
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
              {question.company}
            </span>
          )}
        </div>
        <h3 className={`font-display font-bold text-base ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          {question.title}
        </h3>
        <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-[#4A4A4A]' : 'text-[#777]'}`}>
          {question.description}
        </p>
      </div>

      <div className="flex justify-end">
        <Link
          to={`/oa-arena/solve/${question.id}`}
          className="btn-metal text-xs px-3.5 py-1.5 rounded-lg"
        >
          Solve Challenge →
        </Link>
      </div>
    </div>
  );
}
