import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '云宇宙 · 猜角色',
  description: '猜猜看这是哪位云宇宙成员？⭐ 识图答题小游戏',
  openGraph: {
    title: '云宇宙 · 猜角色',
    description: '猜猜看这是哪位云宇宙成员？⭐ 识图答题小游戏',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {/* 顶部装饰 */}
        <div className="fixed top-0 left-0 w-full h-1 bg-yun-main-gradient z-50 pointer-events-none" />

        {/* 主内容 */}
        <main className="max-w-lg mx-auto px-4 py-6 pb-20">
          {children}
        </main>

        {/* 底部装饰 */}
        <div
          className="fixed bottom-0 left-0 w-full h-1 z-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, var(--color-yun-primary-pink), var(--color-yun-primary-light), var(--color-yun-accent))',
          }}
        />
      </body>
    </html>
  );
}
