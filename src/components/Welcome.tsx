'use client';

import { useQuizStore } from '@/lib/store';

export default function Welcome() {
  const setAppState = useQuizStore((state) => state.setAppState);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleStart = () => {
    resetQuiz();
    setAppState('quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="w-24 h-24 mb-8 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
        <span className="text-4xl font-bold text-white">B</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Beiyoo MBTI
      </h1>
      <h2 className="text-lg text-gray-600 mb-2 text-center">
        发现你的真实人格类型
      </h2>
      <p className="text-sm text-gray-400 mb-10 text-center max-w-xs">
        60 道精选题目 · 动态调整算法 · 专业人格分析
      </p>

      <div className="w-full max-w-sm space-y-4 mb-10">
        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">科学题库</p>
            <p className="text-xs text-gray-500">基于经典 MBTI 理论设计</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">智能分析</p>
            <p className="text-xs text-gray-500">动态调整题目权重</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">精美分享</p>
            <p className="text-xs text-gray-500">生成专属人格卡片</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-sm py-4 bg-primary-500 text-white rounded-xl text-lg font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
      >
        开始测试
      </button>

      <p className="text-xs text-gray-400 mt-6">
        测试约需 5-8 分钟 · 答题进度自动保存
      </p>
    </div>
  );
}
