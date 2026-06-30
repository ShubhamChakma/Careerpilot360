import React from 'react';
import Button from '../ui/Button';

export default function PredictButton({ onPredict, loading, disabled }) {
  return (
    <Button onClick={onPredict} loading={loading} disabled={disabled} className="shrink-0">
      🎯 Predict My Roles
    </Button>
  );
}