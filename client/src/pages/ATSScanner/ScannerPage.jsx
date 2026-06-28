import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useResume } from '../../hooks/useResume';
import Button from '../../components/ui/Button';
import ResumeUploader from '../../components/resume/ResumeUploader';
import ScoreReport from './ScoreReport';

export default function ScannerPage() {
  const { isDark } = useThemeStore();
  const { upload, scan, atsResult, loading, fetchResume } = useResume();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleScan = async () => {
    if (!file) return;
    const uploaded = await upload(file);
    if (uploaded) await scan();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>ATS Scanner</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Score your resume across 8 ATS parameters before you apply</p>
      </div>

      {/* Upload zone */}
      <ResumeUploader
        file={file}
        setFile={setFile}
        dragging={dragging}
        setDragging={setDragging}
        isDark={isDark}
      />

      <Button onClick={handleScan} disabled={!file} loading={loading} className="mb-10">
        Scan Resume
      </Button>

      {/* Results */}
      {atsResult && (
        <ScoreReport atsData={atsResult} isDark={isDark} />
      )}
    </div>
  );
}