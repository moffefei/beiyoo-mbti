'use client';

import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import type { ResultData } from '@/types';

interface ShareCardProps {
  result: ResultData;
  onClose?: () => void;
}

export default function ShareCard({ result, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `beiyoo-mbti-${result.type}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('生成分享卡片失败:', error);
      alert('生成图片失败，请尝试截图分享');
    } finally {
      setIsGenerating(false);
    }
  }, [result.type]);

  const shareToWeChat = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');

      // 尝试使用 Web Share API（移动端原生分享）
      if (navigator.share) {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `beiyoo-mbti-${result.type}.png`, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `我的 MBTI 类型是 ${result.type}`,
              text: `${result.summary} - 来测测你的人格类型吧！`,
              files: [file],
            });
            setIsGenerating(false);
            return;
          }
        } catch (shareError) {
          console.log('Native share failed, fallback to clipboard:', shareError);
        }
      }

      // 降级：复制图片到剪贴板
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        alert('图片已复制到剪贴板，请粘贴到聊天窗口分享');
      } catch (clipboardError) {
        console.error('Clipboard failed:', clipboardError);
        // 最终降级：在新标签页打开图片
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<img src="${dataUrl}" style="max-width:100%" />`);
          alert('图片已在新窗口打开，请长按保存或截图分享');
        } else {
          alert('分享失败，请截图保存');
        }
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请尝试截图分享');
    } finally {
      setIsGenerating(false);
    }
  }, [result.type, result.summary]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* 预览区域 */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 rounded-2xl text-white"
            style={{ width: '100%', maxWidth: '375px', margin: '0 auto' }}
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
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="flex-1 py-3.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isGenerating ? '生成中...' : '保存图片'}
          </button>
          <button
            onClick={shareToWeChat}
            disabled={isGenerating}
            className="flex-1 py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-3 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            关闭
          </button>
        )}
      </div>
    </div>
  );
}
