'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-yun-text-muted mb-1">
        <span>
          第 {current} / {total} 题
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-2 bg-yun-border rounded-full overflow-hidden">
        <div
          className="h-full bg-yun-main-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
