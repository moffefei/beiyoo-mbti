import { questions } from '@/data/questions';
import { resultDataMap } from '@/data/results';
import type {
  Answers,
  DimensionKey,
  DimensionResult,
  DimensionScore,
  DimensionStrength,
  MBTIType,
  ResultData,
} from '@/types';

const dimensionPairs: Record<DimensionKey, [keyof DimensionScore, keyof DimensionScore]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

const pairOrder: DimensionKey[] = ['EI', 'SN', 'TF', 'JP'];
const lowEvidenceThreshold = 6;

const preferenceCopy: Record<string, string> = {
  E: '你在外部互动和交流中更容易获得能量',
  I: '你更需要独处和安静空间来恢复能量',
  S: '你更重视具体事实、细节和可验证的信息',
  N: '你更容易被模式、可能性和未来想象吸引',
  T: '你做判断时更重视标准、证据和逻辑后果',
  F: '你做判断时更重视人的感受、价值和关系影响',
  J: '你更偏好清晰计划、确定步骤和有序推进',
  P: '你更偏好保留弹性、边推进边调整',
};

const pairLabels: Record<DimensionKey, string> = {
  EI: '社交能量',
  SN: '信息处理',
  TF: '决策依据',
  JP: '生活结构',
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

function getStrength(difference: number, evidence: number): DimensionStrength {
  if (evidence < lowEvidenceThreshold || difference === 0) return 'uncertain';
  const ratio = difference / evidence;
  if (ratio >= 0.45) return 'clear';
  if (ratio >= 0.25) return 'moderate';
  return 'slight';
}

export function analyzeDimensions(scores: DimensionScore): DimensionResult[] {
  return pairOrder.map((pair) => {
    const [left, right] = dimensionPairs[pair];
    const leftScore = scores[left];
    const rightScore = scores[right];
    const evidence = leftScore + rightScore;
    const difference = Math.abs(leftScore - rightScore);
    const preferred = leftScore === rightScore ? null : leftScore > rightScore ? left : right;
    const percentage = evidence === 0 ? 50 : Math.round((leftScore / evidence) * 100);

    return {
      pair,
      left,
      right,
      leftScore,
      rightScore,
      preferred,
      percentage,
      evidence,
      difference,
      strength: getStrength(difference, evidence),
      isTie: leftScore === rightScore,
    };
  });
}

export function determineMBTIType(scores: DimensionScore): MBTIType {
  const type = analyzeDimensions(scores)
    .map((dimension) => dimension.preferred ?? dimension.left)
    .join('');
  return type as MBTIType;
}

function getDisplayType(dimensions: DimensionResult[]): string {
  const letters = dimensions.map((dimension) =>
    dimension.strength === 'uncertain' || !dimension.preferred ? '?' : dimension.preferred
  );

  if (letters.every((letter) => letter === '?')) {
    return '倾向不明显';
  }

  return letters.join('');
}

function getConfidenceNote(dimensions: DimensionResult[]): string {
  const uncertain = dimensions.filter((dimension) => dimension.strength === 'uncertain');

  if (uncertain.length === dimensions.length) {
    return '你的回答中中立或接近中立的选择较多，暂时不足以形成稳定类型。建议把结果当作当前状态的轻量反馈，或稍后重新测试。';
  }

  if (uncertain.length > 0) {
    const labels = uncertain.map((dimension) => dimension.pair).join('、');
    return `你的 ${labels} 维度倾向还不明显，结果更适合作为当前选择模式的参考，而不是固定人格标签。`;
  }

  return '这个结果反映的是你当前在四个偏好维度上的回答模式，不代表固定不变的人格标签。';
}

function getPartialResultCopy(
  dimensions: DimensionResult[],
  displayType: string,
  isLowConfidence: boolean,
) {
  const clearPreferences = dimensions.filter(
    (dimension) => dimension.strength !== 'uncertain' && dimension.preferred
  );
  const uncertainPreferences = dimensions.filter((dimension) => dimension.strength === 'uncertain');

  if (isLowConfidence) {
    return {
      summary: '你的回答目前没有形成清晰的四维倾向，这可能表示你在不同情境下有较强的弹性，或这次选择偏中立。',
      details: '当多个维度都接近中立时，给出确定人格类型会误导你。这个结果更适合提醒你：在做自我探索时，可以回想具体场景里的真实偏好，而不是追求一个固定标签。',
      careerAdvice: '先观察自己在社交能量、信息处理、决策依据和生活结构上的真实偏好，再把职业建议当作轻量参考。',
    };
  }

  const clearText = clearPreferences
    .map((dimension) => preferenceCopy[dimension.preferred as string])
    .join('；');
  const uncertainText = uncertainPreferences
    .map((dimension) => `${pairLabels[dimension.pair]}（${dimension.pair}）`)
    .join('、');
  const partialLabel = displayType.replace(/\?/g, '');

  return {
    summary: `你的回答呈现出部分 ${partialLabel} 倾向，但仍有部分维度不够稳定。`,
    details: `从这次回答看，较清晰的部分是：${clearText}。同时，${uncertainText} 的倾向还不明显，所以这里不把你归入某个固定 16 型人格。你可以把这个结果理解为当前偏好组合，而不是完整人格标签。`,
    careerAdvice: '职业和发展建议更适合从已清晰的偏好出发：选择能发挥你的明显倾向、同时允许不确定维度继续探索的环境。',
  };
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
  const dimensionResults = analyzeDimensions(scores);
  const type = determineMBTIType(scores);
  const displayType = getDisplayType(dimensionResults);
  const uncertainDimensions = dimensionResults
    .filter((dimension) => dimension.strength === 'uncertain')
    .map((dimension) => dimension.pair);
  const hasUncertainDimension = uncertainDimensions.length > 0;
  const isLowConfidence = uncertainDimensions.length >= 3;
  const resultData = resultDataMap[type];
  const partialResultData = hasUncertainDimension
    ? getPartialResultCopy(dimensionResults, displayType, isLowConfidence)
    : null;
  
  return {
    type,
    displayType,
    scores,
    summary: partialResultData?.summary ?? resultData.summary,
    details: partialResultData?.details ?? resultData.details,
    careerAdvice: partialResultData?.careerAdvice ?? resultData.careerAdvice,
    dimensionResults,
    uncertainDimensions,
    hasUncertainDimension,
    isLowConfidence,
    confidenceNote: getConfidenceNote(dimensionResults),
  };
}
