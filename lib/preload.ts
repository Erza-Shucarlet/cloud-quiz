/**
 * 图片预加载工具
 */

import { getAllCharacters } from './characters';
import { getImagePath } from './characters';

/** 预加载所有角色图片，返回已加载数 */
export async function preloadAllImages(
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const chars = getAllCharacters();
  const allPaths: string[] = [];

  for (const char of chars) {
    for (const img of char.images) {
      allPaths.push(getImagePath(char.name, img));
    }
  }

  if (allPaths.length === 0) return;

  let loaded = 0;
  const total = allPaths.length;
  onProgress?.(loaded, total);

  const promises = allPaths.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.onerror = () => {
          loaded++;
          onProgress?.(loaded, total);
          resolve(); // 失败也不阻塞
        };
        img.src = src;
      })
  );

  // 最多等 8 秒，超时也放行
  await Promise.race([
    Promise.all(promises),
    new Promise<void>((resolve) => setTimeout(resolve, 8000)),
  ]);
}
