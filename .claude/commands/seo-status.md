---
name: seo-status
description: Quick read-only SEO status — articles, keywords, batches, last audit
allowed-tools: Read, Bash, Grep, Glob
---

# SEO Status — Quick View

Read-only status check. No data pulls, no writes — just reads local files and Supabase.

## Step 1 — Article Registry

Read `seo/registry/article-registry.json`. Report:
- Total articles by status: produced, published, monitored, refresh_needed, retired
- Most recent article produced (title, keyword, score, date)
- Articles with `health_status: "red"` or `"yellow"` (if any)

## Step 2 — Keyword Universe

Check if `seo/article-machine/output/marketerhire/keyword-intel/` exists:
- If yes, read `keyword-universe.json` (count total), `keyword-selected.json` (count selected), `keyword-scored.json` (count scored)
- Calculate coverage: articles produced / keywords in universe
- If no, report "Keyword intelligence not yet run"

## Step 3 — Batch Pipeline

Glob for `seo/article-machine/output/marketerhire/batches/*/batch-state.json`:
- For each batch, read and report: batch_id, total articles, completed, pending, in_progress
- Flag any batches with stuck articles (in_progress for >1 hour based on started_at)

## Step 4 — Last Audit

Check for most recent file matching `20_intelligence/signals/weekly/*seo-audit*`:
- If found, read and show: date, key metrics (organic sessions, avg position, healthy/warning/critical counts)
- If not found, report "No audit has been run yet — use `/seo-audit`"

## Step 5 — Unregistered Articles

Check if any articles in `seo/article-machine/output/marketerhire/batches/*/` are NOT in the registry:
- Compare batch folder slugs against registry slugs
- If unregistered articles found, prompt: "Found {N} articles not yet in the registry. Run `/seo-machine` to sync them."

## Step 6 — Published URL Check

For articles with status "produced" (not yet published), prompt:
- "{N} articles are ready to publish. Have any been published on marketerhire.com? Provide URLs to update their status."

## Output Format

```
## SEO Status — {date}

### Articles
| Status | Count |
|--------|-------|
| Produced | {n} |
| Published | {n} |
| Monitored | {n} |
| Refresh Needed | {n} |

### Keywords
Universe: {n} | Scored: {n} | Selected: {n} | Coverage: {pct}%

### Active Batches
{batch details or "No active batches"}

### Last Audit
{date} — {organic sessions} sessions, avg position {n}, {healthy}/{warning}/{critical}

### Action Items
- {any prompts about unregistered articles, published URLs, etc.}
```
