---
name: seo-keywords
description: Run keyword research via Article Machine Phase 2 and sync to Supabase dashboard
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch, WebFetch
---

# SEO Keywords — Research + Dashboard Sync

Runs keyword intelligence (Article Machine Phase 2) and syncs all keywords to Supabase so they appear on the dashboard at https://mh-seo-dashboard.vercel.app/keywords.

**Arguments:**
- `brand` — brand name (default: "marketerhire")
- `seeds` — optional comma-separated seed keywords to add to the research

## Step 1 — Pre-flight Check

1. Check if brand setup exists: `seo/article-machine/output/{brand}/brand-setup/client-config.json`
   - If missing → "Brand setup required first. Run `/seo-machine` to set up the brand."
   - If exists → Continue
2. Check if keyword research already exists: `seo/article-machine/output/{brand}/keyword-intel/keyword-scored.json`
   - If exists → Ask: "Keyword research already exists ({N} keywords). Re-run to refresh, or just sync existing to dashboard?"
   - If missing → Run Phase 2

## Step 2 — Run Keyword Intelligence (Article Machine Phase 2)

Read and follow `seo/article-machine/commands/run-keyword-intel.md`.

This will:
1. Load brand context (company-profile, personas, questions.json)
2. Seed keyword generation using 6 Circles Method
3. If user provided `seeds` argument, add those to the seed list
4. Expand via DataForSEO keyword suggestions + related keywords
5. Enrich with MCP servers:
   - **DataForSEO**: search volume, KD, CPC, SERP features, PAA questions
   - **GSC**: existing rankings (positions 5-20 = quick wins)
   - **GA4**: top landing pages by traffic, content gaps
   - **Perplexity**: AI citation intelligence, content gap analysis
6. Score with composite formula: `(BV × 0.30) + (Opp × 0.25) + (Diff × 0.20) + (Rel × 0.15) + (Gap × 0.10)`
7. Select top keywords
8. **HUMAN GATE**: Present ranked keywords for approval

Output files:
- `seo/article-machine/output/{brand}/keyword-intel/keyword-universe.json`
- `seo/article-machine/output/{brand}/keyword-intel/keyword-scored.json`
- `seo/article-machine/output/{brand}/keyword-intel/keyword-selected.json`
- `seo/article-machine/output/{brand}/keyword-intel/keyword-research-report.md`

## Step 3 — Sync to Supabase

Load `SUPABASE_SERVICE_KEY` from `/home/exedev/mh-os/.env`:
```bash
export $(grep -E '^SUPABASE_SERVICE_KEY=' /home/exedev/mh-os/.env | xargs)
```

### Sync full keyword universe (keyword-scored.json)

Read `seo/article-machine/output/{brand}/keyword-intel/keyword-scored.json`.

For each keyword, upsert into Supabase `seo_keywords`:

```bash
curl -X POST "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=minimal" \
  -d '{
    "keyword": "{keyword}",
    "composite_score": {composite_score},
    "business_value": {scores.business_value},
    "opportunity": {scores.opportunity},
    "difficulty_inv": {scores.difficulty_inv},
    "relevance": {scores.relevance},
    "content_gap": {scores.content_gap},
    "search_volume": {search_volume},
    "keyword_difficulty": {keyword_difficulty},
    "cpc": {cpc},
    "status": "universe"
  }'
```

**Batch upserts**: Send up to 50 keywords per request as a JSON array for efficiency.

### Mark selected keywords

Read `seo/article-machine/output/{brand}/keyword-intel/keyword-selected.json`.

For each selected keyword, update status:

```bash
curl -X PATCH "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?keyword=eq.{keyword}" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'
```

## Step 4 — Verify Sync

Query Supabase to confirm:

```bash
curl -s "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?select=keyword,composite_score,status&order=composite_score.desc&limit=10" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
```

## Step 5 — Summary

Report:
- Keywords in universe: {N}
- Keywords selected: {N}
- Top 5 keywords by score
- "View your keywords at https://mh-seo-dashboard.vercel.app/keywords"
- "Ready to produce articles? Run `/seo-machine` — it will skip keyword research and go straight to article generation."
