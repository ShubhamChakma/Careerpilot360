import { useState, useCallback } from 'react';
import api from '../lib/api';
import { getJobPrediction, saveJobPrediction } from '../firebase/firestore';
import { useJobPredictStore } from '../store/jobPredictStore';
import { useAuthStore } from '../store/authStore';

export function useJobPredict() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setPrediction = useJobPredictStore((s) => s.setPrediction);
  const predictions = useJobPredictStore((s) => s.predictions);
  const strongestArea = useJobPredictStore((s) => s.strongestArea);
  const weakestArea = useJobPredictStore((s) => s.weakestArea);
  const overallReadiness = useJobPredictStore((s) => s.overallReadiness);
  const cachedAt = useJobPredictStore((s) => s.cachedAt);
  const user = useAuthStore((s) => s.user);

  const loadCached = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const cached = await getJobPrediction(user.uid);
      if (cached) setPrediction(cached);
    } catch {
      /* ignore cache miss */
    }
  }, [user?.uid, setPrediction]);

  const predict = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/job-predict');
      setPrediction(data);
      if (user?.uid) await saveJobPrediction(user.uid, data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, setPrediction]);

  return {
    predict,
    loadCached,
    predictions,
    strongestArea,
    weakestArea,
    overallReadiness,
    cachedAt,
    loading,
    error,
  };
}
