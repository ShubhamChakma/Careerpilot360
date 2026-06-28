import React from 'react';
import PredictionCard from './PredictionCard';

export default function PredictionGrid({ predictions, isDark }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {predictions.map((p, i) => (
        <PredictionCard key={i} prediction={p} isDark={isDark} />
      ))}
    </div>
  );
}