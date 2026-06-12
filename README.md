# ☁️ Cloud Universe · Guess the Character

> An image-based character guessing quiz — see the picture, guess the name

---

## How to Play

5 questions per round. A character name is shown → pick the matching image from 3 options. Correct answer = +20 points. Ties broken by time (faster = higher rank).

## Tech Stack

| Layer | Choice |
|---|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase |
| Sharing | Canvas API (no html2canvas) |
| Deploy | Vercel |

## Development

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
npm run start      # production mode (use this for iOS Safari)
```

> ⚠️ `npm run dev` has Turbopack compatibility issues on iOS Safari. Use `npm run build && npm run start` for mobile testing.

## Adding Characters

1. Place images in `public/images/characters/{name}/`
2. Run `npx tsx scripts/generate-manifest.ts`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Deployment

Push to GitHub → Vercel auto-deploy. Configure the environment variables above in Vercel project settings.

## License

MIT
