# SEO Dashboard — MarketerHire

Operational dashboard for managing the SEO article pipeline. View article inventory, register published URLs, manage keywords, run audits, and monitor performance.

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (data layer)
- Chart.js (visualizations)

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Overview | `/` | Summary cards, article table, quick wins, batch controls |
| Articles | `/articles` | Article lifecycle manager — register URLs, update status, add articles |
| Keywords | `/keywords` | Keyword universe — scores, selection, batch planning |
| Audit | `/audit` | Audit history, health trends, quick win opportunities |

## API Routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/articles` | GET, POST, PUT | Article CRUD |
| `/api/keywords` | GET, POST, PUT | Keyword CRUD |
| `/api/audit` | GET, POST | Audit snapshot history |
| `/api/stats` | GET | Computed summary statistics |

## Local Development

```bash
cd seo/dashboard
npm install
npm run dev
# Open http://localhost:3000
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://cizvquoqzrlrpgrxpjbm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
SUPABASE_SERVICE_KEY=<supabase service key>
```

## Deploy to Vercel

```bash
# First time: link project
npx vercel link

# Deploy
npx vercel --yes --prod

# Set env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
```

## Supabase Tables

Three tables in the `public` schema:
- `seo_articles` — Article registry with lifecycle status and performance metrics
- `seo_keywords` — Keyword universe with composite scoring
- `seo_audit_snapshots` — Weekly audit history with full data snapshots

## Data Flow

```
Article Machine (local VM)
  → /seo-machine command produces articles
  → Writes to Supabase seo_articles + seo_keywords
  → Dashboard reads from Supabase

GA4 + GSC (via /seo-audit command)
  → Pulls organic traffic + ranking data
  → Writes to Supabase seo_articles (metrics) + seo_audit_snapshots
  → Dashboard displays health status + trends
```
