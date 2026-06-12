import { LeaderboardEntry } from './types';

/**
 * 通过 Vercel API 代理访问 Supabase（解决国内 supabase.co 被墙）
 */

const PROXY_URL = '/api/sb';

/** 从 Supabase 获取今日排行榜 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `${PROXY_URL}?table=leaderboard&select=*&date=${today}&order=score.desc,time_seconds.asc&limit=50`;
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data.map((row: Record<string, unknown>, i: number) => ({
      id: row.id as number,
      nickname: row.nickname as string,
      score: row.score as number,
      time_seconds: row.time_seconds as number,
      date: row.date as string,
      rank: i + 1,
    }));
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return [];
  }
}

/** 向 Supabase 提交成绩 */
export async function submitScore(entry: LeaderboardEntry): Promise<boolean> {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          nickname: entry.nickname,
          score: entry.score,
          time_seconds: entry.time_seconds,
          date: new Date().toISOString().split('T')[0],
        },
      }),
    });

    if (!res.ok) {
      console.error('Supabase submit error:', await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase submit error:', err);
    return false;
  }
}

/** 保留兼容 */
export const isSupabaseConfigured = true;
