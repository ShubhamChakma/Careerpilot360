import React from 'react';
import Button from '../ui/Button';

export default function PredictButton({ onPredict, loading }) {
  return (
    <Button onClick={onPredict} loading={loading} className="shrink-0">
      🎯 Predict My Roles
    </Button>
  );
}