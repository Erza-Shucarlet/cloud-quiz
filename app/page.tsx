'use client';

import { useState } from 'react';
import { setSessionValue } from '@/lib/session';

export default function HomePage() {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    const name = nickname.trim() || '神秘玩家';
    // 将昵称存入 sessionStorage，游戏页读取
    setSessionValue('quiz-nickname', name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90dvh] gap-8">
      {/* Logo 区域 */}
      <div className="text-center">
        <div className="text-6xl mb-3 animate-bounce">☁️</div>
        <h1 className="text-3xl font-bold text-yun-gradient">
          云宇宙 · 猜角色
        </h1>
        <p className="mt-2 text-sm text-yun-text-muted">
          看看你对云宇宙成员有多了解？✨
        </p>
      </div>

      {/* 昵称输入 */}
      <form
        action="/game"
        onSubmit={handleStart}
        className="card w-full max-w-sm flex flex-col gap-4"
      >
        <label className="text-sm text-yun-text-muted font-medium">
          👤 你的昵称
        </label>
        <input
          name="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="输入昵称开始游戏..."
          maxLength={12}
          className="
            w-full px-4 py-3 rounded-xl border-2 border-yun-border
            bg-yun-surface text-yun-text placeholder:text-yun-text-muted
            focus:border-yun-primary-light focus:ring-2 focus:ring-yun-primary-light/30
            outline-none transition-all duration-200
            text-center text-lg
          "
        />

        <button type="submit" className="btn-primary text-lg">
          🎮 开始挑战
        </button>
      </form>

      {/* 规则说明 */}
      <div className="card w-full max-w-sm text-sm text-yun-text-muted space-y-2">
        <p className="font-bold text-yun-text">📋 游戏规则</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>每回合 5 道题</li>
          <li>看到角色名 → 从 3 张图中选出对应角色</li>
          <li>答对 +10 分，答错不扣分</li>
          <li>得分相同时，用时短排名靠前</li>
        </ul>
      </div>

      {/* 排行榜入口 */}
      <button
        type="button"
        onClick={() => {
          window.location.href = '/leaderboard';
        }}
        className="text-yun-primary hover:text-yun-primary-light text-sm font-medium transition-colors"
      >
        🏆 查看排行榜 →
      </button>
    </div>
  );
}
