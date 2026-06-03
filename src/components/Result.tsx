'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuizStore } from '@/lib/store';
import { dimensionDescriptions } from '@/data/results';
import { saveMBTIResult, getStats } from '@/lib/supabase';
import ShareCard from './ShareCard';
import { isWeChatMiniProgram, navigateToShareResult } from '@/lib/wechat';
import { generateAndUploadShareImage } from '@/lib/shareImage';
const strengthLabels = {
  clear: '清晰',
  moderate: '中等',
  slight: '轻微',
  uncertain: '不明显',
};

export default function Result() {
  const result = useQuizStore((state) => state.result);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const setAppState = useQuizStore((state) => state.setAppState);
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [stats, setStats] = useState<{ total: number; typeCounts: Record<string, number> } | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [inMiniProgram] = useState(() => isWeChatMiniProgram());
  const [shareStatus, setShareStatus] = useState('');

  // 保存结果到 Supabase 并获取统计
  useEffect(() => {
    if (result) {
      if (!result.isLowConfidence) {
        saveMBTIResult(result.type, result.scores);
      }
      getStats().then((data) => {
        if (data) setStats(data);
      });
    }
  }, [result]);

  const handleRestart = useCallback(() => {
    resetQuiz();
    setAppState('welcome');
  }, [resetQuiz, setAppState]);

  // 小程序环境：生成分享海报并跳转到原生分享页
  const handleGenerateSharePoster = useCallback(async () => {
    if (!result) return;
    setIsGeneratingPoster(true);
    setShareStatus('正在生成分享海报...');

    try {
      // 1. 生成分享图并上传
      const publicUrl = await generateAndUploadShareImage(result);

      // 校验 imageUrl
      if (!publicUrl) {
        setShareStatus('分享海报生成失败，图片 URL 为空');
        return;
      }
      if (!publicUrl.startsWith('https://')) {
        setShareStatus('分享海报生成失败，图片 URL 格式错误');
        return;
      }

      // 2. 跳转到小程序原生分享页
      const title = `我的 MBTI 倾向是 ${result.displayType}，快来测测你的人格类型`;
      setShareStatus('正在打开小程序分享页...');
      await navigateToShareResult(result.type, title, result.summary, publicUrl);
    } catch (error: unknown) {
      console.error('Share poster failed:', error);
      setShareStatus('分享海报生成失败，请稍后重试');
    } finally {
      setIsGeneratingPoster(false);
    }
  }, [result]);

  // 普通浏览器环境：打开 H5 分享弹窗
  const handleOpenShareModal = useCallback(() => {
    setShowShare(true);
  }, []);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dimensionColors: Record<string, string> = {
    E: 'bg-rose-500', I: 'bg-indigo-500',
    S: 'bg-amber-500', N: 'bg-violet-500',
    T: 'bg-sky-500', F: 'bg-pink-500',
    J: 'bg-emerald-500', P: 'bg-orange-500',
  };

  return (
    <div className="min-h-screen px-5 py-6 max-w-lg mx-auto">
      {/* 顶部 */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-2">你的当前倾向是</p>
        <h1 className="text-5xl font-bold text-primary-600 mb-2 tracking-wider">
          {result.displayType}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
          {result.summary}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto mt-3">
          {result.confidenceNote}
        </p>
        {stats && !result.isLowConfidence && (
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
          {result.dimensionResults.map((dimension) => {
            const d1 = dimension.left;
            const d2 = dimension.right;
            const pct = dimension.percentage;

            return (
              <div key={dimension.pair}>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className={`font-medium ${dimension.preferred === d1 ? 'text-gray-800' : ''}`}>
                    {d1} ({dimension.leftScore})
                  </span>
                  <span className="text-gray-500">{strengthLabels[dimension.strength]}</span>
                  <span className={`font-medium ${dimension.preferred === d2 ? 'text-gray-800' : ''}`}>
                    ({dimension.rightScore}) {d2}
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
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 leading-snug mt-2">
                  <span>{dimensionDescriptions[d1]}</span>
                  <span className="text-right">{dimensionDescriptions[d2]}</span>
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
        {inMiniProgram ? (
          // 小程序 web-view 环境：直接生成海报并跳转原生页
          <button
            onClick={handleGenerateSharePoster}
            disabled={isGeneratingPoster}
            className="w-full py-3.5 bg-primary-500 text-white rounded-xl text-base font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isGeneratingPoster ? '正在生成分享海报...' : '生成分享海报'}
          </button>
        ) : (
          // 普通浏览器环境：打开 H5 分享弹窗
          <button
            onClick={handleOpenShareModal}
            className="w-full py-3.5 bg-primary-500 text-white rounded-xl text-base font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            生成分享卡片
          </button>
        )}
        {shareStatus && (
          <p className="rounded-xl bg-white/70 px-4 py-3 text-sm text-gray-600">
            {shareStatus}
          </p>
        )}
        <button
          onClick={handleRestart}
          className="w-full py-3.5 bg-white text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
        >
          再测一次
        </button>
      </div>

      {/* 分享卡片弹窗 — 仅在普通浏览器环境显示 */}
      {showShare && !inMiniProgram && (
        <ShareCard
          result={result}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
