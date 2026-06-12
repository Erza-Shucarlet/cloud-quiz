'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImageCard from '@/components/ImageCard';
import ProgressBar from '@/components/ProgressBar';
import { createGame, submitAnswer, formatTime } from '@/lib/game-engine';
import type { GameState, Question } from '@/lib/types';
import { getSessionValue, setSessionValue } from '@/lib/session';
import { preloadImages } from '@/lib/preload';

type FeedbackState = {
  question: Question;
  selected: string;
  isCorrect: boolean;
} | null;

type Phase = 'loading' | 'ready' | 'playing';

export default function GamePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [elapsed, setElapsed] = useState(0);
  const nicknameRef = useRef('神秘玩家');

  // 预加载 → 就绪
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    nicknameRef.current =
      params.get('nickname')?.trim() ||
      getSessionValue('quiz-nickname') ||
      '神秘玩家';

    // 先生成题目，获取需要的图片列表
    const game = createGame(nicknameRef.current);
    const allPaths = game.questions.flatMap((q) => q.options);

    preloadImages(allPaths, (loaded, total) => {
      setLoadProgress({ loaded, total });
    }).then(() => {
      setPhase('ready');
    });
  }, []);

  // 开始游戏（用户点按钮才触发）
  const startGame = useCallback(() => {
    setPhase('playing');
    setGameState(createGame(nicknameRef.current));
  }, []);

  // 计时器
  useEffect(() => {
    if (!gameState || gameState.isFinished) return;
    const timer = setInterval(() => {
      setElapsed(Math.round((Date.now() - gameState.startTime) / 1000));
    }, 200);
    return () => clearInterval(timer);
  }, [gameState]);

  // 选择答案
  const handleSelect = useCallback(
    (imagePath: string) => {
      if (!gameState || feedback) return; // 正在显示反馈时忽略

      const result = submitAnswer(gameState, imagePath);
      setGameState(result.state);

      // 显示反馈
      const currentQ = gameState.questions[gameState.currentIndex];
      setFeedback({
        question: currentQ,
        selected: imagePath,
        isCorrect: result.isCorrect,
      });

      // 延迟后清除反馈，进入下一题或结束
      setTimeout(() => {
        setFeedback(null);
        if (result.isFinished) {
          // 保存最终结果到 sessionStorage
          const endTime = Date.now();
          const timeSeconds = Math.round(
            (endTime - gameState.startTime) / 1000
          );
          setSessionValue(
            'quiz-result',
            JSON.stringify({
              nickname: gameState.nickname,
              score: result.state.score,
              timeSeconds,
              totalQuestions: gameState.questions.length,
              correctCount: result.state.answers.filter(
                (a, i) => a && a === gameState.questions[i].correctImage
              ).length,
            })
          );
          router.push('/result');
        }
      }, 1200);
    },
    [gameState, feedback, router]
  );

  if (phase === 'loading') {
    const pct = loadProgress.total > 0 ? Math.round((loadProgress.loaded / loadProgress.total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] gap-4">
        <div className="animate-bounce text-5xl">☁️</div>
        <p className="text-yun-text-muted text-sm">图片加载中...</p>
        <div className="w-48 h-2 bg-yun-border rounded-full overflow-hidden">
          <div
            className="h-full bg-yun-main-gradient rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-yun-text-muted">{loadProgress.loaded}/{loadProgress.total}</p>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] gap-2">
        <div className="text-5xl">🎮</div>
        <p className="text-yun-text font-bold text-lg">准备就绪！</p>
        <button
          type="button"
          onClick={startGame}
          className="btn-primary mt-4 text-lg"
        >
          开始答题
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-[80dvh]">
        <div className="animate-spin text-4xl">☁️</div>
        <p className="ml-3 text-yun-text-muted">准备中...</p>
      </div>
    );
  }

  const currentQ = gameState.questions[gameState.currentIndex];

  // 判断每张图片的状态（用于高亮反馈）
  function getImageState(imgPath: string): 'idle' | 'correct' | 'wrong' {
    if (!feedback) return 'idle';
    if (imgPath === feedback.question.correctImage) return 'correct';
    if (imgPath === feedback.selected && !feedback.isCorrect) return 'wrong';
    return 'idle';
  }

  return (
    <div className="flex flex-col items-center gap-5 min-h-[85dvh]">
      {/* 顶部信息栏 */}
      <div className="w-full flex items-center justify-between">
        <div className="text-sm text-yun-text-muted">
          👤 {gameState.nickname}
        </div>
        <div className="text-sm font-mono text-yun-primary font-bold">
          ⏱ {formatTime(elapsed)}
        </div>
        <div className="text-sm font-bold text-yun-score">
          ⭐ {gameState.score} 分
        </div>
      </div>

      {/* 进度条 */}
      <ProgressBar
        current={gameState.currentIndex + 1}
        total={gameState.questions.length}
      />

      {/* 题目区域 */}
      <div className="card w-full text-center">
        <p className="text-yun-text-muted text-sm mb-1">哪一位是？</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-yun-text">
          {currentQ.targetName}
        </h2>
      </div>

      {/* 图片选项 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm mx-auto">
        {currentQ.options.map((imgPath, idx) => (
          <ImageCard
            key={imgPath}
            src={imgPath}
            alt={`选项 ${idx + 1}`}
            onClick={() => handleSelect(imgPath)}
            disabled={!!feedback}
            state={getImageState(imgPath)}
          />
        ))}
      </div>

      {/* 反馈提示 */}
      {feedback && (
        <div
          className="
            text-center px-6 py-3 rounded-full font-bold text-lg
            animate-pop
          "
          style={{
            backgroundColor: feedback.isCorrect
              ? 'rgba(52, 211, 153, 0.14)'
              : 'rgba(255, 92, 138, 0.14)',
            color: feedback.isCorrect
              ? 'var(--color-yun-correct)'
              : 'var(--color-yun-wrong)',
          }}
        >
          {feedback.isCorrect ? '✅ 答对啦！+20 分' : '❌ 答错了~'}
        </div>
      )}

      {/* 底部装饰 */}
      <div className="mt-auto text-center text-xs text-yun-text-muted pb-4">
        选择与角色名对应的图片吧 ✨
      </div>
    </div>
  );
}
