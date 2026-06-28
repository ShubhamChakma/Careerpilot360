import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useJobPredict } from '../../hooks/useJobPredict';
import { useJobPredictStore } from '../../store/jobPredictStore';
import PredictButton from '../../components/jobpredict/PredictButton';
import ReadinessBar from '../../components/jobpredict/ReadinessBar';
import PredictionGrid from '../../components/jobpredict/PredictionGrid';
import Spinner from '../../components/ui/Spinner';

export default function JobPredictPage() {
  const { isDark } = useThemeStore();
  const { predict, loadCached, loading } = useJobPredict();
  const { predictions, overallReadiness, strongestArea, weakestArea, cachedAt } = useJobPredictStore();

  useEffect(() => { loadCached(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`font-display font-bold text-3xl ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>Job Predict</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>AI-matched job roles based on your resume</p>
          {cachedAt && (
            <p className={`text-xs mt-1 ${isDark ? 'text-[#3A3A3A]' : 'text-[#C0C0C0]'}`}>
              Last predicted: {new Date(cachedAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
        <PredictButton onPredict={predict} loading={loading} />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size="lg" />
          <p className={`text-sm ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Analyzing your resume...</p>
        </div>
      )}

      {!loading && predictions.length > 0 && (
        <>
          <ReadinessBar overallReadiness={overallReadiness} strongestArea={strongestArea} weakestArea={weakestArea} isDark={isDark} />
          <div className="mt-8">
            <PredictionGrid predictions={predictions} isDark={isDark} />
          </div>
        </>
      )}

      {!loading && predictions.length === 0 && (
        <div className={`metal-card rounded-2xl p-12 text-center`}>
          <span className="text-4xl block mb-4">🎯</span>
          <h2 className={`font-display font-semibold text-lg mb-2 ${isDark ? 'text-[#E8E8E8]' : 'text-[#1A1A1A]'}`}>No predictions yet</h2>
          <p className={`text-sm ${isDark ? 'text-[#4A4A4A]' : 'text-[#999]'}`}>Upload your resume in ATS Scanner, then hit Predict to see matched roles.</p>
        </div>
      )}
    </div>
  );
}