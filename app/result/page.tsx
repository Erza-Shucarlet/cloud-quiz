'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShareButton from '@/components/ShareButton';
import { formatTime } from '@/lib/game-engine';
import { addLocalEntry } from '@/lib/storage';
import { submitScore } from '@/lib/supabase';

interface ResultData {
  nickname: string;
  score: number;
  timeSeconds: number;
  totalQuestions: number;
  correctCount: number;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('quiz-result');
    if (!raw) {
      router.push('/');
      return;
    }
    const data: ResultData = JSON.parse(raw);

    const entry = {
      nickname: data.nickname,
      score: data.score,
      time_seconds: data.timeSeconds,
      date: new Date().toISOString().split('T')[0],
    };
    addLocalEntry(entry);
    submitScore(entry).catch(() => {});

    setResult(data);
  }, [router]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[80dvh]">
        <div className="animate-bounce text-5xl">☁️</div>
      </div>
    );
  }

  const timeStr = formatTime(result.timeSeconds);
  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100);
  const dateStr = new Date().toLocaleDateString('zh-CN');

  return (
    <div className="flex flex-col items-center gap-6 min-h-[85dvh] px-4 pt-4 pb-8">

      {/* 结果卡片（仅展示用） */}
      <div
        className="
          card relative w-full max-w-sm overflow-hidden !p-0
          border-2 border-[var(--color-yun-border)]
          rounded-[2rem]
          shadow-[0_24px_70px_rgba(124,58,237,0.22)]
        "
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(251,191,36,0.28) 0%, transparent 24%), radial-gradient(circle at 88% 14%, rgba(124,58,237,0.20) 0%, transparent 26%), linear-gradient(180deg, #FFFFFF 0%, #FBF8FF 48%, var(--color-yun-bg) 100%)',
        }}
      >
        {/* 装饰元素 */}
        <div className="pointer-events-none absolute -left-10 top-20 h-28 w-28 rounded-full bg-[rgba(124,58,237,0.10)] blur-sm" />
        <div className="pointer-events-none absolute -right-12 bottom-28 h-32 w-32 rounded-full bg-[rgba(251,191,36,0.18)] blur-sm" />
        <div className="pointer-events-none absolute left-6 top-7 text-2xl rotate-[-12deg]">⭐</div>
        <div className="pointer-events-none absolute right-7 top-8 text-3xl rotate-[10deg]">☁️</div>
        <div className="pointer-events-none absolute right-8 top-36 text-xl rotate-[18deg]">✨</div>
        <div className="pointer-events-none absolute left-8 bottom-28 text-2xl rotate-[-8deg]">☁️</div>

        {/* 顶部标题区 */}
        <div className="relative px-6 pt-8 pb-4 text-center">
          <div
            className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-[rgba(124,58,237,0.18)] px-4 py-2 shadow-[0_10px_24px_rgba(124,58,237,0.12)]"
            style={{ backgroundColor: 'rgba(255,255,255,0.75)' }}
          >
            <span className="text-lg">🌙</span>
            <span className="text-xs font-black tracking-[0.22em] text-[var(--color-yun-primary)]">
              云宇宙 · 猜角色
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(124,58,237,0.08)] px-4 py-1.5 text-sm font-bold text-[var(--color-yun-text)]">
            <span>👤</span>
            <span className="max-w-[180px] truncate">{result.nickname}</span>
          </div>
        </div>

        {/* 分数主视觉 */}
        <div className="relative px-6 pb-5 text-center">
          <div className="relative mx-auto aspect-square w-56 max-w-[78%] rounded-full border-[10px] border-white bg-yun-main-gradient shadow-[0_22px_45px_rgba(124,58,237,0.25)]">
            <div className="absolute -top-3 -right-2 rounded-full bg-[var(--color-yun-score)] px-3 py-1 text-xs font-black text-[var(--color-yun-text)] shadow-[0_8px_18px_rgba(251,191,36,0.35)] rotate-[8deg]">
              SCORE
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[rgba(124,58,237,0.14)] bg-white px-4 py-1 text-xs font-bold text-[var(--color-yun-text-muted)] shadow-md">
              {result.correctCount}/{result.totalQuestions} 正确
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[4.8rem] font-black leading-none tracking-[-0.08em] text-[var(--color-yun-score)]"
                style={{ textShadow: '0 4px 0 rgba(43,33,64,0.16), 0 10px 28px rgba(251,191,36,0.45)' }}>
                {result.score}
              </span>
              <span className="mt-1 text-base font-black tracking-[0.24em] text-white/95">POINTS</span>
            </div>
          </div>
        </div>

        {/* 成绩信息 */}
        <div className="relative px-5 pb-6">
          <div
            className="rounded-[1.5rem] border border-[rgba(233,213,255,0.95)] p-4 shadow-[0_14px_34px_rgba(124,58,237,0.10)]"
            style={{ backgroundColor: 'rgba(255,255,255,0.82)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[rgba(124,58,237,0.07)] px-3 py-3 text-center">
                <p className="text-xl mb-1">⏱</p>
                <p className="text-xs font-bold text-[var(--color-yun-text-muted)]">用时</p>
                <p className="mt-1 text-lg font-black text-[var(--color-yun-text)]">{timeStr}</p>
              </div>
              <div className="rounded-2xl bg-[rgba(251,191,36,0.18)] px-3 py-3 text-center">
                <p className="text-xl mb-1">🎯</p>
                <p className="text-xs font-bold text-[var(--color-yun-text-muted)]">正确率</p>
                <p className="mt-1 text-lg font-black text-[var(--color-yun-text)]">{accuracy}%</p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-[var(--color-yun-border)] bg-[rgba(247,242,255,0.72)] px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-[var(--color-yun-text-muted)]">📅 日期</span>
                <span className="font-black text-[var(--color-yun-text)]">{dateStr}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-[var(--color-yun-text-muted)]">✨ 玩家</span>
                <span className="max-w-[180px] truncate font-black text-[var(--color-yun-text)]">{result.nickname}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-[var(--color-yun-text-muted)]">
              SHARE YOUR YUN RESULT
            </p>
            <p className="mt-1 text-lg">☁️ ⭐ 💜 ⭐ ☁️</p>
          </div>
        </div>
      </div>

      {/* 分享按钮 — 纯 Canvas 截图，传数据不传 DOM */}
      <ShareButton data={{
        nickname: result.nickname,
        score: result.score,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        timeStr,
        accuracy,
        dateStr,
      }} />

      {/* 操作按钮 */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('quiz-result');
            router.push('/game');
          }}
          className="btn-secondary flex-1"
        >
          🔄 再来一局
        </button>
        <button
          type="button"
          onClick={() => router.push('/leaderboard')}
          className="btn-primary flex-1"
        >
          🏆 排行榜
        </button>
      </div>
    </div>
  );
}
