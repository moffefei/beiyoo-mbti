import type { Dimension, DimensionKey, DimensionScore, MBTIType, ResultData, Answers } from '@/types';
import { questions } from '@/data/questions';
import { resultDataMap } from '@/data/results';

const dimensionPairs: Record<DimensionKey, [Dimension, Dimension]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

export function calculateScores(answers: Answers): DimensionScore {
  const scores: DimensionScore = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  };

  for (const [questionIdStr, dimension] of Object.entries(answers)) {
    const questionId = parseInt(questionIdStr, 10);
    const question = questions.find((q) => q.id === questionId);
    if (!question) continue;

    const optionIndex = question.options.findIndex((o) => o.dimension === dimension);
    if (optionIndex === -1) continue;

    // 权重：选项1=3分，选项2=2分，选项3=1分
    const weight = 3 - optionIndex;
    scores[dimension] += weight;
  }

  return scores;
}

export function calculatePercentages(scores: DimensionScore): Record<DimensionKey, number> {
  const percentages = {} as Record<DimensionKey, number>;

  for (const [key, [d1, d2]] of Object.entries(dimensionPairs)) {
    const total = scores[d1] + scores[d2];
    if (total === 0) {
      percentages[key as DimensionKey] = 50;
    } else {
      percentages[key as DimensionKey] = Math.round((scores[d1] / total) * 100);
    }
  }

  return percentages;
}

export function determineMBTIType(scores: DimensionScore): MBTIType {
  let type = '';
  type += scores.E >= scores.I ? 'E' : 'I';
  type += scores.S >= scores.N ? 'S' : 'N';
  type += scores.T >= scores.F ? 'T' : 'F';
  type += scores.J >= scores.P ? 'J' : 'P';
  return type as MBTIType;
}

export function calculateResult(answers: Answers): ResultData {
  const scores = calculateScores(answers);
  const percentages = calculatePercentages(scores);
  const type = determineMBTIType(scores);
  const baseData = resultDataMap[type];

  return {
    type,
    title: baseData.title,
    description: baseData.description,
    details: baseData.details,
    careers: baseData.careers,
    scores,
    percentages,
  };
}

// 动态调整：根据已答题的维度倾向，调整后续题目权重
export function getDynamicQuestionOrder(answers: Answers): number[] {
  const answeredIds = Object.keys(answers).map((id) => parseInt(id, 10));
  const unanswered = questions.filter((q) => !answeredIds.includes(q.id));

  // 计算各维度当前得分倾向
  const dimBias: Record<DimensionKey, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const [qid, dim] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === parseInt(qid, 10));
    if (!question) continue;
    const pair = dimensionPairs[question.dimension];
    const isFirst = pair[0] === dim;
    dimBias[question.dimension] += isFirst ? 1 : -1;
  }

  // 对未答题按维度平衡排序：优先出倾向较弱的维度的题
  const sorted = [...unanswered].sort((a, b) => {
    const biasA = Math.abs(dimBias[a.dimension]);
    const biasB = Math.abs(dimBias[b.dimension]);
    return biasA - biasB;
  });

  return sorted.map((q) => q.id);
}

export function getNextQuestionId(answers: Answers): number | null {
  const order = getDynamicQuestionOrder(answers);
  return order.length > 0 ? order[0] : null;
}

export function getProgress(answers: Answers): { current: number; total: number } {
  const total = questions.length;
  const current = Object.keys(answers).length;
  return { current, total };
}
