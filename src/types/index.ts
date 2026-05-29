export type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'EI' | 'SN' | 'TF' | 'JP';

export type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP';

export interface Option {
  text: string;
  dimension: Dimension;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  dimension: DimensionKey;
}

export type Answers = Record<number, Dimension>;

export interface DimensionScore {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
  EI: number;
  SN: number;
  TF: number;
  JP: number;
}

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface ResultData {
  type: MBTIType;
  title: string;
  description: string;
  details: string;
  careers: string[];
  scores: DimensionScore;
  percentages: Record<DimensionKey, number>;
}

export type AppState = 'loading' | 'welcome' | 'quiz' | 'result';

export interface QuizState {
  appState: AppState;
  currentQuestion: number;
  answers: Answers;
  result: ResultData | null;
  setAppState: (state: AppState) => void;
  setCurrentQuestion: (index: number) => void;
  answerQuestion: (questionId: number, dimension: Dimension) => void;
  setResult: (result: ResultData) => void;
  resetQuiz: () => void;
}
