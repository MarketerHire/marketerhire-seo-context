---
name: seo-audit
description: Weekly SEO health audit — pull GA4/GSC data, compute health, update Supabase, write signal
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch
---

# SEO Audit — Weekly Health Check

Pulls GA4 organic traffic and GSC ranking data for all published articles. Computes health status, identifies quick wins, writes results to Supabase, and produces a signal for the intelligence layer.

## Step 1 — Load Published Articles

1. Read `seo/registry/article-registry.json`
2. Filter to articles with status "published" or "monitored" (must have `published_url`)
3. If no published articles: "No published articles to audit. Publish articles first, then register URLs via the dashboard or by updating the registry."

## Step 2 — Pull GA4 Organic Traffic

Use the **analytics-mcp** MCP tool to query GA4 (property 324078883):

For each published article URL, pull:
- **30-day window**: organic sessions
- **7-day window**: organic sessions (current week)
- **7-day window offset by 7 days**: organic sessions (previous week, for trend)

Use `runReport` with:
- Dimensions: `pagePath`, `sessionDefaultChannelGroup`
- Filter: `sessionDefaultChannelGroup` = "Organic Search"
- Metrics: `sessions`, `engagedSessions`
- Date ranges: last 30 days, last 7 days, 7-14 days ago

Batch all URLs into a single request where possible.

## Step 3 — Pull GSC Data

Use the **gsc** MCP tool:

**For each published article URL:**
- Query: search performance by page, last 28 days
- Get: impressions, clicks, CTR, average position

**For quick wins (site-wide):**
- Query: all search queries for the site where position is between 5 and 20 and impressions > 10
- Get: query, page URL, impressions, clicks, CTR, position
- Sort by impressions descending

## Step 4 — Compute Health Status

For each article, compute:

**Sessions trend:**
- Compare 7d sessions vs previous 7d sessions
- `up` if current > previous * 1.1 (10% growth)
- `down` if current < previous * 0.85 (15% decline)
- `flat` otherwise

**Position trend:**
- Compare current avg position vs previous audit's position (from registry `avg_position_30d`)
- `up` if position improved (lower number) by 3+ spots
- `down` if position dropped by 3+ spots
- `flat` otherwise

**Health status:**
- **green**: sessions_trend is "up" or "flat" AND position_trend is "up" or "flat"
- **yellow**: sessions_trend is "down" OR position dropped 3-9 spots
- **red**: position dropped 10+ spots OR sessions declined 40%+ OR zero impressions for 14+ days

**Health reason:** Human-readable explanation (e.g., "Traffic down 23% WoW", "Position dropped from 8 to 19")

## Step 5 — Re-enrich Keyword Universe

Pull fresh GSC data for all tracked keywords and update their metrics.

### 5a. Load existing keywords from Supabase

```bash
export $(grep -E '^SUPABASE_SERVICE_KEY=' /home/exedev/mh-os/.env | xargs)
curl -s "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?select=keyword,status,search_volume,keyword_difficulty,composite_score&limit=500" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
```

### 5b. Match keywords against GSC query data

From the GSC data already pulled in Step 3 (site-wide queries), match each tracked keyword:
- If the keyword appears in GSC results → update with current position, impressions, clicks
- If a keyword was at position 5-15 and moved to 1-5 → flag as "ranking win"
- If a keyword was at position 5-15 and dropped to 20+ → flag as "ranking loss"

### 5c. Discover new keyword opportunities

From the GSC site-wide query data, find queries that:
- Have impressions > 50 but are NOT in the keyword universe yet
- These are keywords Google is already showing the site for but we're not tracking
- Add them to Supabase as status "universe" with their GSC metrics

```bash
curl -X POST "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=minimal" \
  -d '[{
    "keyword": "{query}",
    "search_volume": null,
    "keyword_difficulty": null,
    "cpc": null,
    "status": "universe",
    "composite_score": null
  }]'
```

### 5d. Update existing keyword metrics in Supabase

For each tracked keyword that appeared in GSC data, update its record:

```bash
curl -X PATCH "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?keyword=eq.{keyword}" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"search_volume": {impressions_as_proxy_if_no_volume}}'
```

### 5e. Report keyword changes

Summarize:
- Keywords with ranking improvements
- Keywords with ranking losses
- New keyword opportunities discovered from GSC
- Total keywords tracked vs total in GSC

## Step 6 — Identify Quick Wins

From the GSC site-wide query data:
- Filter queries at positions 5-20 with impressions > 10
- Calculate opportunity score: `impressions * (1 - position/20)`
- Cross-reference with the keyword universe (if exists) to flag overlap
- Rank by opportunity score, take top 20

## Step 7 — Update Local Registry

For each audited article, update `seo/registry/article-registry.json`:
- `organic_sessions_30d`, `organic_sessions_7d`
- `sessions_trend`
- `impressions_30d`, `clicks_30d`, `ctr_30d`, `avg_position_30d`
- `position_trend`
- `health_status`, `health_reason`
- `last_audit_date`: today
- Update `status` to "monitored" if it was "published"
- Update `status` to "refresh_needed" if health is red for 3+ consecutive audits

## Step 8 — Write to Supabase

### Update articles
For each audited article, upsert into `seo_articles`:

```bash
curl -X PATCH "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_articles?slug=eq.{slug}" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "organic_sessions_30d": {n},
    "organic_sessions_7d": {n},
    "sessions_trend": "{trend}",
    "impressions_30d": {n},
    "clicks_30d": {n},
    "ctr_30d": {n},
    "avg_position_30d": {n},
    "position_trend": "{trend}",
    "health_status": "{status}",
    "health_reason": "{reason}",
    "last_audit_date": "{today}",
    "status": "{updated_status}",
    "updated_at": "now()"
  }'
```

### Insert audit snapshot
```bash
curl -X POST "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_audit_snapshots" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audit_date": "{today}",
    "total_articles": {n},
    "articles_healthy": {green_count},
    "articles_warning": {yellow_count},
    "articles_critical": {red_count},
    "total_organic_sessions_30d": {sum},
    "avg_position": {avg},
    "quick_wins_count": {n},
    "keyword_coverage_pct": {pct},
    "articles_data": {articles_json},
    "quick_wins_data": {quick_wins_json},
    "report_markdown": "{report_text}"
  }'
```

Load `SUPABASE_SERVICE_KEY` from `/home/exedev/mh-os/.env`.

## Step 9 — Write Signal (Intelligence Layer)

Write a signal file to `20_intelligence/signals/weekly/{YYYY-MM-DD}-seo-audit.md`:

```yaml
---
date: {today}
source: seo-audit
cadence: weekly
lever: Lead Volume
summary: "SEO audit: {total_articles} articles, {organic_sessions} organic sessions (30d), {healthy}/{warning}/{critical} health, {quick_wins} quick wins"
metrics:
  organic_sessions_30d: {n}
  articles_published: {n}
  articles_healthy: {n}
  articles_declining: {n}
  avg_position: {n}
  quick_wins_count: {n}
  keyword_coverage_pct: {n}
---

# Weekly SEO Health Report — {date}

## Summary
- Total organic sessions (30d): {n}
- Published articles: {n}
- Health breakdown: {green} healthy / {yellow} warning / {red} critical
- Average position: {n}
- Quick wins identified: {n}

## Top Performing Articles
{top 5 by organic sessions}

## Declining Articles
{articles with yellow/red health}

## Quick Wins (positions 5-20)
| Query | Position | Impressions | Page | Opportunity Score |
|-------|----------|-------------|------|-------------------|
{top 10 quick wins}

## Recommendations
{actionable items based on findings}
```

Also append a line to `20_intelligence/signals/signal-log.jsonl`.

## Step 10 — Report

Present the audit summary to the user:
- Total articles audited
- Health breakdown (green/yellow/red)
- Total organic sessions (30d)
- Top 3 quick wins
- **Keyword changes**: ranking wins, ranking losses, new opportunities discovered
- Any articles flagged for refresh
- "Dashboard will reflect these updates on next load — check /keywords for new opportunities"
