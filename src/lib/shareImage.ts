import { toPng } from 'html-to-image';
import { uploadShareCard } from './supabase';
import type { ResultData } from '@/types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    const displayType = escapeHtml(result.displayType);
    const summary = escapeHtml(result.summary);
    const details = escapeHtml(result.details);

    // 构建分享卡片 HTML
    container.innerHTML = `
      <div id="share-card-temp" style="
        width: 420px;
        background: linear-gradient(145deg, #f7fbff 0%, #e8f7ff 48%, #fff7ed 100%);
        padding: 32px;
        border-radius: 16px;
        color: #111827;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
        border: 1px solid #e0f2fe;
      ">
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="display:inline-block;background:#0ea5e9;color:#fff;border-radius:999px;padding:6px 16px;font-size:14px;font-weight:600;margin-bottom:20px;letter-spacing:1px;">Beiyoo MBTI 人格测试</p>
          <h2 style="font-size: 56px; color:#0369a1; font-weight: bold; margin-bottom: 16px;">${displayType}</h2>
          <p style="font-size: 24px; color:#374151; line-height:1.35;">${summary}</p>
        </div>
        <div style="background: rgba(255,255,255,0.86); border-radius: 12px; padding: 20px; margin-bottom: 24px; border:1px solid #fff;">
          <p style="font-size: 16px; line-height: 1.6; color:#374151;">${details}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:24px;">
          <span style="background:rgba(255,255,255,0.75);border-radius:8px;padding:8px 0;text-align:center;font-size:12px;font-weight:600;color:#0369a1;">E/I</span>
          <span style="background:rgba(255,255,255,0.75);border-radius:8px;padding:8px 0;text-align:center;font-size:12px;font-weight:600;color:#0369a1;">S/N</span>
          <span style="background:rgba(255,255,255,0.75);border-radius:8px;padding:8px 0;text-align:center;font-size:12px;font-weight:600;color:#0369a1;">T/F</span>
          <span style="background:rgba(255,255,255,0.75);border-radius:8px;padding:8px 0;text-align:center;font-size:12px;font-weight:600;color:#0369a1;">J/P</span>
        </div>
        <div style="text-align: center;">
          <p style="font-size: 14px; color:#0369a1; font-weight:600; letter-spacing: 4px;">BEIYOO · AI</p>
          <p style="font-size: 12px; color:#6b7280; margin-top: 4px;">测测你的四维偏好倾向</p>
        </div>
      </div>
    `;

    const cardElement = container.querySelector('#share-card-temp');

    if (!cardElement) {
      throw new Error('卡片元素未找到');
    }

    // 等待字体加载
    await document.fonts.ready;

    // 生成图片
    const dpr = window.devicePixelRatio || 1;

    const dataUrl = await toPng(cardElement as HTMLElement, {
      cacheBust: true,
      pixelRatio: dpr,
      backgroundColor: '#ffffff',
    });

    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      throw new Error('canvas 转图片失败');
    }

    // 转换为 blob 检查
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    if (blob.size === 0) {
      throw new Error('图片生成失败，blob 为空');
    }

    // 上传到 Supabase
    const publicUrl = await uploadShareCard(dataUrl, result.type);

    if (!publicUrl) {
      throw new Error('图片上传返回空 URL');
    }

    return publicUrl;
  } catch (error: unknown) {
    console.error('generateAndUploadShareImage failed:', error);
    throw error;
  } finally {
    // 清理临时容器
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}
