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
      const { data } = await api.post('/compile', {
        language,
        code,
        questionId,
        mode,
      });

<<<<<<< Updated upstream
      // Compiler_Server returns synchronous response — no polling needed
      if (data.success === false) {
        setError(data.error?.message || data.message || 'Compilation failed');
=======
      if (data.async && data.jobId) {
        const jobId = data.jobId;
        pollIntervalRef.current = setInterval(async () => {
          try {
            const res = await api.get(`/compile/${jobId}`);
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
>>>>>>> Stashed changes
      } else {
        setOutput(data);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message
        || err.response?.data?.message
        || err.message
        || 'Compilation failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, output, loading, error };
}
