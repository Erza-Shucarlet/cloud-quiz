# Cloud Quiz — 技术文档

> 云宇宙·猜角色 识图答题小游戏  
> 最后更新：2026-06-12（配色重做 + 按钮修复）

---

## 1. 技术栈

| 层 | 选型 | 版本 |
|---|------|------|
| 框架 | Next.js (App Router + Turbopack) | 16.2.9 |
| 语言 | TypeScript | ^5 |
| 样式 | Tailwind CSS | ^4 |
| 数据库 | Supabase | @supabase/supabase-js ^2.108.1 |
| 截图 | html2canvas | ^1.4.1 |
| 部署 | Vercel (免费版) | — |
| React | react + react-dom | 19.2.4 |

---

## 2. 目录结构

```
cloud-quiz/
├── app/
│   ├── layout.tsx              # 根布局（固定装饰条 + pointer-events:none）
│   ├── globals.css             # 全局样式 + @theme 色板 + 按钮/卡片/动画
│   ├── page.tsx                # 首页：昵称输入 + 规则
│   ├── game/page.tsx           # 游戏页：答题核心逻辑（无 style jsx）
│   ├── result/page.tsx         # 结果页：新设计分享卡片
│   ├── leaderboard/page.tsx    # 排行榜页
│   └── api/leaderboard/route.ts # API 占位
├── components/
│   ├── ImageCard.tsx            # 图片选项卡片（4 种状态）
│   ├── ProgressBar.tsx          # 进度条
│   └── ShareButton.tsx          # html2canvas 截图 + 原生分享
├── lib/
│   ├── types.ts                 # TS 类型
│   ├── characters.ts            # 角色数据（脚本自动生成）
│   ├── game-engine.ts           # 游戏核心逻辑
│   ├── supabase.ts              # Supabase 封装
│   └── storage.ts               # localStorage 降级
├── scripts/
│   └── generate-manifest.ts     # 扫描图片 → 更新 characters.ts
├── public/
│   └── images/characters/       # 角色图片（按角色分文件夹）
│       ├── 云导/ (9) 云米/ (6) 云子/ (5) 云汐/ (5)
│       ├── 云岚/ (5) 云宝/ (10) 云朵/ (5) 云柔/ (5)
│       └── 咪咪/ (❌ 待添加)
├── .env.local                  # Supabase 环境变量（不提交）
├── TECHNICAL.md                # 本文件
└── package.json
```

---

## 3. 配色系统（2026-06-12 重做）

> 由 GPT-5.5 多模态分析 8 张角色立绘后设计  
> 主题：**紫金贵族** — 深紫主色 + 樱粉渐变 + 金色点缀 + 天空青辅色

### 色板（`@theme` in globals.css）

| 变量 | Hex | 用途 |
|------|-----|------|
| `--color-yun-primary` | #7C3AED | 主色（按钮、标题） |
| `--color-yun-primary-light` | #A78BFA | 浅紫（渐变过渡） |
| `--color-yun-primary-pink` | #F472B6 | 樱粉（渐变终点、装饰） |
| `--color-yun-accent` | #38D5E8 | 天空青（辅色点缀） |
| `--color-yun-score` | #FBBF24 | 星金币色（分数高亮） |
| `--color-yun-bg` | #F7F2FF | 梦雾浅紫（页面背景起） |
| `--color-yun-bg-sky` | #E9FBFF | 晴空浅蓝（页面背景止） |
| `--color-yun-surface` | #FFFFFF | 卡片白 |
| `--color-yun-surface-soft` | #FAF7FF | 软卡片淡紫白 |
| `--color-yun-border` | #E9D5FF | 蕾丝淡紫边框 |
| `--color-yun-correct` | #34D399 | 薄荷绿（正确反馈） |
| `--color-yun-wrong` | #FF5C8A | 樱桃粉红（错误反馈） |
| `--color-yun-text` | #2B2140 | 夜紫黑（主文字） |
| `--color-yun-text-muted` | #7B6A99 | 灰紫（次要文字） |

### 渐变

- **按钮/标题条**：`135deg, #7C3AED → #A78BFA → #F472B6`
- **页面背景**：`180deg, #F7F2FF → #E9FBFF`
- **结果卡片**：径向光晕 + 线性多层渐变

### 可用 class

| class | 说明 |
|-------|------|
| `.bg-yun-main-gradient` | 主渐变背景 |
| `.text-yun-gradient` | 渐变文字（background-clip） |
| `.btn-primary` | 主按钮（全直接 CSS，无 @apply） |
| `.btn-secondary` | 次级按钮 |
| `.card` | 白色卡片 + 阴影 |
| `.card-soft` | 淡紫软卡片 |
| `.animate-pop` | 弹窗弹出动画 |

---

## 4. 样式架构注意事项 ⚠️

### 按钮样式全部用直接 CSS
Tailwind v4 的 `@apply` 引用 `@utility` 自定义类存在兼容问题，且 `transform` 工具类在 v4 会设 `translateZ(0)` 与 `scale-*` 冲突。因此 `.btn-primary` 和 `.btn-secondary` 全部改为原生 CSS 属性。

### 固定装饰条必须 `pointer-events: none`
iOS Safari 的 `position: fixed` + `z-index` 会创建 stacking context 并拦截全屏触摸事件。layout.tsx 的顶部/底部装饰条已加 `pointer-events: none`。

### 无 `<style jsx>`
Turbopack 与 styled-jsx 的 className 拼接存在解析冲突（`Expected ',', got 'ident'`），弹窗动画已移至 globals.css。

---

## 5. 核心类型 (`lib/types.ts`)

```typescript
Character        { id, name, images: string[] }
Question         { targetName, targetId, options: string[3], correctImage }
GameState        { nickname, questions, currentIndex, answers, score, startTime, endTime?, isFinished }
LeaderboardEntry { id?, nickname, score, time_seconds, date, rank? }
```

---

## 6. 游戏逻辑 (`lib/game-engine.ts`)

### 流程
1. `createGame(nickname)` → `generateQuestions(5)` 生成 5 题
2. 每题：目标角色随机 1 正确图 + 其他 2 角色各随机 1 干扰图 → Fisher-Yates 打乱
3. 点击 → `submitAnswer()` → 判对错 + 更新分数 + 推索引
4. 答完 5 题 → 跳转 `/result`

### 规则
- 每题 3 选项（1 正确 + 2 错误）
- 答对 +20 分（首页规则写 +10 ⚠️ 不一致）
- 答错不扣分，不限时
- 排名：得分降序 → 用时升序

---

## 7. 数据流

- 昵称：`sessionStorage['quiz-nickname']`
- 结果：`sessionStorage['quiz-result']`
- 排行榜：Supabase → localStorage 降级（key: `cloud-quiz-leaderboard`，保留前 50）

### Supabase 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int8 (PK) | 自增 |
| nickname | text | 昵称 |
| score | int4 | 得分 |
| time_seconds | int4 | 用时（秒） |
| date | date | 日期 |

查询：`score DESC, time_seconds ASC`

---

## 8. 分享功能 (`components/ShareButton.tsx`)

1. 动态 `import('html2canvas')` 按需加载
2. 截图 DOM（scale: 2x, bg: #F7F2FF）
3. 优先 `navigator.share()` 原生分享
4. 降级：自动下载 PNG

---

## 9. 角色管理

### 添加/删除角色
```bash
# 1. 放图片到 public/images/characters/{角色名}/
# 2. 运行脚本
npx tsx scripts/generate-manifest.ts
# 3. 自动更新 lib/characters.ts
```

### 当前角色 (8/9)

| # | ID | 名称 | 图片数 |
|---|-----|------|--------|
| 1 | yundao | 云导 | 9 |
| 2 | yunmi | 云米 | 6 |
| 3 | yunzi | 云子 | 5 |
| 4 | yunxi | 云汐 | 5 |
| 5 | yunlan | 云岚 | 5 |
| 6 | yunbao | 云宝 | 10 |
| 7 | yunduo | 云朵 | 5 |
| 8 | yunrou | 云柔 | 5 |
| 9 | — | 咪咪 | ❌ |

---

## 10. 部署

### Vercel
- 框架：Next.js，构建：`next build`
- 环境变量：`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase SQL
```sql
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON leaderboard FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read" ON leaderboard FOR SELECT TO anon USING (true);
```

---

## 11. 已知问题

| # | 问题 | 严重度 | 状态 |
|---|------|--------|------|
| 1 | 首页规则「+10 分」引擎实际 +20 | 🟡 中 | 待修 |
| 2 | 咪咪角色未添加 | 🟡 中 | 待加图 |
| 3 | API route 占位 | 🟢 低 | 待实现 |
| 4 | 图片 `unoptimized`，不走 CDN | 🟢 低 | 暂不影响 |
| 5 | **iOS Safari 按钮无响应** | 🔴 高 | 排查中（pointer-events:none 无效） |
| 6 | **Safari html2canvas oklab 报错** | 🔴 高 | 需 onclone 遍历替换颜色 |

---

## 12. 开发命令

```bash
cd /Users/chubby_ducky/Desktop/cloud-quiz

npm run dev          # → http://localhost:3000
npm run build        # 构建
npx tsx scripts/generate-manifest.ts  # 更新角色清单
```
