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
