---
name: seo-machine
description: Run the Article Machine — batch article production with automatic registry sync
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch, WebFetch
---

# SEO Machine — Article Production

Wrapper around the Article Machine. Runs the 4-phase production pipeline and syncs results to the article registry + Supabase.

**Arguments:**
- `brand` — brand name (default: "marketerhire")
- `count` — number of articles to produce (default: 5)

## Step 1 — Pre-flight Check

1. Read `seo/article-machine/CLAUDE.md` to load the machine's instructions
2. Check if brand setup exists: `seo/article-machine/output/{brand}/brand-setup/client-config.json`
   - If missing → Phase 1 (Setup) will run
   - If exists → Skip to keyword check
3. Check if keywords are selected: `seo/article-machine/output/{brand}/keyword-intel/keyword-selected.json`
   - If missing → Phase 2 (Keywords) will run
   - If exists → Skip to article batch
4. Check for in-progress batches: `seo/article-machine/output/{brand}/batches/*/batch-state.json`
   - If found with pending articles → Resume that batch

Report what will happen and confirm with user before proceeding.

## Step 2 — Run Article Machine

Execute the article machine by reading and following `seo/article-machine/commands/run-machine.md`.

The machine will:
- Phase 1: Setup (if needed) — guided wizard → brand files + client-config.json
- Phase 2: Keywords (if needed) — 6 Circles expansion → MCP enrichment → scoring → selection (HUMAN GATE)
- Phase 3: Articles — for each keyword, spawn subagent → 5-stage pipeline → 8 files → scorecard (HUMAN GATE per article)
- Phase 4: Report — aggregate scorecards, coverage analysis

**Context window discipline:**
- YOU (the orchestrator) stay lean — read only scorecards and batch-state.json
- Each article runs in its own subagent (~85K tokens)
- Never read full article drafts in this orchestrator context

## Step 3 — Sync Keywords to Supabase

After Phase 2 completes (keyword selection approved), sync the full keyword universe to Supabase:

1. Read `seo/article-machine/output/{brand}/keyword-intel/keyword-scored.json`
2. For each keyword, upsert into Supabase `seo_keywords` table:

```bash
curl -X POST "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=minimal" \
  -d '[{
    "keyword": "{keyword}",
    "composite_score": {composite_score},
    "business_value": {scores.business_value},
    "opportunity": {scores.opportunity},
    "difficulty_inv": {scores.difficulty_inv},
    "relevance": {scores.relevance},
    "content_gap": {scores.content_gap},
    "search_volume": {search_volume or null},
    "keyword_difficulty": {keyword_difficulty or null},
    "cpc": {cpc or null},
    "cannibalization_risk": "{cannibalization_risk or null}",
    "cannibalization_url": "{cannibalization_url or null}",
    "cannibalization_note": "{cannibalization_note or null}",
    "status": "universe"
  }]'
```

3. Read `seo/article-machine/output/{brand}/keyword-intel/keyword-selected.json`
4. For each selected keyword, update status to "selected":

```bash
curl -X PATCH "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?keyword=eq.{keyword}" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "selected"}'
```

Load `SUPABASE_SERVICE_KEY` from `/home/exedev/mh-os/.env`.

## Step 3.5 — Sync Pipeline Mode from Supabase to keyword-selected.json

Before Phase 3 starts, read pipeline decisions from the dashboard (Supabase) and merge into keyword-selected.json. This allows users to set refresh/proceed/skip via the dashboard after initial keyword selection.

For each keyword in `seo/article-machine/output/{brand}/keyword-intel/keyword-selected.json`:

1. Query Supabase:
```bash
curl -s "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?keyword=eq.{keyword}&select=pipeline_mode,cannibalization_url,cannibalization_risk,cannibalization_note" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
```

2. For each keyword, merge into keyword-selected.json:
   - Set `pipeline_mode` = response `pipeline_mode` ?? `"new"`
   - If `pipeline_mode == "refresh"`: set `existing_article_url` = response `cannibalization_url`
   - Copy `cannibalization_risk` and `cannibalization_note` if present

3. Remove any keywords from keyword-selected.json where the Supabase status has been changed to `"universe"` (user clicked "Skip" in dashboard)

4. Write the updated keyword-selected.json back to disk

## Step 4 — Sync Articles to Registry

After the batch completes (or after each article is approved):

1. Read each completed article's `scorecard.md` to extract: score, word count
2. Read `brief.md` to extract: title, content type
3. Read `keyword-selected.json` to get the target keyword for each article
4. For each new article, append to `seo/registry/article-registry.json`:

```json
{
  "slug": "{article-slug}",
  "title": "{from brief}",
  "status": "produced",
  "target_keyword": "{keyword}",
  "scorecard_score": {score},
  "word_count": {count},
  "content_type": "{type}",
  "batch_id": "{batch-folder-name}",
  "produced_date": "{today YYYY-MM-DD}",
  "published_url": null,
  "published_date": null,
  "last_audit_date": null,
  "last_audit_health": null
}
```

5. Update `last_updated` timestamp in the registry

## Step 5 — Sync Articles to Supabase

For each new article, insert into Supabase `seo_articles` table:

```bash
curl -X POST "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_articles" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{
    "slug": "{slug}",
    "title": "{title}",
    "status": "produced",
    "target_keyword": "{keyword}",
    "scorecard_score": {score},
    "word_count": {count},
    "content_type": "{type}",
    "batch_id": "{batch_id}",
    "produced_date": "{date}"
  }'
```

Load `SUPABASE_SERVICE_KEY` from `/home/exedev/mh-os/.env`.

## Step 6 — Update Keyword Status

For each article produced, update its keyword status in Supabase to "produced":

```bash
curl -X PATCH "https://cizvquoqzrlrpgrxpjbm.supabase.co/rest/v1/seo_keywords?keyword=eq.{target_keyword}" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "produced", "article_slug": "{slug}"}'
```

## Step 7 — Internal Linking Scan

After all articles in the batch are produced, scan for cross-linking opportunities between new and existing articles.

1. Load all articles from `seo/registry/article-registry.json` (both new and previously produced)
2. For each **new** article in this batch, read its `draft-optimized.md`
3. For each **existing** article (from previous batches), check:
   - Does the new article mention the existing article's target keyword? → Add an internal link from new → existing
   - Does the existing article's target keyword relate to the new article's topic? → Note a suggested link from existing → new (for when the existing article is refreshed)
4. Also check against `client-config.json` `internal_links.pillar_pages` — every new article should link to at least one pillar page

**For each linking opportunity found:**
- Open the new article's `draft-optimized.md` and `article-publish.html`
- Insert an `<a href="{published_url}">{anchor text}</a>` at the most natural location (within a relevant paragraph, not forced)
- Use the target keyword or a natural variation as anchor text
- Target: 3-6 internal links per article (2+ to existing articles, 1+ to pillar pages)

**Output:** For each article, report:
- Internal links added: {N} (to which articles/pages)
- Suggested reverse links: {N} (existing articles that should link back to this one — for future refresh)

## Step 8 — Summary

Report:
- Articles produced: {N}
- Average scorecard score: {avg}/25
- Articles passing (23+): {N}
- Articles needing fixes (20-22): {N}
- Internal links added: {N} across batch
- Suggested reverse links: {N} (for future content refreshes)
- Next steps: "Register published URLs in the dashboard or run `/seo-audit` after publishing"
