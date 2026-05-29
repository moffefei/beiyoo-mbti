import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizState, AppState, Answers, ResultData } from '@/types';

interface StoreState extends QuizState {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState = {
  appState: 'welcome' as AppState,
  currentQuestion: 0,
  answers: {} as Answers,
  result: null as ResultData | null,
  _hasHydrated: false,
};

export const useQuizStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
      setAppState: (state: AppState) => set({ appState: state }),
      setCurrentQuestion: (index: number) => set({ currentQuestion: index }),
      answerQuestion: (questionId: number, score: number) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: score },
        })),
      setResult: (result: ResultData) => set({ result }),
      resetQuiz: () => set({
        appState: 'welcome',
        currentQuestion: 0,
        answers: {},
        result: null,
      }),
    }),
    {
      name: 'beiyoo-mbti-quiz',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
