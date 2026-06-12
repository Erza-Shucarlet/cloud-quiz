'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageCardProps {
  src: string;
  alt: string;
  onClick?: () => void;
  disabled?: boolean;
  state?: 'idle' | 'selected' | 'correct' | 'wrong';
  size?: 'sm' | 'md' | 'lg';
}

export default function ImageCard({
  src,
  alt,
  onClick,
  disabled = false,
  state = 'idle',
  size = 'md',
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-40 h-40 sm:w-48 sm:h-48',
  };

  const stateClasses = {
    idle:
      'border-2 border-yun-border hover:border-yun-primary-light hover:shadow-lg hover:scale-105',
    selected:
      'border-3 border-yun-primary ring-2 ring-yun-primary-light shadow-lg scale-105',
    correct:
      'border-3 border-yun-correct ring-2 ring-yun-correct/30 shadow-lg',
    wrong:
      'border-3 border-yun-wrong ring-2 ring-yun-wrong/30 opacity-60',
  };

  const cursorClass = disabled ? 'cursor-default' : 'cursor-pointer';

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={alt}
      className={`
        relative rounded-xl overflow-hidden bg-yun-surface p-0
        appearance-none text-left disabled:opacity-100
        transition-all duration-200 ease-out
        ${sizeClasses[size]}
        ${stateClasses[state]}
        ${cursorClass}
      `}
      onClick={onClick}
    >
      {imgError ? (
        <div className="w-full h-full flex items-center justify-center bg-yun-surface-soft text-yun-text-muted text-xs text-center p-2">
          🖼️ 图片加载失败
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          className="object-cover"
          onError={() => setImgError(true)}
          unoptimized
          draggable={false}
        />
      )}

      {/* 状态标记 */}
      {state === 'correct' && (
        <div className="absolute top-1 right-1 bg-yun-correct text-yun-text-light rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
          ✓
        </div>
      )}
      {state === 'wrong' && (
        <div className="absolute top-1 right-1 bg-yun-wrong text-yun-text-light rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
          ✗
        </div>
      )}
    </button>
  );
}
