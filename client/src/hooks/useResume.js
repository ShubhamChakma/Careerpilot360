import { useState, useCallback } from 'react';
import api from '../lib/api';
import { getResume } from '../firebase/firestore';
import { useAuthStore } from '../store/authStore';

export function useResume() {
  const [resume, setResume] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);

  const fetchResume = useCallback(async () => {
    if (!user?.uid) return;
    const data = await getResume(user.uid);
    setResume(data);
    if (data?.atsScore) {
      setAtsResult({
        overall: data.atsScore,
        breakdown: data.atsBreakdown,
        suggestions: data.suggestions || [],
      });
    }
  }, [user?.uid]);

  const upload = useCallback(
    async (file) => {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('resume', file);
      try {
        const { data } = await api.post('/api/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResume(data);
        return data;
      } catch (err) {
        setError(err.response?.data?.message || 'Upload failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const scan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/resume/scan');
      setAtsResult(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resume, atsResult, loading, error, upload, scan, fetchResume };
}
