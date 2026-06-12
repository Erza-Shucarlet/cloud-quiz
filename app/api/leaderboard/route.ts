import { NextResponse } from 'next/server';

/**
 * GET /api/leaderboard - 获取排行榜
 * 服务端 API，可选使用 Supabase
 */
export async function GET() {
  // 如果是纯静态部署（无 Supabase），返回空
  // 排行榜数据由客户端从 localStorage 获取
  return NextResponse.json({
    message: '排行榜API已就绪。配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 后启用。',
    entries: [],
  });
}
