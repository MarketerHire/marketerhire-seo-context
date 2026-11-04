# SEO Hub — MarketerHire Organic Search Command Center

Two engines (Article Machine for batch production, InfraNodus pipeline for one-off articles), one operational dashboard, weekly audit cycle.

## Which Command Do I Run?

| I want to... | Command |
|---|---|
| See overall SEO status (articles, traffic, coverage) | `/seo-status` |
| Interactive tour / main entry point | `/seo-hub` |
| **Research keywords** (6 Circles + DataForSEO + GSC → dashboard) | `/seo-keywords brand="marketerhire"` |
| **Produce articles** (full 4-phase pipeline) | `/seo-machine brand="marketerhire" count=5` |
| Generate a single article (legacy InfraNodus pipeline) | `/generate-article keyword="..." type=pillar` |
| Run the weekly SEO audit | `/seo-audit` |

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Next.js Dashboard (Vercel)                  │
│  Overview  │  Articles  │  Keywords  │  Audit           │
│  ─────────────────────────────────────────────          │
│  API Routes: /api/articles, /api/keywords,              │
│              /api/audit, /api/triggers                   │
└──────────┬──────────┬──────────────┬────────────────────┘
           │          │              │
     ┌─────▼─────┐ ┌──▼────┐  ┌─────▼──────┐
     │ Supabase  │ │ GA4 / │  │ Claude.ai  │
     │ (data)    │ │ GSC   │  │ Remote     │
     │           │ │ APIs  │  │ Triggers   │
     └───────────┘ └───────┘  └──────┬─────┘
                                      │
                               ┌──────▼──────┐
                               │ Claude Code │
                               │ /seo-machine│
                               │ /seo-audit  │
                               └──────┬──────┘
                                      │
                               ┌──────▼──────────┐
                               │ article-machine/ │
                               │ (4-phase engine) │
                               └─────────────────┘
```

**Flow:** Dashboard buttons trigger Claude Code remote sessions → article machine runs with subagent-per-article isolation → results written to Supabase → dashboard auto-updates.

## MCP Servers

| Server | What it does | Priority | Used in |
|--------|-------------|----------|---------|
| **ahrefs** | Organic keywords, keyword explorer, volume, KD, CPC, competitor gaps, cannibalization | **PRIMARY for keyword research** | Keyword intelligence, cannibalization detection, competitor analysis |
| **dataforseo** | SERP features, PAA questions, AI Overview, keyword suggestions | Supplementary | Keyword intelligence (SERP data), article briefs (PAA) |
| **perplexity** | AI-powered search with citations | Supplementary | Content gap analysis, article research |
| **gsc** (Google Search Console) | Impression data, CTR, click data | Supplementary | Audit, impression/CTR data |
| **analytics-mcp** (GA4) | Organic traffic, top pages, user behavior | Supplementary | Audit, dashboard metrics |

GA4 Property: `324078883` (MarketerHire)

## Data Layer

| Store | What | Access |
|-------|------|--------|
| **Supabase** `seo_articles` | Article registry (slug, status, keywords, scores, performance metrics) | Dashboard + CLI |
| **Supabase** `seo_keywords` | Keyword universe with composite scores | Dashboard + CLI |
| **Supabase** `seo_audit_snapshots` | Weekly audit history (metrics, quick wins, health reports) | Dashboard + CLI |
| **Local** `registry/article-registry.json` | Local mirror of Supabase articles for CLI commands | CLI only |

## Output Locations

| What | Where |
|------|-------|
| Article machine output | `article-machine/output/{brand}/batches/` |
| Legacy pipeline output | `outputs/{slug}/` (12 artifacts) |
| Local article registry | `registry/article-registry.json` |
| Dashboard app | `dashboard/` (Next.js) |
| Audit signals | `../20_intelligence/signals/weekly/` |

## Article Lifecycle

```
Keyword Universe → Selected → In Production → Produced → Published → Monitored → Refresh Needed
```

| Status | Meaning |
|--------|---------|
| `produced` | Article machine completed, files generated, scorecard scored |
| `published` | Live on marketerhire.com (user registers URL in dashboard) |
| `monitored` | Audit has pulled GA4/GSC data for this article |
| `refresh_needed` | Red health for 3+ consecutive weeks |
| `retired` | Unpublished or redirected |

## Key Rules

1. **Do not modify article-machine internals** — invoke its commands, don't edit its files
2. **Every published article must be registered** — in Supabase `seo_articles` with `published_url`
3. **Audit signals dual-write** — to `20_intelligence/signals/weekly/` + Supabase
4. **Context window discipline** — article generation uses subagent isolation (orchestrator ~15K tokens, each article ~85K in own subagent, batch-state.json for resume)

## Remote Triggers

| Trigger | Purpose | Schedule |
|---------|---------|----------|
| `seo-article-batch` | Run article machine for N articles | On-demand (dashboard button) |
| `seo-weekly-audit` | Pull GA4/GSC, compute health, update dashboard | Weekly Mon 9 AM PT |
| `seo-dashboard-sync` | Sync local output to Supabase | On-demand |

## Adjacent Modules (don't duplicate)

| Need | Go to |
|------|-------|
| AI citation audits, AEO articles | `aeo/` |
| Landing pages | `creative/` → `/landing-page` |
| Brand voice, ICP, personas | `10_context/` |
| Revenue model, lever priorities | `20_intelligence/`, `30_strategy/` |

## Folder Structure

```
seo/
├── CLAUDE.md                    ← You are here
├── .mcp.json                    # GA4, GSC, DataForSEO, Perplexity
├── .claude/commands/            # Hub commands
│   ├── generate-article.md      # Legacy InfraNodus pipeline
│   ├── seo-hub.md               # Main entry point
│   ├── seo-machine.md           # Article machine wrapper
│   ├── seo-audit.md             # Weekly audit
│   └── seo-status.md            # Quick status view
├── article-machine/             # 4-phase production engine (DO NOT MODIFY)
├── dashboard/                   # Next.js operational dashboard
├── registry/                    # Local article registry mirror
├── agents/                      # Legacy InfraNodus agents
├── lib/                         # Legacy Python utilities
├── templates/                   # Legacy content templates
├── references/                  # Legacy reference materials
└── outputs/                     # Legacy pipeline outputs
```
