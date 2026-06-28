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

      // Compiler_Server returns synchronous response — no polling needed
      if (data.success === false) {
        setError(data.error?.message || data.message || 'Compilation failed');
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
