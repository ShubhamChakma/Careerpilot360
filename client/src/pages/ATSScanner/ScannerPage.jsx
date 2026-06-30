import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useResume } from '../../hooks/useResume';
import Button from '../../components/ui/Button';
import ResumeUploader from '../../components/resume/ResumeUploader';
import ScoreReport from './ScoreReport';

export default function ScannerPage() {
  const { isDark } = useThemeStore();
  const { scanResume, atsResult, loading, error, fetchResume, resume } = useResume();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [useExisting, setUseExisting] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  useEffect(() => {
    if (resume && (resume.fileName || resume.resumeText)) {
      setUseExisting(true);
    }
  }, [resume]);

  const handleScan = async () => {
    if (!useExisting && !file) return;
    if (!jobDescription.trim()) return;
    try {
      await scanResume(useExisting ? null : file, jobDescription, useExisting);
    } catch (err) {
      console.error('Scan failed:', err);
    }
  };

  const canScan = (useExisting || file) && jobDescription.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          ATS Scanner
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
          Score your resume against a job description across ATS parameters before you apply
        </p>
      </div>

      {/* Existing Resume Detection Banner */}
      {resume && (resume.fileName || resume.resumeText) && (
        <div className={`p-4 rounded-xl mb-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-[#111] border-[#2A2A2A] text-[#E8E8E8]' : 'bg-white border-[#E0E0E0] text-[#1A1A1A]'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div>
              <p className="text-sm font-semibold">Active Resume: {resume.fileName || 'Uploaded Resume'}</p>
              <p className={`text-xs ${isDark ? 'text-[#6B6B6B]' : 'text-[#999]'}`}>
                Parsed on {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={useExisting}
                onChange={(e) => setUseExisting(e.target.checked)}
                className="rounded border-[#2A2A2A] text-zinc-900 bg-zinc-900 focus:ring-zinc-800"
              />
              Use Existing Resume
            </label>
          </div>
        </div>
      )}

      {/* Upload zone (only if NOT using existing) */}
      {!useExisting && (
        <ResumeUploader
          file={file}
          setFile={setFile}
          dragging={dragging}
          setDragging={setDragging}
          isDark={isDark}
        />
      )}

      {/* Job Description input */}
      <div className="mb-6">
        <label
          htmlFor="job-description"
          className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#A8A8A8]' : 'text-[#555]'}`}
        >
          Job Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to compare against your resume…"
          rows={6}
          className={`w-full rounded-xl p-4 text-sm resize-none transition-all outline-none border ${
            isDark
              ? 'bg-[#111] border-[#2A2A2A] text-[#E8E8E8] placeholder:text-[#3A3A3A] focus:border-[#4A4A4A]'
              : 'bg-white border-[#D0D0D0] text-[#1A1A1A] placeholder:text-[#999] focus:border-[#A0A0A0]'
          }`}
        />
      </div>

      {/* Error display with Retry option */}
      {error && (
        <div className="p-4 rounded-xl mb-4 bg-red-950/20 border border-red-900/30 flex items-center justify-between gap-4">
          <p className="text-red-400 text-sm">{error}</p>
          <Button size="xs" variant="secondary" onClick={handleScan}>Retry Scan</Button>
        </div>
      )}

      <Button
        onClick={handleScan}
        disabled={!canScan || loading}
        loading={loading}
        className="mb-10 w-full sm:w-auto"
      >
        {loading ? 'Evaluating Resume...' : 'Scan Resume'}
      </Button>

      {/* Skeletons while loading */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`h-48 rounded-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
            <div className={`h-48 rounded-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
          </div>
          <div className={`h-32 rounded-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
          <div className={`h-48 rounded-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
        </div>
      )}

      {/* Results */}
      {!loading && atsResult && (
        <ScoreReport atsData={atsResult} parsedResume={resume?.parsedData} isDark={isDark} />
      )}
    </div>
  );
}