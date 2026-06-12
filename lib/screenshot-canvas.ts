/**
 * Canvas 分享图 — GPT 布局 + 云宇宙品牌
 */

export interface ScreenshotData {
  nickname: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeStr: string;
  accuracy: number;
  dateStr: string;
}

const PURPLE = '#7C3AED';
const LIGHT = '#A78BFA';
const PINK = '#F472B6';
const GOLD = '#FBBF24';
const BG = '#F7F2FF';
const DARK = '#2B2140';
const MUTED = '#7B6A99';
const WHITE = '#FFFFFF';
const BORDER = '#E9D5FF';
const W = 750;
const H = 1200;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function text(
  ctx: CanvasRenderingContext2D,
  str: string, x: number, y: number,
  size: number, color: string, weight = '700',
  align: CanvasTextAlign = 'center'
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "PingFang SC","Microsoft YaHei",sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function card(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bgColor: string, icon: string, label: string, value: string
) {
  rr(ctx, x, y, w, h, 26);
  ctx.fillStyle = bgColor;
  ctx.fill();

  text(ctx, icon, x + w / 2, y + 34, 28, DARK, '700');
  text(ctx, label, x + w / 2, y + 72, 14, MUTED, '700');
  text(ctx, value, x + w / 2, y + 106, 26, DARK, '900');
}

export async function generateScreenshot(data: ScreenshotData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const cx = W / 2;

  // ── 背景 ──
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // 背景装饰圆
  ctx.fillStyle = 'rgba(124,58,237,0.07)';
  ctx.beginPath(); ctx.arc(100, 140, 180, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(251,191,36,0.16)';
  ctx.beginPath(); ctx.arc(660, 200, 130, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(124,58,237,0.06)';
  ctx.beginPath(); ctx.arc(680, 1060, 200, 0, Math.PI * 2); ctx.fill();

  // ── 主卡片 ──
  ctx.save();
  ctx.shadowColor = 'rgba(124,58,237,0.16)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 14;
  rr(ctx, 32, 40, W - 64, H - 80, 44);
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.restore();

  rr(ctx, 32, 40, W - 64, H - 80, 44);
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── 标题 ──
  const titleY = 106;
  const pillW = 350, pillH = 54;
  rr(ctx, cx - pillW / 2, titleY, pillW, pillH, pillH / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(124,58,237,0.14)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  text(ctx, '🌙  云宇宙 · 猜角色', cx, titleY + pillH / 2, 20, PURPLE, '900');

  // 玩家
  const playerY = titleY + pillH + 26;
  rr(ctx, cx - 100, playerY, 200, 40, 20);
  ctx.fillStyle = 'rgba(124,58,237,0.08)';
  ctx.fill();
  text(ctx, '👤  ' + data.nickname, cx, playerY + 20, 17, DARK, '700');

  // 装饰
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⭐', 78, 120);
  ctx.fillText('☁️', 606, 132);

  // ── 分数圆 ──
  const cCY = playerY + 168;
  const cR = 118;

  // 渐变圆
  const grad = ctx.createLinearGradient(cx - cR, cCY - cR, cx + cR, cCY + cR);
  grad.addColorStop(0, PURPLE);
  grad.addColorStop(0.48, LIGHT);
  grad.addColorStop(1, PINK);

  ctx.save();
  ctx.shadowColor = 'rgba(124,58,237,0.30)';
  ctx.shadowBlur = 46;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cCY, cR + 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 白边
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cCY, cR, 0, Math.PI * 2);
  ctx.stroke();

  // SCORE 标签
  ctx.save();
  ctx.translate(cx + 98, cCY - 102);
  ctx.rotate(0.12);
  rr(ctx, -42, -16, 84, 32, 16);
  ctx.shadowColor = 'rgba(251,191,36,0.30)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.restore();
  text(ctx, 'SCORE', cx + 98, cCY - 102, 13, DARK, '900');

  // 分数数字（带阴影）
  ctx.save();
  ctx.shadowColor = 'rgba(43,33,64,0.18)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 6;
  text(ctx, String(data.score), cx, cCY - 16, 108, GOLD, '900');
  ctx.restore();
  text(ctx, String(data.score), cx, cCY - 16, 108, GOLD, '900');

  // POINTS
  text(ctx, 'POINTS', cx, cCY + 52, 22, 'rgba(255,255,255,0.90)', '900');

  // 正确率
  const accY = cCY + cR + 14;
  rr(ctx, cx - 84, accY - 16, 168, 34, 17);
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.strokeStyle = 'rgba(124,58,237,0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  text(ctx, `${data.correctCount}/${data.totalQuestions} 正确`, cx, accY + 1, 15, MUTED, '700');

  // ── 统计区 ──
  const statsY = accY + 78;
  const boxW = 285;

  card(ctx, 70, statsY, boxW, 155, 'rgba(124,58,237,0.07)', '⏱', '用时', data.timeStr);
  card(ctx, 72 + boxW + 36, statsY, boxW, 155, 'rgba(251,191,36,0.16)', '🎯', '正确率', data.accuracy + '%');

  // 日期+玩家
  const detailY = statsY + 180;
  rr(ctx, 70, detailY, W - 140, 98, 22);
  ctx.fillStyle = 'rgba(247,242,255,0.80)';
  ctx.fill();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1.5;
  rr(ctx, 70, detailY, W - 140, 98, 22);
  ctx.stroke();
  ctx.setLineDash([]);

  text(ctx, '📅  日期', 118, detailY + 38, 17, MUTED, '700', 'left');
  text(ctx, data.dateStr, W - 118, detailY + 38, 17, DARK, '900', 'right');
  text(ctx, '✨  玩家', 118, detailY + 72, 17, MUTED, '700', 'left');
  text(ctx, data.nickname, W - 118, detailY + 72, 17, DARK, '900', 'right');

  // ── 页脚 ──
  const footerY = detailY + 140;
  text(ctx, 'SHARE YOUR YUN RESULT', cx, footerY, 14, MUTED, '700');
  text(ctx, '☁️ ⭐ 💜 ⭐ ☁️', cx, footerY + 44, 26, DARK, '700');

  // ── 二维码 ──
  try {
    const QRCode = await import('qrcode');
    const qrDataUrl = await QRCode.toDataURL('https://cloud-quiz.chubbyducky.com', {
      width: 120, margin: 1, color: { dark: '#2B2140', light: '#F7F2FF' }
    });
    const qrImg = new Image();
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = reject;
      qrImg.src = qrDataUrl;
    });
    // 卡片右下角: 720-120-40 = 560, footerY-10-120 = footerY-130
    ctx.drawImage(qrImg, W - 170, footerY - 20, 120, 120);
    text(ctx, '扫码来玩', W - 110, footerY + 110, 12, MUTED, '600');
  } catch {
    // QR 库不可用时静默跳过
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
  if (!blob) throw new Error('Canvas failed');
  return blob;
}
