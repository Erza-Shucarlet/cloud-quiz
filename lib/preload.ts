/**
 * 图片预加载 — 只加载指定路径列表
 */
export async function preloadImages(
  paths: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  if (paths.length === 0) return;

  let loaded = 0;
  const total = paths.length;
  onProgress?.(loaded, total);

  // 每次最多并发 8 个，避免压垮移动网络
  const BATCH = 8;
  for (let i = 0; i < paths.length; i += BATCH) {
    const batch = paths.slice(i, i + BATCH);
    await Promise.all(
      batch.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => {
              loaded++;
              onProgress?.(loaded, total);
              resolve();
            };
            img.src = src;
          })
      )
    );
  }
}
