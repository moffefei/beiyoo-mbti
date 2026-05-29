'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useQuizStore } from '@/lib/store';
import { questions } from '@/data/questions';
import { calculateResult, getNextQuestionId, getProgress } from '@/lib/quizLogic';

export default function Quiz() {
  const answers = useQuizStore((state) => state.answers);
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const answerQuestion = useQuizStore((state) => state.answerQuestion);
  const setResult = useQuizStore((state) => state.setResult);
  const setAppState = useQuizStore((state) => state.setAppState);

  // 动态排序题目
  const orderedQuestions = useMemo(() => {
    const answeredIds = Object.keys(answers).map((id) => parseInt(id, 10));
    const answered = questions.filter((q) => answeredIds.includes(q.id));
    const unanswered = questions.filter((q) => !answeredIds.includes(q.id));

    // 计算各维度当前得分倾向（绝对值越小越优先）
    const dimBias: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (const [qid, score] of Object.entries(answers)) {
      const question = questions.find((q) => q.id === parseInt(qid, 10));
      if (!question) continue;
      dimBias[question.dimension] += Math.abs(score);
    }

    // 优先出得分较少的维度的题
    unanswered.sort((a, b) => {
      const biasA = dimBias[a.dimension];
      const biasB = dimBias[b.dimension];
      return biasA - biasB;
    });

    return [...answered, ...unanswered];
  }, [answers]);

  const currentQ = orderedQuestions[currentQuestion];
  const progress = getProgress(answers);
  const progressPercent = Math.round((progress.current / progress.total) * 100);

  // 如果当前题已答过，跳到下一道未答题
  useEffect(() => {
    if (currentQ && answers[currentQ.id] !== undefined) {
      const nextId = getNextQuestionId(answers);
      if (nextId !== null) {
        const nextIndex = orderedQuestions.findIndex((q) => q.id === nextId);
        if (nextIndex !== -1 && nextIndex !== currentQuestion) {
          setCurrentQuestion(nextIndex);
        }
      }
    }
  }, [currentQ, answers, currentQuestion, orderedQuestions, setCurrentQuestion]);

  const handleAnswer = useCallback(
    (score: number) => {
      if (!currentQ) return;

      answerQuestion(currentQ.id, score);

      // 检查是否完成
      const newAnswers = { ...answers, [currentQ.id]: score };
      const newProgress = getProgress(newAnswers);

      if (newProgress.current >= newProgress.total) {
        const result = calculateResult(newAnswers);
        setResult(result);
        setAppState('result');
      } else {
        // 找到下一道未答题
        const nextId = getNextQuestionId(newAnswers);
        if (nextId !== null) {
          const nextIndex = orderedQuestions.findIndex((q) => q.id === nextId);
          if (nextIndex !== -1) {
            setCurrentQuestion(nextIndex);
          }
        }
      }
    },
    [currentQ, answers, answerQuestion, setResult, setAppState, orderedQuestions, setCurrentQuestion]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion, setCurrentQuestion]);

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-5 py-6 max-w-lg mx-auto">
      {/* 顶部进度条 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="p-2 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>进度 {progress.current}/{progress.total}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 题目 */}
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
            第 {progress.current + 1} 题
          </span>
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {currentQ.text}
          </h2>
        </div>

        {/* 选项 - 5级李克特量表 */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.score)}
              className="w-full p-4 text-left bg-white/70 backdrop-blur-sm rounded-xl border-2 border-transparent hover:border-primary-300 hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center shrink-0 ${
                  index === 0 ? 'bg-red-50 text-red-600' :
                  index === 1 ? 'bg-orange-50 text-orange-600' :
                  index === 2 ? 'bg-gray-50 text-gray-500' :
                  index === 3 ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 量表说明 */}
        <div className="mt-4 flex justify-between text-xs text-gray-400 px-2">
          <span>非常不符合</span>
          <span>不确定</span>
          <span>非常符合</span>
        </div>
      </div>

      {/* 底部维度标签 */}
      <div className="mt-8 flex justify-center gap-2">
        {['EI', 'SN', 'TF', 'JP'].map((dim) => (
          <span
            key={dim}
            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              currentQ.dimension === dim
                ? 'bg-primary-500 text-white'
                : answers && Object.entries(answers).some(([qid]) => {
                    const q = questions.find((qq) => qq.id === parseInt(qid));
                    return q?.dimension === dim;
                  })
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {dim}
          </span>
        ))}
      </div>
    </div>
  );
}
