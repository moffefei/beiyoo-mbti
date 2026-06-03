'use client';

import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import type { ResultData } from '@/types';

interface ShareCardProps {
  result: ResultData;
  onClose?: () => void;
}

export default function ShareCard({ result, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Generate poster image data URL (shared helper)
  const generatePosterDataUrl = useCallback(async (): Promise<string> => {
    if (!cardRef.current) throw new Error('卡片元素未找到');
    await document.fonts.ready;
    const images = cardRef.current.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              setTimeout(() => resolve(), 2000);
            }
          }),
      ),
    );
    const rect = cardRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: dpr,
      backgroundColor: '#ffffff',
      width: rect.width,
      height: rect.height,
    });
  }, []);

  // "保存图片" button — 普通浏览器环境
  const generateImage = useCallback(async () => {
    setIsGenerating(true);
    setStatusMessage('正在生成图片...');
    try {
      const dataUrl = await generatePosterDataUrl();

      // Mobile: system share
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && navigator.share) {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `beiyoo-mbti-${result.type}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `我的 MBTI 倾向是 ${result.displayType}`,
              text: `${result.summary} - 来测测你的人格类型吧！`,
              files: [file],
            });
            setStatusMessage('已打开系统分享');
            return;
          }
        } catch {
          // user cancelled or share failed
        }
      }

      // Desktop: download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `beiyoo-mbti-${result.type}.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
      setStatusMessage('图片已开始下载');
    } catch (error: unknown) {
      console.error('生成分享卡片失败:', error);
      setStatusMessage(`生成图片失败：${error instanceof Error ? error.message : '请尝试截图分享'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [result.type, result.displayType, result.summary, generatePosterDataUrl]);

  // "分享" button — 普通浏览器环境
  const shareToWeChat = useCallback(async () => {
    setIsGenerating(true);
    setStatusMessage('正在准备分享图片...');
    try {
      const dataUrl = await generatePosterDataUrl();

      // Try Web Share API
      if (navigator.share) {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `beiyoo-mbti-${result.type}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `我的 MBTI 倾向是 ${result.displayType}`,
              text: `${result.summary} - 来测测你的人格类型吧！`,
              files: [file],
            });
            setStatusMessage('已打开系统分享');
            return;
          }
        } catch (shareError: unknown) {
          console.info('Native share failed:', shareError instanceof Error ? shareError.message : shareError);
        }
      }

      // Fallback: clipboard
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setStatusMessage('图片已复制到剪贴板，请粘贴到聊天窗口分享');
      } catch (clipboardError: unknown) {
        console.error('Clipboard failed:', clipboardError instanceof Error ? clipboardError.message : clipboardError);
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
              <body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#000;">
                <img src="${dataUrl}" style="max-width:100%;display:block;" />
              </body>
            </html>
          `);
          newWindow.document.close();
          setStatusMessage('图片已在新窗口打开，请长按保存或截图分享');
        } else {
          setStatusMessage('分享失败，请截图保存');
        }
      }
    } catch (error: unknown) {
      console.error('分享失败:', error);
      setStatusMessage(`分享失败：${error instanceof Error ? error.message : '请尝试截图分享'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [result.type, result.displayType, result.summary, generatePosterDataUrl]);

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 px-4 py-4 sm:py-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[420px] max-h-[calc(100vh-2rem)] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {onClose && (
          <button
            onClick={onClose}
            className="sticky top-0 ml-auto mb-2 w-10 h-10 bg-white/95 text-gray-700 rounded-full shadow-lg font-semibold hover:bg-white transition-colors flex items-center justify-center z-10"
            aria-label="关闭分享卡片"
          >
            ×
          </button>
        )}
        {/* 预览区域 */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div
            ref={cardRef}
            data-share-card
            className="bg-[linear-gradient(145deg,#f7fbff_0%,#e8f7ff_48%,#fff7ed_100%)] p-6 sm:p-8 rounded-2xl text-gray-900 w-full max-w-[420px] mx-auto box-border border border-sky-100"
          >
            <div className="text-center mb-8">
              <p className="inline-flex items-center rounded-full bg-primary-500 px-4 py-1.5 text-sm font-semibold text-white mb-5 tracking-wide">
                Beiyoo MBTI 人格测试
              </p>
              <h2 className="text-5xl sm:text-6xl font-bold mb-4 text-primary-700">{result.displayType}</h2>
              <p className="text-xl sm:text-2xl text-gray-700 leading-snug">{result.summary}</p>
            </div>
            <div className="bg-white/85 rounded-xl p-5 mb-6 shadow-sm border border-white">
              <p className="text-base leading-relaxed text-gray-700">{result.details}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {['E/I', 'S/N', 'T/F', 'J/P'].map((pair) => (
                <span
                  key={pair}
                  className="rounded-lg bg-white/75 py-2 text-center text-xs font-semibold text-primary-700"
                >
                  {pair}
                </span>
              ))}
            </div>
            <div className="text-center text-primary-700">
              <p className="text-sm tracking-widest font-semibold">BEIYOO · AI</p>
              <p className="text-xs text-gray-500 mt-1">测测你的四维偏好倾向</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        {statusMessage && (
          <p className="mb-3 rounded-xl bg-white/95 px-4 py-3 text-sm text-gray-700 shadow-sm">
            {statusMessage}
          </p>
        )}

        <div className="sticky bottom-0 flex gap-3 justify-center w-full max-w-[420px] mx-auto bg-black/20 backdrop-blur-sm py-2">
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

      </div>
    </div>
  );
}
