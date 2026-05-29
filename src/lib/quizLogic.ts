import { questions } from '@/data/questions';
import { resultDataMap } from '@/data/results';
import type { Answers, DimensionScore, MBTIType, ResultData } from '@/types';

const dimensionPairs: Record<string, [keyof DimensionScore, keyof DimensionScore]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

export function getSortedQuestions(): typeof questions {
  return [...questions].sort((a, b) => a.id - b.id);
}

export function calculateScores(answers: Answers): DimensionScore {
  const scores: DimensionScore = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  };

  for (const [questionIdStr, score] of Object.entries(answers)) {
    const questionId = parseInt(questionIdStr, 10);
    const question = questions.find((q) => q.id === questionId);
    if (!question) continue;

    // score 范围: -2, -1, 0, 1, 2
    // direction 表示正向维度
    // score > 0: 正向维度得分
    // score < 0: 反向维度得分
    // score = 0: 不给分
    
    const [dim1, dim2] = dimensionPairs[question.dimension];
    
    if (score > 0) {
      // 正向得分
      if (question.direction === dim1) {
        scores[dim1] += score;
      } else {
        scores[dim2] += score;
      }
    } else if (score < 0) {
      // 负向得分（取绝对值给反向维度）
      if (question.direction === dim1) {
        scores[dim2] += Math.abs(score);
      } else {
        scores[dim1] += Math.abs(score);
      }
    }
    // score === 0 时，不给任何维度加分
  }

  return scores;
}

export function determineMBTIType(scores: DimensionScore): MBTIType {
  let type = '';
  type += scores.E >= scores.I ? 'E' : 'I';
  type += scores.S >= scores.N ? 'S' : 'N';
  type += scores.T >= scores.F ? 'T' : 'F';
  type += scores.J >= scores.P ? 'J' : 'P';
  return type as MBTIType;
}

export function getProgress(answers: Answers) {
  return {
    current: Object.keys(answers).length,
    total: questions.length,
  };
}

export function getNextQuestionId(answers: Answers): number | null {
  const answeredIds = Object.keys(answers).map((id) => parseInt(id, 10));
  const unanswered = questions.filter((q) => !answeredIds.includes(q.id));
  
  if (unanswered.length === 0) return null;
  
  // 计算各维度当前得分倾向
  const dimBias: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const [qid, score] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === parseInt(qid, 10));
    if (!question) continue;
    dimBias[question.dimension] += Math.abs(score);
  }
  
  // 优先出得分较少的维度的题
  unanswered.sort((a, b) => dimBias[a.dimension] - dimBias[b.dimension]);
  return unanswered[0].id;
}

export function calculateResult(answers: Answers): ResultData {
  const scores = calculateScores(answers);
  const type = determineMBTIType(scores);
  const resultData = resultDataMap[type];
  
  return {
    type,
    scores,
    summary: resultData.summary,
    details: resultData.details,
    careerAdvice: resultData.careerAdvice,
  };
}
