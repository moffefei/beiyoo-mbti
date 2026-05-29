'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuizStore } from '@/lib/store';
import { dimensionDescriptions } from '@/data/results';
import { saveMBTIResult, getStats } from '@/lib/supabase';
import ShareCard from './ShareCard';
import type { DimensionKey } from '@/types';

export default function Result() {
  const result = useQuizStore((state) => state.result);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const setAppState = useQuizStore((state) => state.setAppState);
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [stats, setStats] = useState<{ total: number; typeCounts: Record<string, number> } | null>(null);

  // 保存结果到 Supabase 并获取统计
  useEffect(() => {
    if (result) {
      saveMBTIResult(result.type, result.scores);
      getStats().then((data) => {
        if (data) setStats(data);
      });
    }
  }, [result]);

  const handleRestart = useCallback(() => {
    resetQuiz();
    setAppState('welcome');
  }, [resetQuiz, setAppState]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dimensionPairs: DimensionKey[] = ['EI', 'SN', 'TF', 'JP'];
  const dimensionColors: Record<string, string> = {
    E: 'bg-rose-500', I: 'bg-indigo-500',
    S: 'bg-amber-500', N: 'bg-violet-500',
    T: 'bg-sky-500', F: 'bg-pink-500',
    J: 'bg-emerald-500', P: 'bg-orange-500',
  };

  // 计算百分比
  const getPercentage = (d1: string, d2: string) => {
    const s1 = result.scores[d1 as keyof typeof result.scores];
    const s2 = result.scores[d2 as keyof typeof result.scores];
    const total = s1 + s2;
    if (total === 0) return 50;
    return Math.round((s1 / total) * 100);
  };

  return (
    <div className="min-h-screen px-5 py-6 max-w-lg mx-auto">
      {/* 顶部 */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-2">你的人格类型是</p>
        <h1 className="text-5xl font-bold text-primary-600 mb-2 tracking-wider">
          {result.type}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
          {result.summary}
        </p>
        {stats && (
          <p className="text-xs text-gray-400 mt-2">
            已有 {stats.total.toLocaleString()} 人完成测试
            {stats.typeCounts[result.type] > 1 && (
              <>，你是第 {stats.typeCounts[result.type]} 个 {result.type}</>
            )}
          </p>
        )}
      </div>

      {/* 维度图表 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">维度分析</h3>
        <div className="space-y-4">
          {dimensionPairs.map((pair) => {
            const d1 = pair[0];
            const d2 = pair[1];
            const pct = getPercentage(d1, d2);
            const d1Score = result.scores[d1 as keyof typeof result.scores];
            const d2Score = result.scores[d2 as keyof typeof result.scores];

            return (
              <div key={pair}>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className={`font-medium ${pct >= 50 ? 'text-gray-800' : ''}`}>
                    {d1} ({d1Score})
                  </span>
                  <span className="text-gray-400">{pct}%</span>
                  <span className={`font-medium ${pct < 50 ? 'text-gray-800' : ''}`}>
                    ({d2Score}) {d2}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className={`${dimensionColors[d1]} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                  <div
                    className={`${dimensionColors[d2]} transition-all duration-700 ease-out`}
                    style={{ width: `${100 - pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>{dimensionDescriptions[d1]}</span>
                  <span>{dimensionDescriptions[d2]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 详情展开 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-5 shadow-sm">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-gray-700">详细分析</h3>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDetails && (
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            {result.details}
          </p>
        )}
      </div>

      {/* 职业建议 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">趣味职业建议</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {result.careerAdvice}
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => setShowShare(true)}
          className="w-full py-3.5 bg-primary-500 text-white rounded-xl text-base font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          生成分享卡片
        </button>
        <button
          onClick={handleRestart}
          className="w-full py-3.5 bg-white text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
        >
          再测一次
        </button>
      </div>

      {/* 分享卡片弹窗 */}
      {showShare && (
        <ShareCard
          result={result}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
