import { createClient } from '@supabase/supabase-js';
import type { DimensionScore } from '@/types';

const supabaseUrl = 'https://oezqnopahohliveopdrg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lenFub3BhaG9obGl2ZW9wZHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTg4MTAsImV4cCI6MjA5NTYzNDgxMH0.ZttO8WPNzSUjkELGphEiP45q29ThAXBbLZ0jABbedqs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveMBTIResult(type: string, scores: DimensionScore) {
  const { data, error } = await supabase
    .from('mbti_results')
    .insert([
      {
        mbti_type: type,
        scores: scores,
      },
    ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return null;
  }

  return data;
}

export async function getTotalCount(): Promise<number> {
  const { count, error } = await supabase
    .from('mbti_results')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Supabase count error:', error);
    return 0;
  }

  return count || 0;
}

export async function uploadShareCard(dataUrl: string, type: string): Promise<string> {
  console.log('[MBTI_SHARE_DEBUG] ===== 开始上传图片 =====');
  console.log('[MBTI_SHARE_DEBUG] uploadShareCard 被调用');
  console.log('[MBTI_SHARE_DEBUG] dataUrl 长度:', dataUrl.length);

  try {
    const res = await fetch(dataUrl);
    console.log('[MBTI_SHARE_DEBUG] fetch dataUrl 状态:', res.status, res.statusText);

    const blob = await res.blob();
    console.log('[MBTI_SHARE_DEBUG] blob size:', blob.size);
    console.log('[MBTI_SHARE_DEBUG] blob type:', blob.type);

    if (blob.size === 0) {
      console.error('[MBTI_SHARE_DEBUG] blob 为空');
      throw new Error('图片数据为空');
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filePath = `share-cards/${type}-${timestamp}-${random}.png`;
    console.log('[MBTI_SHARE_DEBUG] 上传文件路径:', filePath);

    const { error } = await supabase.storage.from('share-cards').upload(filePath, blob, {
      contentType: 'image/png',
      upsert: false,
    });

    if (error) {
      console.error('[MBTI_SHARE_DEBUG] Supabase upload error:', error);
      console.error('[MBTI_SHARE_DEBUG] error message:', error.message);
      console.error('[MBTI_SHARE_DEBUG] error status:', (error as any).status);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('[MBTI_SHARE_DEBUG] Supabase upload 成功');

    const { data: urlData } = supabase.storage.from('share-cards').getPublicUrl(filePath);
    console.log('[MBTI_SHARE_DEBUG] publicUrl:', urlData.publicUrl);
    console.log('[MBTI_SHARE_DEBUG] publicUrl 是 HTTPS:', urlData.publicUrl.startsWith('https://'));

    console.log('[MBTI_SHARE_DEBUG] ===== 图片上传完成 =====');
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('[MBTI_SHARE_DEBUG] uploadShareCard 失败:', error);
    console.error('[MBTI_SHARE_DEBUG] error message:', error?.message);
    throw error;
  }
}

export async function getStats() {
  // 获取总测试人数
  const totalCount = await getTotalCount();

  // 获取各类型分布
  const { data: typeData, error: typeError } = await supabase
    .from('mbti_results')
    .select('mbti_type');

  if (typeError) {
    console.error('Supabase type query error:', typeError);
    return null;
  }

  // 统计各类型数量
  const typeCounts: Record<string, number> = {};
  typeData?.forEach((item) => {
    const t = item.mbti_type;
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });

  return {
    total: totalCount,
    typeCounts,
  };
}
