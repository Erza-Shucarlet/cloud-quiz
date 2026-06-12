import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Supabase 是否已配置 */
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

/** 创建 Supabase 客户端（仅在配置了环境变量时可用） */
export function getSupabase() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** 从 Supabase 获取今日排行榜 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('date', today)
    .order('score', { ascending: false })
    .order('time_seconds', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>, i: number) => ({
    id: row.id as number,
    nickname: row.nickname as string,
    score: row.score as number,
    time_seconds: row.time_seconds as number,
    date: row.date as string,
    rank: i + 1,
  }));
}

/** 向 Supabase 提交成绩 */
export async function submitScore(entry: LeaderboardEntry): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from('leaderboard').insert({
    nickname: entry.nickname,
    score: entry.score,
    time_seconds: entry.time_seconds,
    date: new Date().toISOString().split('T')[0],
  });

  if (error) {
    console.error('Supabase submit error:', error);
    return false;
  }
  return true;
}
