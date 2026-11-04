# MH-1 SEO Engine — Product Spec

A standalone, client-agnostic SEO engine that anyone on the team can deploy for any client. Not a migration — a product.

## What It Is

A self-contained GitHub repo that takes a client from zero to full SEO operation:
1. **Onboard** — answer 8 questions, system generates brand kit
2. **Research** — 100-200 keywords scored, clustered, cannibalization-checked
3. **Produce** — 10-15 articles/day, 23+/25 quality, CMS-ready HTML + schema + images
4. **Monitor** — live dashboard, weekly automated audits, health scores, quick wins
5. **Scale** — pSEO service+city pages, refresh pipeline for existing content

No local machine dependency. No "ask Rafid." Clone the repo, set env vars, onboard the client.

## Target User

An MH-1 operator (internal or contracted) who runs the engine for a client. They need:
- A Claude Code environment (exe.dev VM, or local install, or Anthropic Agents API)
- Client's domain, service list, and target cities
- Client's GA4/GSC access (for audits — optional for content production)

They do NOT need to understand the pipeline internals, write prompts, or touch code.

## Product Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repo                           │
│              MarketerHire/seo-engine                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Article      │  │  Dashboard   │  │  CLI Commands  │ │
│  │ Machine      │  │  (Next.js)   │  │  (Claude Code) │ │
│  │              │  │              │  │                │ │
│  │ 4 phases     │  │ Overview     │  │ /seo-machine   │ │
│  │ 5-stage pipe │  │ Keywords     │  │ /seo-keywords  │ │
│  │ Subagent     │  │ Articles     │  │ /seo-audit     │ │
│  │ isolation    │  │ Audit        │  │ /seo-status    │ │
│  │              │  │ Activity     │  │ /seo-hub       │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│         │                 │                   │         │
│         └────────┬────────┘                   │         │
│                  │                            │         │
│         ┌────────▼────────┐          ┌────────▼───────┐ │
│         │    Supabase     │          │  MCP Servers   │ │
│         │  (per client)   │          │  (bundled)     │ │
│         │                 │          │                │ │
│         │ seo_articles    │          │ DataForSEO     │ │
│         │ seo_keywords    │          │ GSC            │ │
│         │ seo_audit_snaps │          │ GA4            │ │
│         └────────┬────────┘          │ Perplexity     │ │
│                  │                   └────────────────┘ │
│         ┌────────▼────────┐                             │
│         │    Vercel       │                             │
│         │  (per client)   │                             │
│         │  dashboard.app  │                             │
│         └─────────────────┘                             │
└─────────────────────────────────────────────────────────┘
```

## Repo Structure

```
seo-engine/
├── README.md                         # "Getting started" for operators
├── ONBOARDING.md                     # Step-by-step new client guide
├── .env.example                      # All env vars with placeholders
├── .gitignore                        # output/, clients/, .env*
│
├── engine/                           # The article machine (core)
│   ├── CLAUDE.md                     # System prompt for Claude Code
│   ├── SKILL.md                      # Full system overview
│   ├── commands/
│   │   ├── run-machine.md            # Top-level orchestrator
│   │   ├── setup-client.md           # Phase 1: brand onboarding wizard
│   │   ├── run-keyword-intel.md      # Phase 2: keyword research + scoring
│   │   ├── run-article-batch.md      # Phase 3: article production loop
│   │   └── generate-report.md        # Phase 4: batch reporting
│   ├── pipeline/
│   │   ├── 01-parse-context.md       # Stage 1
│   │   ├── 02-brief.md              # Stage 2 (+ refresh mode)
│   │   ├── 03-draft.md              # Stage 3 (+ refresh mode)
│   │   ├── 04-optimize.md           # Stage 4 (+ image gen + refresh mode)
│   │   └── 05-scorecard.md          # Stage 5 (+ refresh adjustments)
│   ├── agents/
│   │   ├── context-compiler.md
│   │   ├── keyword-scorer.md
│   │   ├── keyword-researcher.md
│   │   └── batch-reporter.md
│   ├── rules/
│   │   └── remove-ai-tells.md
│   ├── schemas/
│   │   └── keyword-scored.schema.json
│   ├── brand-setup-templates/        # Blank templates for new clients
│   │   ├── BRAND-SETUP-GUIDE.md
│   │   ├── client-config.template.json
│   │   ├── company-profile.template.md
│   │   ├── audience-personas.template.md
│   │   ├── writing-guidelines.template.md
│   │   ├── customer-voice.template.md
│   │   ├── questions.template.json
│   │   └── content-inventory.template.json
│   └── knowledge-base/
│       └── scoring-methodology.md
│
├── dashboard/                        # Next.js operational dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Overview
│   │   ├── articles/page.tsx
│   │   ├── keywords/page.tsx         # + cannibalization badges + action buttons
│   │   ├── audit/page.tsx
│   │   └── api/
│   │       ├── articles/route.ts
│   │       ├── keywords/route.ts
│   │       ├── audit/route.ts
│   │       ├── stats/route.ts
│   │       └── activity/route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── ArticleTable.tsx
│   │   ├── BatchControls.tsx
│   │   ├── QuickWinsPanel.tsx
│   │   ├── HealthBadge.tsx
│   │   └── ActivityTimeline.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── types.ts
│   ├── package.json
│   └── vercel.json
│
├── commands/                         # Claude Code slash commands
│   ├── seo-machine.md                # Wrapper: run engine + sync Supabase
│   ├── seo-keywords.md               # Keyword research + dashboard sync
│   ├── seo-audit.md                  # Weekly audit + signal generation
│   ├── seo-hub.md                    # Interactive status + routing
│   └── seo-status.md                 # Quick read-only status
│
├── mcp-servers/                      # Bundled data source connectors
│   ├── README.md                     # How to configure per client
│   ├── gsc/                          # Google Search Console
│   │   ├── gsc_server.py
│   │   ├── requirements.txt
│   │   └── README.md
│   └── analytics/                    # GA4 (rebuilt as lightweight wrapper)
│       ├── analytics_server.py
│       ├── requirements.txt
│       └── README.md
│   # DataForSEO + Perplexity are npm packages — no local code needed
│
├── supabase/                         # Database schema + setup
│   ├── migrations/
│   │   └── 001_seo_tables.sql        # Creates all 3 tables
│   └── seed.sql                      # Optional: seed with example data
│
├── scripts/                          # Utility scripts
│   ├── setup-client.sh               # Creates Supabase project + deploys dashboard
│   ├── deploy-dashboard.sh           # Vercel deploy with env vars
│   └── run-audit.sh                  # CLI wrapper for scheduled audits
│
├── output/                           # Runtime output (.gitignored)
│   └── {brand}/                      # Per-client output
│       ├── brand-setup/
│       ├── keyword-intel/
│       └── batches/
│
└── clients/                          # Per-client config (.gitignored)
    └── {brand}/
        └── .env                      # Client-specific secrets
```

## New Client Onboarding Flow

```
Operator clones repo
    ↓
Runs scripts/setup-client.sh "rocketservicepros"
    ↓
Script does:
  1. Creates Supabase project (or uses shared project with RLS)
  2. Runs migrations (3 tables)
  3. Deploys dashboard to Vercel with client env vars
  4. Creates clients/{brand}/.env with placeholders
  5. Prints: "Dashboard live at rsp-seo-dashboard.vercel.app"
    ↓
Operator runs: /seo-machine brand="rocketservicepros"
    ↓
Interactive wizard asks 8 questions:
  1. Company name
  2. Domain URL
  3. Industry
  4. Primary audience
  5. Services offered
  6. Target cities/regions
  7. Brand voice/tone
  8. Competitors
    ↓
System generates: client-config.json, company-profile.md, personas.md, etc.
    ↓
Phase 2: Keyword research (automatic)
  → 100-200 keywords scored, clustered, cannibalization-checked
  → Synced to Supabase → visible in dashboard
    ↓
Phase 3: Article production
  → 5 articles per batch, subagent per article
  → Outputs: HTML, schema, images, scorecard
  → Synced to Supabase → visible in dashboard
    ↓
Weekly: /seo-audit pulls GA4+GSC, computes health, updates dashboard
```

**Time from zero to first batch:** ~3 hours (1hr setup + 2hrs production)

## What the Operator Needs

### Per-Engine (One-Time Setup)

| Requirement | How to Get |
|---|---|
| Claude Code environment | exe.dev VM, local install, or Anthropic Agents API |
| GitHub repo access | Clone MarketerHire/seo-engine |
| Vercel account | Team or personal (free tier works) |
| DataForSEO account | Sign up at dataforseo.com (~$50/mo) |
| Perplexity API key | Sign up at perplexity.ai |
| Gemini API key | Google AI Studio (free tier, then $0.04/image) |

### Per-Client

| Requirement | How to Get | Blocking? |
|---|---|---|
| Client's domain + service list | Client provides | Yes — needed for brand setup |
| Client's target cities | Client provides | Yes — needed for pSEO |
| GA4 property ID + viewer access | Client grants to service account | No — only needed for audits |
| GSC domain + viewer access | Client grants to service account | No — only needed for audits + cannibalization |
| Client's WordPress/CMS credentials | Client provides | No — only needed for publishing |
| GBP manager access | Client grants | No — only needed for local SEO optimization |

**Content production has zero client blockers.** GA4/GSC/CMS access only needed for monitoring and publishing.

## Features Included

| Feature | Status | What It Does |
|---|---|---|
| Brand onboarding wizard | Built | 8-question intake → full brand kit |
| 6 Circles keyword research | Built | 100-200 keywords from seed expansion |
| DataForSEO enrichment | Built | Volume, KD, CPC, SERP features, PAA |
| GSC quick win discovery | Built | Finds keywords already ranking 5-20 |
| Composite keyword scoring | Built | 5-dimension formula, ranked list |
| Cannibalization detection | Built | Checks every keyword against existing site |
| Action buttons (Refresh/Replace/Proceed/Skip) | Built | Dashboard UI for cannibalization decisions |
| Refresh pipeline mode | Built | Adapts all 5 stages for content refresh |
| Article production (5-stage) | Built | Parse → Brief → Draft → Optimize → Scorecard |
| AI-tell removal | Built | Zero AI-ism words, enforced in pipeline |
| Schema markup | Built | Article + FAQ + Breadcrumb + HowTo per article |
| Feature image generation | Built | Gemini 3 Pro, client-branded, compressed JPEG |
| Internal linking | Built | 7-13 verified links per article |
| 25-point quality scorecard | Built | Auto-gates at 23+/25, specific fix lists |
| Operational dashboard | Built | Overview, Keywords, Articles, Audit, Activity Timeline |
| Activity timeline | Built | Date-grouped events across all SEO activity |
| Weekly audit system | Built | GA4 + GSC → health scores → quick wins |
| Supabase sync | Built | Articles + keywords + audits auto-sync |
| pSEO service+city pages | Needs pipeline tweak | Landing-page content type (~1 hour to add) |
| Publishing automation | In progress (Erveen) | Auto-publish to CMS + GSC indexing |
| Multi-tenant dashboard | Not built | Single dashboard for all clients (build at 5+ clients) |

## What Needs to Be Built

### P0 — Must have for repo launch

| Task | Effort | What |
|---|---|---|
| Create GitHub repo + push code | 1 hr | Extract SEO engine from mh-os, clean up, push |
| `.env.example` with all vars documented | 30 min | Template for operators |
| Supabase migration SQL | 1 hr | 001_seo_tables.sql for 3 tables |
| Update `.mcp.json` to use env vars | 1 hr | No more hardcoded credentials |
| Move GSC server into repo | 3 hrs | Copy from external dir, update paths |
| Rebuild GA4 analytics server | 4 hrs | Current binary is broken, rebuild as Python wrapper |
| Dashboard env var parameterization | 2 hrs | Brand name, Supabase URL, GA4 property as env vars |
| `setup-client.sh` script | 2 hrs | Automates Supabase + Vercel + env setup |
| README + ONBOARDING docs | 2 hrs | Getting started guide for operators |
| **Total P0** | **~16 hrs** | **~2 days** |

### P1 — Should have for first client

| Task | Effort | What |
|---|---|---|
| pSEO content type in pipeline | 1 hr | Landing-page format for service+city pages |
| `deploy-dashboard.sh` script | 1 hr | One-command dashboard deploy per client |
| GitHub Actions: dashboard auto-deploy | 1 hr | Deploy on push to dashboard/ |
| GitHub Actions: weekly audit cron | 2 hrs | Scheduled /seo-audit via Claude Code |
| Test with RSP as first non-MH client | 4 hrs | End-to-end validation |
| **Total P1** | **~9 hrs** | **~1 day** |

### P2 — Nice to have

| Task | Effort | What |
|---|---|---|
| GitHub Actions: on-demand article batch | 2 hrs | workflow_dispatch trigger |
| Multi-tenant dashboard (client switcher) | 1-2 days | Single dashboard, RLS, client table |
| Anthropic Agents API integration | 2-3 days | Replace Claude CLI with API calls |
| Publishing automation (CMS connector) | TBD | Depends on Erveen's work |

## Environment Variables (Complete List)

```bash
# === Per-Engine (same for all clients) ===
GEMINI_API_KEY=                     # Google AI Studio — image generation
DATAFORSEO_USERNAME=                # DataForSEO account
DATAFORSEO_PASSWORD=                # DataForSEO API password
PERPLEXITY_API_KEY=                 # Perplexity AI search
VERCEL_TOKEN=                       # Vercel deployment token
SUPABASE_ACCESS_TOKEN=              # Supabase Management API (for CLI)

# === Per-Client ===
NEXT_PUBLIC_SUPABASE_URL=           # Client's Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Client's Supabase anon key
SUPABASE_SERVICE_KEY=               # Client's Supabase service key
NEXT_PUBLIC_BRAND_NAME=             # "MarketerHire" or "Rocket Service Pros"
GA_PROPERTY_ID=                     # Client's GA4 property ID
GA_SERVICE_ACCOUNT_JSON=            # Base64-encoded GCP service account
GSC_SITE_URL=                       # Client's GSC verified domain
GSC_OAUTH_CLIENT_SECRETS=           # Base64-encoded OAuth secrets
```

## Pricing Model (Infrastructure Cost Per Client)

| Item | Monthly Cost |
|---|---|
| Supabase (free tier) | $0 |
| Vercel (free tier) | $0 |
| DataForSEO (shared account) | ~$10/client amortized |
| Gemini API (image generation) | ~$2-5/month per client |
| Claude Code compute | Included in MH-1 subscription |
| **Total per client** | **~$12-15/month** |

Compare: a single SEO article from a traditional agency costs $800-2,000.
