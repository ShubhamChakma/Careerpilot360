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
    try {
      const data = await getResume(user.uid);
      setResume(data);
      // Resume doc now stores the ATS report under the `report` key
      if (data?.report) {
        setAtsResult(data.report);
      }
    } catch (err) {
      // Silently swallow — user may have no resume yet, or Firestore rules may restrict access
      console.warn('[useResume] fetchResume failed:', err.message);
    }
  }, [user?.uid]);

  /**
   * Uploads a resume file and runs the ATS scan in a single request.
   * @param {File} file - The PDF/DOCX/TXT resume file
   * @param {string} jobDescription - The target job description to compare against
   */
  const scanResume = useCallback(async (file, jobDescription) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    try {
      const { data } = await api.post('/resume/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const report = data.data?.report;
      setResume(data.data);
      setAtsResult(report);
      return report;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Scan failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resume, atsResult, loading, error, scanResume, fetchResume };
}
