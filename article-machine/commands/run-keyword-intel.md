# Phase 2: Keyword Intelligence

## Your Role

You are the **Keyword Intelligence Engine**. You source, score, and rank keywords to find the best article opportunities for the client.

## Inputs

- `output/{brand}/brand-setup/company-profile.md`
- `output/{brand}/brand-setup/audience-personas.md`
- `output/{brand}/brand-setup/questions.json`
- `output/{brand}/brand-setup/content-inventory.json`
- `output/{brand}/brand-setup/client-config.json`
- `output/{brand}/machine-config.json`

## Process

### Step 1: Check Existing State

```
Check: Does output/{brand}/keyword-intel/keyword-selected.json exist?
  → If yes → Show existing selection, ask if user wants to re-run or proceed
  → If no → Continue with keyword research
```

### Step 2: Seed Generation

Load brand context files. Generate 20-30 seed keywords from:

**From company-profile.md:**
- Direct terms (what the company sells/offers)
- Problem terms (what pain the company solves)
- Outcome terms (results the company delivers)
- Category terms (broader industry terms)

**From audience-personas.md:**
- Role-specific queries each persona would search
- Pain point queries
- Solution-seeking queries

**From questions.json:**
- Extract topic tags → use as seed topics
- Extract questions → derive keyword patterns

### Step 3: Expand (6 Circles Method)

For each seed keyword, run the 6 Circles keyword expansion method (see `knowledge-base/scoring-methodology.md`):

1. **What You Sell** — products, services, solutions
2. **Problems You Solve** — pain points, challenges, frustrations
3. **Outcomes You Deliver** — results, ROI, improvements
4. **Your Category** — industry terms, market segments
5. **Your Audience** — role-specific terms, "for {role}" modifiers
6. **Your Competitors** — "vs", "alternative to", comparison terms

Target: 100-200 expanded keywords.

Write expanded list to `output/{brand}/keyword-intel/keyword-universe.json`:
```json
[
  {
    "keyword": "content marketing strategy",
    "source": "seed_direct",
    "circle": "what_you_sell",
    "cluster": null,
    "search_volume": null,
    "kd": null,
    "cpc": null,
    "intent": "informational",
    "raw_data": {}
  }
]
```

### Step 4: Cluster into Topic Pillars

Group related keywords into 8-15 topic pillars. Each pillar represents a potential content cluster.

Update `keyword-universe.json` with `cluster` field.

### Step 5: MCP Enrichment

Use the 5 MCP servers configured in `.mcp.json`. **Ahrefs is the primary data source for keyword research.** Run them in this order:

**Step 5a: Ahrefs (ahrefs MCP) — PRIMARY: Keyword Intelligence + Cannibalization**

Ahrefs is the most authoritative source for keyword data. Use it first, before GSC or DataForSEO.

**5a-i. Organic Keywords Discovery**
Pull all keywords the brand's domain currently ranks for:
- Use `site-explorer/organic-keywords` endpoint with the brand's domain
- Get: keyword, position, volume, difficulty, CPC, traffic, URL ranking for it
- Keywords at positions 5-20 → quick win candidates (add to universe with `source: "ahrefs"`)
- Keywords at positions 1-3 → mark as "defended"
- Keywords losing position → refresh candidates

**5a-ii. Keyword Expansion**
For each seed keyword cluster, use Ahrefs Keywords Explorer:
- `keywords-explorer/matching-terms` — find related keywords by search term
- `keywords-explorer/related-terms` — semantic keyword suggestions
- `keywords-explorer/search-suggestions` — autocomplete-style ideas
- For each discovered keyword, pull: volume, difficulty, CPC, intent classification
- Add to `keyword-universe.json` with `source: "ahrefs"`

**5a-iii. Cannibalization Detection (mandatory for every keyword)**

Ahrefs provides the best cannibalization data through the `organic-keywords` endpoint:
1. For each keyword in the universe, query Ahrefs `organic-keywords` with the brand's domain
2. Check `serp_target_positions_count` — if > 1, multiple URLs rank for the same keyword = cannibalization
3. Also check via WebSearch `site:{domain} "{keyword}"` for additional coverage

For each keyword, set cannibalization fields:

```json
{
  "cannibalization_risk": "none|low|medium|high|critical",
  "cannibalization_url": "https://...",       // best-ranking existing page (from Ahrefs position data)
  "cannibalization_note": "human-readable reason"
}
```

**Risk classification:**

| Risk | Condition | Action |
|------|-----------|--------|
| **critical** | Existing page ranks positions 1-5 for this exact keyword (Ahrefs data) | Do NOT create new article. Refresh existing page instead. |
| **high** | Existing page ranks 6-15 OR multiple URLs rank for same keyword (`serp_target_positions_count > 1`) | Flag for review. Likely better to refresh/consolidate than create new. |
| **medium** | Existing pSEO/service page covers this topic but no blog post | New article may be safe if intent differs (informational vs transactional). Flag for review. |
| **low** | Brand domain appears in Ahrefs data but content is tangential | Safe to proceed. Note existing URL for internal linking. |
| **none** | No existing pages found ranking for this keyword | Safe to proceed. Green light. |

**5a-iv. Competitor Gap Analysis**
Use Ahrefs `site-explorer/organic-competitors` to identify domains competing for the same keywords. For the top 3-5 competitors:
- Pull their top-ranking keywords that the brand does NOT rank for → content gap opportunities
- Add high-value gaps to the keyword universe with `source: "ahrefs-gap"`

Add cannibalization fields and Ahrefs metrics to every keyword in `keyword-universe.json` and `keyword-scored.json`.

**Step 5b: Google Search Console (gsc MCP) — Supplementary: Impression Data**

GSC supplements Ahrefs with impression and CTR data that Ahrefs doesn't have:
- Queries with high impressions but low CTR → title/meta description optimization opportunities
- Click data by page → validates Ahrefs position estimates
- Skip if GSC access is not available — Ahrefs covers ranking data adequately

**Step 5c: DataForSEO (dataforseo MCP) — Supplementary: SERP Features + PAA**

DataForSEO supplements Ahrefs with SERP feature data:
- Pull PAA (People Also Ask) questions for primary keywords → use in briefs and FAQ sections
- Check AI Overview presence per keyword → AEO targeting signals
- SERP features (featured snippets, knowledge panels, local pack) → content format decisions
- Use `keyword_suggestions` endpoint for any additional expansion not covered by Ahrefs
- Skip volume/KD/CPC if Ahrefs already provided them — avoid duplicate data

**Step 5d: Google Analytics 4 (analytics-mcp) — Supplementary: Traffic Intelligence**
Pull the brand's content performance data (if GA4 access available):
- Top landing pages by organic sessions → identify what topics already drive traffic
- Pages with high bounce rate → content quality issues, refresh candidates
- Pages with no organic traffic → content gap signals
- Cross-reference top pages with keyword clusters to find uncovered clusters
- Skip if GA4 access is not available — not blocking for keyword research

**Step 5d: Perplexity (perplexity MCP) — AI Citation Intelligence**
For each top-priority cluster (top 3-5):
- Query Perplexity with the primary keyword → see what sources it cites
- Identify which competitors are being cited by AI engines
- Find content angles that AI engines prefer (data-rich, structured, authoritative)
- Note gaps: topics where Perplexity gives thin answers = opportunity

**Step 5e: WebSearch — SERP Analysis**
For each top-priority cluster:
- Search the primary keyword
- Analyze top 5 results: structure, word count, content quality
- Identify content gaps competitors miss

Update `keyword-universe.json` with all enrichment data.

### Step 6: Score Keywords

Run the keyword-scorer agent (`agents/keyword-scorer.md`) with:
- The enriched `keyword-universe.json`
- Brand context files

The scorer applies the composite formula:

```
Score = (Business_Value × 0.30) + (Opportunity × 0.25) +
        (Difficulty_Inv × 0.20) + (Relevance × 0.15) + (Content_Gap × 0.10)
```

**Cannibalization penalty (applied after composite score):**

| Risk | Penalty |
|------|---------|
| critical | Score set to 0 — keyword is blocked from selection |
| high | Score × 0.5 — heavy penalty, unlikely to be selected |
| medium | Score × 0.8 — moderate penalty |
| low | Score × 0.95 — minor penalty |
| none | No penalty |

The original (pre-penalty) score is preserved as `composite_score_raw` so the user can see both.

Output: `output/{brand}/keyword-intel/keyword-scored.json` — same as universe but with scoring and cannibalization fields added.

### Step 7: Select Top N

From the scored keywords, select the top N (from `machine-config.json → article_count`).

Ensure diversity:
- No more than 2 keywords from the same cluster
- Mix of intent types (informational, commercial, transactional)
- Mix of difficulty levels (at least 1-2 low-KD "quick wins")
- **NEVER select keywords with cannibalization_risk "critical"** — these are blocked
- Flag keywords with "high" risk in the selection table — user must explicitly approve

Write to `output/{brand}/keyword-intel/keyword-selected.json`:
```json
[
  {
    "keyword": "content marketing strategy",
    "article_slug": "content-marketing-strategy",
    "cluster": "content-marketing",
    "composite_score": 82,
    "search_volume": 12100,
    "kd": 45,
    "cpc": 4.50,
    "intent": "informational",
    "content_type": "pillar-guide",
    "estimated_word_count": "2500-3000",
    "pipeline_mode": "new",
    "existing_article_url": null,
    "cannibalization_risk": "none",
    "cannibalization_url": null,
    "cannibalization_note": null,
    "research_data": {
      "serp_analysis": "...",
      "top_competitors": [...],
      "paa_questions": [...],
      "ai_overview": true,
      "content_gaps": [...]
    }
  }
]
```

### Step 8: Per-Keyword Deep Research

For each selected keyword, run the keyword-researcher agent (`agents/keyword-researcher.md`):
- Analyze top 5 SERP results (structure, word count, unique angles)
- Collect all PAA questions
- Check AI Overview content and sources
- Identify specific content gaps competitors miss
- Note data/stats that should be included

Append research data to each keyword in `keyword-selected.json`.

### Step 9: Generate Report

Write `output/{brand}/keyword-intel/keyword-research-report.md`:

```markdown
# Keyword Intelligence Report: {client_name}

**Date:** {date}
**Keywords analyzed:** {total}
**Keywords selected:** {N}

## Selected Keywords

| # | Keyword | Score | Volume | KD | Intent | Type |
|---|---------|-------|--------|-----|--------|------|
| 1 | ... | 82 | 12,100 | 45 | Info | Pillar |
| ... |

## Keyword Score Breakdown
[For each selected keyword, show the 5 dimension scores]

## Cluster Coverage
[Which topic pillars are covered by selected keywords]

## Content Gaps Identified
[Key gaps found in competitor content]

## Next Batch Candidates
[Top 5 keywords that didn't make the cut — for the next run]
```

### Step 10: Human Approval Gate

Present the selection to the user:

```
## Keyword Selection for Approval

| # | Keyword | Score | Volume | KD | Intent | Cannibal. Risk | Existing URL |
|---|---------|-------|--------|-----|--------|----------------|--------------|
{table rows — highlight rows with cannibalization_risk "high" or "medium" in bold/warning}

⚠ CANNIBALIZATION ALERTS:
{For each keyword with risk "high" or "medium", show:}
  - Keyword: "..." — Risk: {risk} — Existing: {url}
    Note: {cannibalization_note}
    Recommendation: {refresh existing / consolidate / proceed with caution}

Actions:
- **approve** — proceed to article generation
- **remove N** — remove keyword #N from selection
- **replace N** — swap keyword #N with next-best from scored list
- **add [keyword]** — add a specific keyword
- **reorder** — change priority order
- **rerun** — re-run scoring with different parameters
```

Wait for approval before Phase 3 begins.

## Output

All files written to `output/{brand}/keyword-intel/`.
