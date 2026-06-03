import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizState, AppState, Answers, ResultData, ResultHistoryItem } from '@/types';

interface StoreState extends QuizState {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState = {
  appState: 'welcome' as AppState,
  currentQuestion: 0,
  answers: {} as Answers,
  result: null as ResultData | null,
  resultHistory: [] as ResultHistoryItem[],
  _hasHydrated: false,
};

function createHistoryItem(result: ResultData): ResultHistoryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    displayType: result.displayType,
    dimensionResults: result.dimensionResults,
    uncertainDimensions: result.uncertainDimensions,
    hasUncertainDimension: result.hasUncertainDimension,
  };
}

function hasCurrentResultShape(result: ResultData | null | undefined): result is ResultData {
  return Boolean(
    result &&
      Array.isArray(result.dimensionResults) &&
      Array.isArray(result.uncertainDimensions) &&
      typeof result.displayType === 'string' &&
      typeof result.hasUncertainDimension === 'boolean'
  );
}

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
      setResult: (result: ResultData) =>
        set((state) => ({
          result,
          resultHistory: [createHistoryItem(result), ...(state.resultHistory ?? [])].slice(0, 8),
        })),
      clearResultHistory: () => set({ resultHistory: [] }),
      resetQuiz: () => set({
        appState: 'welcome',
        currentQuestion: 0,
        answers: {},
        result: null,
      }),
    }),
    {
      name: 'beiyoo-mbti-quiz',
      version: 2,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<StoreState>;
        const result = hasCurrentResultShape(state.result) ? state.result : null;

        return {
          ...state,
          appState: result ? state.appState ?? 'welcome' : 'welcome',
          result,
          resultHistory: Array.isArray(state.resultHistory) ? state.resultHistory : [],
          _hasHydrated: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
