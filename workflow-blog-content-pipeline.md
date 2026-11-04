# Workflow: Blog Content Pipeline

**Service:** Automated SEO blog production — keyword research, brief generation, article drafting, optimization, quality scoring on a recurring cadence.

**Reuse level:** ~80% of existing infrastructure. The Article Machine (`seo/article-machine/`) is already multi-client.

---

## What This Deploys

- Brand setup (one-time) — company profile, personas, voice, content inventory
- Keyword intelligence — 6 Circles expansion, DataForSEO enrichment, composite scoring
- Batch article production — subagent-per-article isolation, 5-stage pipeline, 25-point scorecard
- Recurring cron — configurable cadence (weekly, bi-weekly, monthly)
- Supabase sync — articles + keywords tracked in dashboard
- Local registry — `seo/registry/article-registry.json` mirror

## Infrastructure Used

| Component | Location | Multi-Client? |
|---|---|---|
| Article Machine (4-phase) | `seo/article-machine/` | Yes — `brand` parameter |
| SEO Dashboard (Next.js) | `seo/dashboard/` | Needs `client_id` filter |
| Weekly Audit Cron (template) | `seo/bin/weekly-audit.sh` | Clone per client |
| MCP: DataForSEO | `seo/.mcp.json` | Shared credentials, works for any brand |
| MCP: Perplexity | `seo/.mcp.json` | Shared credentials |
| MCP: GA4 | `seo/.mcp.json` | **Per-client** — needs client's GA4 property ID |
| MCP: GSC | `seo/.mcp.json` | **Per-client** — needs client's GSC access |
| Supabase tables | `seo_articles`, `seo_keywords`, `seo_audit_snapshots` | Needs `client_id` column |
| Local article registry | `seo/registry/article-registry.json` | Single file — consider per-client registries |

## Builder Steps

### Step 1: Create Client Entry (5 min)

```bash
bin/clients-create "{Client Name}" --website https://{domain}
```

Creates `clients/{client_slug}/` with Firestore sync.

### Step 2: Run Article Machine Phase 1 — Brand Setup (30 min)

```
/seo-machine brand="{client_slug}"
```

The wizard will prompt for:
- Website URL
- Industry / vertical
- Target audience (1-2 lines)
- Competitors (3-5 names)
- Content goals

**Output:** `seo/article-machine/output/{client_slug}/brand-setup/`
- `client-config.json` — domain, audience, authors, pillar pages, schema
- `company-profile.md` — researched company overview
- `personas.md` — target reader personas
- `questions.json` — 50-100 questions the audience asks
- `voice-and-tone.md` — brand writing voice
- `content-inventory.md` — existing content mapped

### Step 3: Configure Machine Config (5 min)

Create `seo/article-machine/output/{client_slug}/machine-config.json`:

```json
{
  "article_count": 5,
  "pipeline": "seo",
  "parallel_articles": 2,
  "approval_gates": {
    "keyword_selection": true,
    "article_review": true
  },
  "auto_approve_threshold": null,
  "keyword_sources": ["websearch", "dataforseo"],
  "content_types": ["pillar-guide", "how-to", "comparison", "listicle"]
}
```

**Adjust per client:**
- `article_count`: articles per batch (3-10)
- `keyword_sources`: add `"gsc"` and `"ga4"` if client has shared analytics access
- `content_types`: remove types that don't fit the client's content strategy
- `approval_gates`: set to `false` for fully autonomous runs

### Step 4: Run Keyword Research — Phase 2 (20 min)

```
/seo-keywords brand="{client_slug}"
```

Uses 6 Circles Method:
1. Seed keywords (from brand setup)
2. WebSearch expansion
3. DataForSEO volume + difficulty
4. GSC quick wins (if access granted)
5. Perplexity content gaps
6. Composite scoring (BV 30% + Opp 25% + Diff 20% + Rel 15% + Gap 10%)

**Output:** `output/{client_slug}/keyword-intel/keyword-selected.json`

**Gate:** Review selected keywords before proceeding to article generation.

### Step 5: Run Article Batch — Phase 3 (45-90 min per 5 articles)

```
/seo-machine brand="{client_slug}" count=5
```

Each article runs in isolated subagent (~85K token context):
1. Parse context — extract keyword research into 4-section format
2. Generate brief — SERP analysis, internal linking, E-E-A-T, schema plan
3. Draft article — first draft following SEO + AEO + GEO rules
4. Optimize — 4 passes (on-page SEO, AEO formatting, GEO readiness, schema)
5. Scorecard — 25-point quality gate (content, SEO, AEO, GEO, schema)

**Output per article:**
- `parsed-context.md`, `brief.md`, `draft-v1.md`, `draft-optimized.md`
- `schema.json` (JSON-LD), `article-publish.html` (CMS-ready), `article-preview.html`
- `scorecard.md` (target: score > 20/25)

**Gate:** Review scorecards. Articles scoring < 18 should be revised.

### Step 6: Set Up Recurring Schedule (15 min)

Create `seo/bin/{client_slug}-blog.sh`:

```bash
#!/bin/bash
# {Client Name} bi-weekly blog production
# Adjust cron pattern for desired cadence
LOG_FILE="/tmp/{client_slug}-blog-$(date +%Y%m%d-%H%M%S).log"

cd /home/exedev/mh-os
claude -p \
  --dangerously-skip-permissions \
  --allowedTools "Read,Write,Edit,Bash,Grep,Glob" \
  --max-budget-usd 10 \
  "Run /seo-machine brand=\"{client_slug}\" count=3. Follow every step in seo/.claude/commands/seo-machine.md. Write all outputs to Supabase and the local registry. Do not ask for confirmation — execute fully." \
  >> "$LOG_FILE" 2>&1
```

**Cron examples:**
```bash
# Bi-weekly (every other Monday 9 AM PT)
0 16 * * 1 test $(( $(date +\%V) \% 2 )) -eq 0 && /home/exedev/mh-os/seo/bin/{client_slug}-blog.sh

# Weekly (every Monday 9 AM PT)
0 16 * * 1 /home/exedev/mh-os/seo/bin/{client_slug}-blog.sh

# Monthly (1st of month 9 AM PT)
0 16 1 * * /home/exedev/mh-os/seo/bin/{client_slug}-blog.sh
```

**Alternative:** Use `/schedule` skill to create a remote agent trigger instead of local cron.

### Step 7: Supabase Sync (10 min)

After Phase 3, the article machine syncs to Supabase automatically. Verify:

```bash
# Check articles were written with correct client_id
curl "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_articles?client_id=eq.{client_slug}" \
  -H "apikey: $SUPABASE_SERVICE_KEY"
```

## Config Files Created

| File | Purpose |
|---|---|
| `seo/article-machine/output/{client_slug}/brand-setup/client-config.json` | Brand config (domain, audience, authors, pillars) |
| `seo/article-machine/output/{client_slug}/machine-config.json` | Pipeline settings (count, sources, types, gates) |
| `seo/article-machine/output/{client_slug}/keyword-intel/keyword-selected.json` | Selected keywords with scores |
| `seo/bin/{client_slug}-blog.sh` | Recurring cron script |

## Verification

1. `output/{client_slug}/brand-setup/client-config.json` exists and has correct domain/audience
2. `output/{client_slug}/keyword-intel/keyword-selected.json` has 10+ keywords with composite scores
3. `output/{client_slug}/batches/batch-001-*/` contains article folders with all 8 output files each
4. Scorecard scores are > 20/25 for all articles
5. Supabase `seo_articles` has rows with `client_id = '{client_slug}'`
6. Cron script runs successfully when triggered manually

## Conditional: GA4/GSC Access

If the client provides GA4 + GSC access:

1. Get their GA4 Property ID (numeric, e.g., `123456789`)
2. Add service account as Viewer: `amiable-dragon-488500-d3@amiable-dragon-488500-d3.iam.gserviceaccount.com`
3. Add service account as Restricted User in GSC for their domain
4. Create per-client MCP config or update `seo/.mcp.json` with their property ID
5. Update `machine-config.json`: add `"gsc"` and `"ga4"` to `keyword_sources`
6. Re-run Phase 2 keyword research to pick up quick wins and existing ranking data

Without GA4/GSC, the pipeline still works — keyword research uses DataForSEO + WebSearch, which produces strong keyword sets. The main loss is "quick win" discovery (existing positions 5-20 that can be improved with targeted content).
