import { create } from 'zustand';

export const useQuestionStore = create((set) => ({
  questions: [],
  filtered: [],
  topicFilter: 'all',
  difficultyFilter: 'all',
  setQuestions: (questions) => set({ questions, filtered: questions }),
  setTopicFilter: (topicFilter) => set({ topicFilter }),
  setDifficultyFilter: (difficultyFilter) => set({ difficultyFilter }),
  applyFilters: () =>
    set((s) => ({
      filtered: s.questions.filter((q) => {
        const topicOk = s.topicFilter === 'all' || q.topic === s.topicFilter;
        const diffOk = s.difficultyFilter === 'all' || q.difficulty === s.difficultyFilter;
        return topicOk && diffOk;
      }),
    })),
}));