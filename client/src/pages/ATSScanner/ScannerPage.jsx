import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useResume } from '../../hooks/useResume';
import Button from '../../components/ui/Button';
import ResumeUploader from '../../components/resume/ResumeUploader';
import ScoreReport from './ScoreReport';

export default function ScannerPage() {
  const { isDark } = useThemeStore();
  const { scanResume, atsResult, loading, error, fetchResume } = useResume();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleScan = async () => {
    if (!file || !jobDescription.trim()) return;
    await scanResume(file, jobDescription);
  };

  const canScan = file && jobDescription.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>
          ATS Scanner
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>
          Score your resume against a job description across ATS parameters before you apply
        </p>
      </div>

      {/* Upload zone */}
      <ResumeUploader
        file={file}
        setFile={setFile}
        dragging={dragging}
        setDragging={setDragging}
        isDark={isDark}
      />

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

      {/* Error display */}
      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <Button
        onClick={handleScan}
        disabled={!canScan}
        loading={loading}
        className="mb-10"
      >
        Scan Resume
      </Button>

      {/* Results */}
      {atsResult && (
        <ScoreReport atsData={atsResult} isDark={isDark} />
      )}
    </div>
  );
}