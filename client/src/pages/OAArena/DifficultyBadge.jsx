import React from 'react';
import Badge from '../../components/ui/Badge';

export default function DifficultyBadge({ difficulty, className = '' }) {
  const norm = String(difficulty || '').toLowerCase();
  const variant = ['easy', 'medium', 'hard'].includes(norm) ? norm : 'default';

  return (
    <Badge variant={variant} className={`capitalize ${className}`}>
      {difficulty}
    </Badge>
  );
}
