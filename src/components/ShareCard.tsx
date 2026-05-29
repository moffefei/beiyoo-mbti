'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { ResultData } from '@/types';

interface ShareCardProps {
  result: ResultData;
  onClose?: () => void;
}

export default function ShareCard({ result, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `beiyoo-mbti-${result.type}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成分享卡片失败:', error);
      alert('生成图片失败，请尝试截图分享');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToWeChat = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `beiyoo-mbti-${result.type}.png`, { type: 'image/png' });
          if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
              title: `我的 MBTI 类型是 ${result.type}`,
              text: result.summary,
              files: [file],
            });
          } else {
            alert('您的浏览器不支持直接分享，请保存图片后手动分享');
          }
        }
      });
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请尝试截图分享');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 隐藏卡片用于生成图片 */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 rounded-2xl text-white"
        style={{ width: '375px', margin: '0 auto' }}
      >
        <div className="text-center mb-6">
          <p className="text-sm opacity-80 mb-2">Beiyoo MBTI 人格测试</p>
          <h2 className="text-5xl font-bold mb-2">{result.type}</h2>
          <p className="text-xl opacity-90">{result.summary}</p>
        </div>
        <div className="bg-white/20 rounded-xl p-4 mb-4">
          <p className="text-sm leading-relaxed">{result.details}</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-70">扫码测测你的人格类型</p>
          <div className="mt-2 w-16 h-16 bg-white/30 rounded-lg mx-auto flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {isGenerating ? '生成中...' : '保存图片'}
        </button>
        <button
          onClick={shareToWeChat}
          disabled={isGenerating}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          分享
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            关闭
          </button>
        )}
      </div>
    </div>
  );
}
