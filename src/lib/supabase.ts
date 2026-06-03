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

/**
 * 上传分享海报到 Supabase Storage
 * @param dataUrl 图片的 dataURL (base64)
 * @param type MBTI 类型
 * @returns 代理后的图片 URL (用于小程序分享)
 */
export async function uploadShareCard(dataUrl: string, type: string): Promise<string> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    if (blob.size === 0) {
      throw new Error('图片数据为空');
    }

    // 生成文件名（不含路径前缀）
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const fileName = `${type}-${timestamp}-${random}.png`;
    // filePath 只使用文件名，bucket 名已在 .from('share-cards') 中指定
    const filePath = fileName;

    const { error } = await supabase.storage.from('share-cards').upload(filePath, blob, {
      contentType: 'image/png',
      upsert: true,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 使用 file.beiyoo.cn 代理域名，确保小程序域名白名单可用
    const proxyImageUrl = `https://file.beiyoo.cn/share-cards/${encodeURIComponent(fileName)}`;

    // 最终传给小程序的 imageUrl（使用代理 URL）
    const finalImageUrl = proxyImageUrl;
    return finalImageUrl;
  } catch (error: unknown) {
    console.error('uploadShareCard failed:', error);
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
