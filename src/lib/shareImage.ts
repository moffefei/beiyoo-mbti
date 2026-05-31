import { toPng } from 'html-to-image';
import { uploadShareCard } from './supabase';
import type { ResultData } from '@/types';

/**
 * 生成分享卡片图片并上传到 Supabase
 * @param result MBTI 测试结果
 * @returns 图片的公开 URL
 */
export async function generateAndUploadShareImage(result: ResultData): Promise<string> {
  console.log('[MBTI_SHARE_DEBUG] ===== 开始生成分享海报 =====');

  // 创建临时容器
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  console.log('[MBTI_SHARE_DEBUG] 临时容器已创建');

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
    console.log('[MBTI_SHARE_DEBUG] poster DOM 是否存在:', !!cardElement);

    if (!cardElement) {
      throw new Error('卡片元素未找到');
    }

    // 获取 DOM 宽高
    const rect = (cardElement as HTMLElement).getBoundingClientRect();
    console.log('[MBTI_SHARE_DEBUG] poster DOM 宽高:', { width: rect.width, height: rect.height });

    // 等待字体加载
    console.log('[MBTI_SHARE_DEBUG] 等待字体加载...');
    await document.fonts.ready;
    console.log('[MBTI_SHARE_DEBUG] 字体加载完成');

    // 生成图片
    console.log('[MBTI_SHARE_DEBUG] 开始调用 html-to-image toPng...');
    const dpr = window.devicePixelRatio || 1;
    console.log('[MBTI_SHARE_DEBUG] devicePixelRatio:', dpr);

    const dataUrl = await toPng(cardElement as HTMLElement, {
      cacheBust: true,
      pixelRatio: dpr,
      backgroundColor: '#ffffff',
    });

    console.log('[MBTI_SHARE_DEBUG] toPng 生成完成');
    console.log('[MBTI_SHARE_DEBUG] dataUrl 长度:', dataUrl.length);
    console.log('[MBTI_SHARE_DEBUG] dataUrl 前缀:', dataUrl.substring(0, 50));

    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      console.error('[MBTI_SHARE_DEBUG] canvas 转图片失败，dataUrl 无效');
      throw new Error('canvas 转图片失败');
    }

    // 转换为 blob 检查
    console.log('[MBTI_SHARE_DEBUG] 开始 fetch dataUrl 获取 blob...');
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    console.log('[MBTI_SHARE_DEBUG] blob size:', blob.size);
    console.log('[MBTI_SHARE_DEBUG] blob type:', blob.type);

    if (blob.size === 0) {
      console.error('[MBTI_SHARE_DEBUG] blob size 为 0');
      throw new Error('图片生成失败，blob 为空');
    }

    // 上传到 Supabase
    console.log('[MBTI_SHARE_DEBUG] 开始调用 uploadShareCard...');
    const publicUrl = await uploadShareCard(dataUrl, result.type);
    console.log('[MBTI_SHARE_DEBUG] uploadShareCard 返回:', publicUrl);

    if (!publicUrl) {
      console.error('[MBTI_SHARE_DEBUG] uploadShareCard 返回空值');
      throw new Error('图片上传返回空 URL');
    }

    console.log('[MBTI_SHARE_DEBUG] ===== 分享海报生成完成 =====');
    return publicUrl;
  } catch (error: any) {
    console.error('[MBTI_SHARE_DEBUG] generateAndUploadShareImage 失败:', error);
    console.error('[MBTI_SHARE_DEBUG] error message:', error?.message);
    console.error('[MBTI_SHARE_DEBUG] error stack:', error?.stack);
    throw error;
  } finally {
    // 清理临时容器
    if (container.parentNode) {
      document.body.removeChild(container);
      console.log('[MBTI_SHARE_DEBUG] 临时容器已清理');
    }
  }
}
