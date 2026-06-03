export type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP';

export interface Option {
  text: string;
  score: number; // -2, -1, 0, 1, 2
}

export interface Question {
  id: number;
  text: string; // 陈述句
  dimension: DimensionKey; // 所属维度
  direction: Dimension; // 正向维度（得分方向）
  options: Option[]; // 5个选项，score从-2到2
}

export type Answers = Record<number, number>; // questionId -> score

export interface DimensionScore {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export type DimensionStrength = 'clear' | 'moderate' | 'slight' | 'uncertain';

export interface DimensionResult {
  pair: DimensionKey;
  left: Dimension;
  right: Dimension;
  leftScore: number;
  rightScore: number;
  preferred: Dimension | null;
  percentage: number;
  evidence: number;
  difference: number;
  strength: DimensionStrength;
  isTie: boolean;
}

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface ResultData {
  type: MBTIType;
  displayType: string;
  scores: DimensionScore;
  summary: string;
  details: string;
  careerAdvice: string;
  dimensionResults: DimensionResult[];
  uncertainDimensions: DimensionKey[];
  isLowConfidence: boolean;
  confidenceNote: string;
}

export type AppState = 'welcome' | 'quiz' | 'loading' | 'result';

export interface QuizState {
  appState: AppState;
  currentQuestion: number;
  answers: Answers;
  result: ResultData | null;
  setAppState: (state: AppState) => void;
  setCurrentQuestion: (index: number) => void;
  answerQuestion: (questionId: number, score: number) => void;
  setResult: (result: ResultData) => void;
  resetQuiz: () => void;
}
