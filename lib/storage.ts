import { LeaderboardEntry } from './types';

const STORAGE_KEY = 'cloud-quiz-leaderboard';

/** 从 localStorage 读取排行榜 */
function getLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存到 localStorage */
function saveLocalLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full
  }
}

/** 获取排行榜（localStorage 降级，只取今日） */
export function getLocalEntries(): LeaderboardEntry[] {
  const entries = getLocalLeaderboard();
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter((e) => e.date === today);
  todayEntries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time_seconds - b.time_seconds;
  });
  // 添加排名
  return todayEntries.map((e, i) => ({ ...e, rank: i + 1 }));
}

/** 添加一条记录到本地排行榜 */
export function addLocalEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const entries = getLocalLeaderboard();
  entries.push({
    ...entry,
    date: new Date().toISOString().split('T')[0],
  });
  // 只保留前 50 条
  const trimmed = entries
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time_seconds - b.time_seconds;
    })
    .slice(0, 50);
  saveLocalLeaderboard(trimmed);
  return getLocalEntries();
}
