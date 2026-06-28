import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../lib/api';

export function useCodeRunner() {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  const cleanPoll = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanPoll();
  }, []);

  const execute = useCallback(async ({ language, code, questionId, mode }) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    cleanPoll();

    try {
      const { data } = await api.post('/api/compile', {
        language,
        code,
        questionId,
        mode,
      });

      if (data.async && data.jobId) {
        const jobId = data.jobId;
        pollIntervalRef.current = setInterval(async () => {
          try {
            const res = await api.get(`/api/compile/${jobId}`);
            if (res.data.status === 'completed') {
              cleanPoll();
              setOutput(res.data);
              setLoading(false);
            } else if (res.data.status === 'failed') {
              cleanPoll();
              setError(res.data.error || 'Job execution failed');
              setLoading(false);
            }
          } catch (pollErr) {
            cleanPoll();
            setError(pollErr.response?.data?.message || pollErr.message || 'Error polling compile job');
            setLoading(false);
          }
        }, 1000);
      } else {
        setOutput(data);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Compilation failed');
      setLoading(false);
    }
  }, []);

  return { execute, output, loading, error };
}
