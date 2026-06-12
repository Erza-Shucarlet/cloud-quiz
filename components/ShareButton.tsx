'use client';

import { useState, useCallback, useRef } from 'react';
import { generateScreenshot, type ScreenshotData } from '@/lib/screenshot-canvas';

interface ShareButtonProps {
  data: ScreenshotData;
}

export default function ShareButton({ data }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cachedBlobRef = useRef<Blob | null>(null);

  const ensureScreenshot = useCallback(async (): Promise<Blob | null> => {
    if (cachedBlobRef.current) return cachedBlobRef.current;
    try {
      const blob = await generateScreenshot(data);
      cachedBlobRef.current = blob;
      return blob;
    } catch (err) {
      console.error('Canvas 截图失败:', err);
      setError('图片生成失败');
      return null;
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    setLoading(true);
    setError(null);
    const blob = await ensureScreenshot();
    if (!blob) { setLoading(false); return; }

    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    const file = new File([blob], `云宇宙猜图_${data.score}分.png`, { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: '云宇宙猜角色',
          text: `我在云宇宙猜角色中得了 ${data.score} 分！用时 ${data.timeStr} ✨`,
          files: [file],
        });
        setLoading(false);
        return;
      } catch { /* 降级 */ }
    }

    // 降级：下载
    const a = document.createElement('a');
    a.href = url;
    a.download = `云宇宙猜图_${data.score}分.png`;
    a.click();
    setLoading(false);
  }, [ensureScreenshot, data]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    setError(null);
    const blob = await ensureScreenshot();
    if (!blob) { setLoading(false); return; }

    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    window.open(url, '_blank');
    setLoading(false);
  }, [ensureScreenshot]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3 w-full max-w-sm">
        <button type="button" onClick={handleShare} disabled={loading}
          className="btn-secondary flex-1 disabled:opacity-60">
          📤 分享
        </button>
        <button type="button" onClick={handleSave} disabled={loading}
          className="btn-primary flex-1 disabled:opacity-60">
          {loading ? '⏳ 生成中...' : '💾 保存图片'}
        </button>
      </div>
      {blobUrl && (
        <p className="text-xs text-yun-text-muted text-center">
          保存按钮打开图片后，长按即可存入相册 ✨
        </p>
      )}
      {error && <p className="text-xs text-yun-wrong">{error}</p>}
    </div>
  );
}
