'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalEntries } from '@/lib/storage';
import { fetchLeaderboard } from '@/lib/supabase';
import { formatTime } from '@/lib/game-engine';
import type { LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 尝试 Supabase，降级到 localStorage
      const remote = await fetchLeaderboard().catch(() => []);
      if (remote.length > 0) {
        setEntries(remote);
      } else {
        setEntries(getLocalEntries());
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 min-h-[85dvh] pt-2">
      {/* 标题 */}
      <div className="text-center">
        <div className="text-4xl mb-2">🏆</div>
        <h1 className="text-2xl font-bold text-yun-text">排行榜</h1>
        <p className="text-xs text-yun-text-muted mt-1">
          {entries.length === 0
            ? '还没有人玩过，来做第一名吧！'
            : `共 ${entries.length} 条记录`}
        </p>
      </div>

      {/* 排行榜列表 */}
      {loading ? (
        <div className="flex items-center gap-2 text-yun-text-muted mt-10">
          <span className="animate-spin">☁️</span>
          加载中...
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center text-yun-text-muted mt-10 space-y-3">
          <div className="text-5xl">🎮</div>
          <p>还没有成绩记录呢~</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="btn-primary inline-block"
          >
            去挑战
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-2">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className={`
                card flex items-center gap-3 py-3 px-4
                ${idx === 0 ? 'ring-2 ring-yun-score' : ''}
                ${idx === 1 ? 'ring-2 ring-yun-primary-light' : ''}
                ${idx === 2 ? 'ring-2 ring-yun-primary-pink' : ''}
              `}
              style={{
                backgroundColor:
                  idx === 0
                    ? 'rgba(251, 191, 36, 0.10)'
                    : idx === 1
                      ? 'rgba(167, 139, 250, 0.10)'
                      : idx === 2
                        ? 'rgba(244, 114, 182, 0.10)'
                        : 'var(--color-yun-surface)',
              }}
            >
              {/* 排名 */}
              <div className="w-8 text-center font-black text-lg">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-yun-text truncate">
                  {entry.nickname}
                </div>
                <div className="text-xs text-yun-text-muted">
                  {entry.date}
                </div>
              </div>

              {/* 分数 */}
              <div className="text-right">
                <div className="font-black text-yun-score text-lg">
                  {entry.score}
                  <span className="text-xs text-yun-text-muted font-normal"> 分</span>
                </div>
                <div className="text-xs text-yun-text-muted">
                  ⏱ {formatTime(entry.time_seconds)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 返回按钮 */}
      <button
        type="button"
        onClick={() => router.push('/')}
        className="btn-secondary mt-2"
      >
        🏠 返回首页
      </button>
    </div>
  );
}
