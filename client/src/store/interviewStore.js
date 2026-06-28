import { create } from 'zustand';

export const useInterviewStore = create((set) => ({
  sessionId: null,
  templateId: null,
  elapsed: 0,
  isActive: false,
  setSession: (sessionId, templateId) => set({ sessionId, templateId, isActive: true }),
  setElapsed: (elapsed) => set({ elapsed }),
  endSession: () => set({ sessionId: null, templateId: null, elapsed: 0, isActive: false }),
}));