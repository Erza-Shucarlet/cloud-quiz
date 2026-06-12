import { LeaderboardEntry } from './types';

/**
 * 排行榜数据层 — 当前仅 localStorage
 * Supabase 待连通后再启用
 */

/** 返回空（降级到 localStorage） */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  return [];
}

/** 返回 false（降级到 localStorage） */
export async function submitScore(_entry: LeaderboardEntry): Promise<boolean> {
  return false;
}

export const isSupabaseConfigured = false;
