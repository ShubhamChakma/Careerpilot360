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
    try {
      const response = await api.get('/resume');
      const data = response.data?.data || null;
      setResume(data);
      // Resume doc now stores the ATS report under the `report` key
      if (data?.report) {
        setAtsResult(data.report);
      }
    } catch (err) {
      // Silently swallow — user may have no resume yet
      console.warn('[useResume] fetchResume failed:', err.message);
    }
  }, []);

  /**
   * Uploads a resume file or uses the existing one to run the ATS scan.
   * @param {File|null} file - The PDF/DOCX/DOC resume file
   * @param {string} jobDescription - The target job description to compare against
   * @param {boolean} [useExisting=false] - Whether to reuse the previously uploaded resume
   */
  const scanResume = useCallback(async (file, jobDescription, useExisting = false) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (useExisting || !file) {
        response = await api.post('/resume/scan', {
          jobDescription,
          useExisting: true
        });
      } else {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        response = await api.post('/resume/scan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const report = response.data.data?.report;
      setResume(response.data.data);
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
