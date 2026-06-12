# Cloud Quiz — Technical Documentation

> cloud-quiz.chubbyducky.com  
> Last updated: 2026-06-12

---

## 1. Tech Stack

| Layer | Choice | Version |
|---|------|------|
| Framework | Next.js (App Router) | 16.2.9 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Database | Supabase | @supabase/supabase-js |
| Screenshot | Canvas API + qrcode | canvas + qrcode |
| DNS/CDN | Cloudflare | — |
| Deploy | Vercel | Free tier |

## 2. URLs

| Env | URL |
|-----|-----|
| Production | https://cloud-quiz.chubbyducky.com |
| Vercel (latest) | cloud-quiz-*.vercel.app |
| GitHub | https://github.com/Erza-Shucarlet/cloud-quiz |
| Supabase | https://supabase.com/dashboard/project/ut0daeippd7lw03-dzc74w |

## 3. Directory Structure

```
cloud-quiz/
├── app/
│   ├── layout.tsx              # Root layout (fixed bars + pointer-events:none)
│   ├── globals.css             # @theme colors + .btn-primary/.card/animation
│   ├── page.tsx                # Home: nickname form → /game
│   ├── game/page.tsx           # Quiz: 3-phase (loading→ready→playing), preload
│   ├── result/page.tsx         # Result card + ShareButton
│   ├── leaderboard/page.tsx    # Rankings (Supabase → localStorage)
│   └── api/leaderboard/route.ts # Placeholder
├── components/
│   ├── ImageCard.tsx            # Image option (4 states)
│   ├── ProgressBar.tsx          # Progress bar
│   └── ShareButton.tsx          # Canvas screenshot + share + save
├── lib/
│   ├── types.ts                 # Character, Question, GameState, LeaderboardEntry
│   ├── characters.ts            # Character data (auto-generated)
│   ├── game-engine.ts           # Game logic + image dedup
│   ├── preload.ts               # Batched image preloading
│   ├── screenshot-canvas.ts     # Canvas share image + QR code
│   ├── supabase.ts              # Supabase client + fetch/submit (today only)
│   ├── storage.ts               # localStorage fallback (today only)
│   └── session.ts               # sessionStorage helpers
├── scripts/
│   └── generate-manifest.ts     # Scan images → update characters.ts
├── public/
│   └── images/characters/       # WebP images (384px, ~20KB each)
│       ├── 云导/ (9) 云米/ (6) 云子/ (5) 云汐/ (5)
│       ├── 云岚/ (5) 云宝/ (10) 云朵/ (5) 云柔/ (5)
│       └── 咪咪/ (❌)
└── TECHNICAL.md
```

## 4. Color System

| Variable | Hex | Usage |
|----------|-----|-------|
| --yun-primary | #7C3AED | Buttons, titles |
| --yun-primary-light | #A78BFA | Gradient mid |
| --yun-primary-pink | #F472B6 | Gradient end |
| --yun-accent | #38D5E8 | Sky accent |
| --yun-score | #FBBF24 | Score display |
| --yun-bg | #F7F2FF | Page bg start |
| --yun-bg-sky | #E9FBFF | Page bg end |
| --yun-border | #E9D5FF | Borders |
| --yun-correct | #34D399 | Correct answer |
| --yun-wrong | #FF5C8A | Wrong answer |
| --yun-text | #2B2140 | Primary text |
| --yun-text-muted | #7B6A99 | Secondary text |

## 5. Game Flow

```
Home → /game (loading: preload 15 imgs) → ready ("开始答题") → playing (5 Qs)
  → /result (score card + share/save buttons) → /leaderboard (today only)
```

## 6. Screenshot System

- Pure Canvas API drawing (no html2canvas)
- QR code (qrcode library) at bottom center
- Share: navigator.share() → download fallback
- Save: window.open() → long-press to save

## 7. Leaderboard

- Supabase table: `leaderboard` (id, nickname, score, time_seconds, date)
- Query: `.eq('date', today)` — daily reset
- localStorage fallback with same filter
- RLS: anon can insert + read

## 8. Performance

- Images: PNG→WebP, 384px wide, 65MB→1.1MB (59x smaller)
- Preload: only 15 images for current round, batched (8 concurrent)
- CDN: Cloudflare proxied (orange cloud)
- Game reuse: preloaded game stored in ref, not regenerated

## 9. Known Issues

| # | Issue | Status |
|---|-------|--------|
| 1 | Home says +10 but engine gives +20 | 🟡 todo |
| 2 | 咪咪 character missing | 🟡 todo |
| 3 | iOS Safari needs `npm run start` (not dev) | ✅ documented |
| 4 | Vercel free tier DNS blocked in China | ✅ solved via Cloudflare |

## 10. Development

```bash
cd ~/Desktop/cloud-quiz
npm run dev          # → localhost:3000
npm run build        # production build
npm run start        # iOS Safari testing (must use this)
npx tsx scripts/generate-manifest.ts  # update character list
```

## 11. Deploy

Push to `main` → Vercel auto-deploys. Env vars in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
