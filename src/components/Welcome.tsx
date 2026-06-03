'use client';

import { useState, useEffect } from 'react';
import { useQuizStore } from '@/lib/store';
import { getTotalCount } from '@/lib/supabase';

export default function Welcome() {
  const setAppState = useQuizStore((state) => state.setAppState);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    getTotalCount().then((count) => {
      setTotalCount(count);
    });
  }, []);

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
        发现你的人格类型
      </h2>
      <p className="text-sm text-gray-400 mb-2 text-center max-w-xs">
        60 道四维倾向题 · 用于娱乐和自我探索 · 结果仅供参考
      </p>
      {totalCount !== null && totalCount > 0 && (
        <p className="text-xs text-primary-500 font-medium mb-8">
          已有 {totalCount.toLocaleString()} 人完成测试
        </p>
      )}
      {totalCount === null && <div className="h-5 mb-8" />}

      <div className="w-full max-w-sm space-y-4 mb-10">
        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">四维倾向</p>
            <p className="text-xs text-gray-500">基于 MBTI 偏好框架设计</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">倾向分析</p>
            <p className="text-xs text-gray-500">呈现维度强弱与不确定性</p>
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

      {/* 免责声明 */}
      <button
        onClick={() => setShowDisclaimer(true)}
        className="min-h-11 px-4 text-xs text-gray-400 hover:text-gray-600 mt-1 underline underline-offset-2 transition-colors"
      >
        测试声明
      </button>

      {/* 免责声明弹窗 */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">性格测试声明</h3>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-800">1. 娱乐参考性质</strong><br />
                本测试基于 MBTI 四维偏好框架设计，仅供娱乐和自我探索参考，不构成专业心理诊断、职业指导或人员筛选建议。
              </p>
              <p>
                <strong className="text-gray-800">2. 结果非绝对</strong><br />
                人格是复杂且动态的，测试结果反映的是你答题时的偏好模式，而非固定不变的标签。若维度倾向不明显，我们会提示结果不够稳定。
              </p>
              <p>
                <strong className="text-gray-800">3. 数据收集</strong><br />
                我们仅匿名记录测试结果（人格类型和维度分数），用于统计分析和改进测试体验。不收集任何可识别个人身份的信息。
              </p>
              <p>
                <strong className="text-gray-800">4. 专业建议</strong><br />
                如有人格发展、心理健康或职业规划方面的深度需求，建议咨询持证心理咨询师或职业规划师。
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full mt-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors"
            >
              我已了解
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
