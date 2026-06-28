import { create } from 'zustand';

export const useJobPredictStore = create((set) => ({
  predictions: [],
  strongestArea: '',
  weakestArea: '',
  overallReadiness: 0,
  cachedAt: null,
  setPredictions: (data) => set({ ...data }),
  // Alias used by useJobPredict hook
  setPrediction: (data) => set({ ...data }),
  clearPredictions: () => set({ predictions: [], strongestArea: '', weakestArea: '', overallReadiness: 0, cachedAt: null }),
}));