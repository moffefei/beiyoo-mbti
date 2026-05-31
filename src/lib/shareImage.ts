import { toPng } from 'html-to-image';
import { uploadShareCard } from './supabase';
import type { ResultData } from '@/types';

/**
 * 生成分享卡片图片并上传到 Supabase
 * @param result MBTI 测试结果
 * @returns 图片的公开 URL
 */
export async function generateAndUploadShareImage(result: ResultData): Promise<string> {
  // 创建临时容器
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  try {
    // 构建分享卡片 HTML
    container.innerHTML = `
      <div id="share-card-temp" style="
        width: 420px;
        background: linear-gradient(135deg, #8b5cf6, #ec4899, #f97316);
        padding: 32px;
        border-radius: 16px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
      ">
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="font-size: 16px; opacity: 0.8; margin-bottom: 12px; letter-spacing: 2px;">Beiyoo MBTI 人格测试</p>
          <h2 style="font-size: 60px; font-weight: bold; margin-bottom: 12px;">${result.type}</h2>
          <p style="font-size: 24px; opacity: 0.9;">${result.summary}</p>
        </div>
        <div style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 16px; line-height: 1.6;">${result.details}</p>
        </div>
        <div style="text-align: center;">
          <p style="font-size: 14px; opacity: 0.7; letter-spacing: 4px;">BEIYOO · AI</p>
          <p style="font-size: 12px; opacity: 0.5; margin-top: 4px;">测测你的人格类型</p>
        </div>
      </div>
    `;

    const cardElement = container.querySelector('#share-card-temp');
    if (!cardElement) throw new Error('卡片元素未找到');

    // 等待字体加载
    await document.fonts.ready;

    // 生成图片
    const dpr = window.devicePixelRatio || 1;
    const dataUrl = await toPng(cardElement as HTMLElement, {
      cacheBust: true,
      pixelRatio: dpr,
      backgroundColor: '#ffffff',
    });

    // 上传到 Supabase
    return uploadShareCard(dataUrl, result.type);
  } finally {
    // 清理临时容器
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}
