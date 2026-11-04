---
name: seo-audit
description: >
  Full website SEO audit with parallel subagent delegation. Crawls up to 500
  pages, detects business type, delegates to 6 specialists, generates health
  score. Use when user says "audit", "full SEO check", "analyze my site",
  or "website health check".
---

# Full Website SEO Audit

## Process

1. **Fetch homepage** — use `scripts/fetch_page.py` to retrieve HTML
2. **Detect business type** — analyze homepage signals per seo orchestrator
3. **Crawl site** — follow internal links up to 500 pages, respect robots.txt
4. **Delegate to subagents** (if available, otherwise run inline sequentially):
   - `seo-technical` — robots.txt, sitemaps, canonicals, Core Web Vitals, security headers
   - `seo-content` — E-E-A-T, readability, thin content, AI citation readiness
   - `seo-schema` — detection, validation, generation recommendations
   - `seo-sitemap` — structure analysis, quality gates, missing pages
   - `seo-performance` — LCP, INP, CLS measurements
   - `seo-visual` — screenshots, mobile testing, above-fold analysis
5. **Score** — aggregate into SEO Health Score (0-100)
6. **Report** — generate prioritized action plan

## Crawl Configuration

```
Max pages: 500
Respect robots.txt: Yes
Follow redirects: Yes (max 3 hops)
Timeout per page: 30 seconds
Concurrent requests: 5
Delay between requests: 1 second
```

## Output Files

- `FULL-AUDIT-REPORT.md` — Comprehensive findings
- `ACTION-PLAN.md` — Prioritized recommendations (Critical → High → Medium → Low)
- `screenshots/` — Desktop + mobile captures (if Playwright available)

## Scoring Weights

| Category | Weight |
|----------|--------|
| Technical SEO | 25% |
| Content Quality | 25% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| Images | 5% |
| AI Search Readiness | 5% |

## Report Structure

### Executive Summary
- Overall SEO Health Score (0-100)
- Business type detected
- Top 5 critical issues
- Top 5 quick wins

### Technical SEO
- Crawlability issues
- Indexability problems
- Security concerns
- Core Web Vitals status

### Content Quality
- E-E-A-T assessment
- Thin content pages
- Duplicate content issues
- Readability scores

### On-Page SEO
- Title tag issues
- Meta description problems
- Heading structure
- Internal linking gaps

### Schema & Structured Data
- Current implementation
- Validation errors
- Missing opportunities

### Performance
- LCP, INP, CLS scores
- Resource optimization needs
- Third-party script impact

### Images
- Missing alt text
- Oversized images
- Format recommendations

### AI Search Readiness
- Citability score
- Structural improvements
- Authority signals

## Priority Definitions

- **Critical**: Blocks indexing or causes penalties (fix immediately)
- **High**: Significantly impacts rankings (fix within 1 week)
- **Medium**: Optimization opportunity (fix within 1 month)
- **Low**: Nice to have (backlog)

## DataForSEO Integration (Optional)

If DataForSEO MCP tools are available, spawn the `seo-dataforseo` agent alongside existing subagents to enrich the audit with live data: real SERP positions, backlink profiles with spam scores, on-page analysis (Lighthouse), business listings, and AI visibility checks (ChatGPT scraper, LLM mentions).

## Phase 2: Deep-Dive Commands (Automatic)

After the main audit completes, automatically run these four skills in sequence to gather deeper data. Deduplicate findings intelligently — skip sections already covered in Phase 1, but always pull fresh data from APIs/tools. Merge new findings into the existing audit folder structure.

### 1. `/seo-geo` — AI Search & Generative Engine Optimization
- Run immediately after main audit
- Output goes to `06-aeo-citation-audit/` folder
- Covers: AI Overviews, ChatGPT citations, Perplexity visibility, llms.txt, passage-level citability
- **Dedup rule:** If main audit already tested LLM responses, skip those specific prompts but run NEW prompts targeting the brand's core commercial queries. Always pull fresh LLM mention data from DataForSEO.

### 2. `/seo-competitor-pages` — Competitor Comparison Analysis
- Run after `/seo-geo` completes (or in parallel if independent)
- Output goes to `09-competitors/` folder
- Covers: "X vs Y" page opportunities, "alternatives to X" content gaps, competitive feature matrices
- **Dedup rule:** Use competitor data already gathered in Phase 1 (DataForSEO competitors_domain) as input. Expand with page-level intersection data and SERP competitor analysis for top keywords.

### 3. `/seo-technical` — Extended Technical Audit
- Run after main audit (or in parallel)
- Output goes to `02-technical/` folder
- Covers: Deep crawlability, indexability, security headers, URL structure, mobile, Core Web Vitals, structured data, JS rendering
- **Dedup rule:** Skip robots.txt and sitemap analysis if already covered. Focus on NEW checks: security headers, redirect chains, mobile rendering, JavaScript rendering issues, and page-level technical audits for top 10 traffic pages.

### 4. `/seo-content` — Content Quality & E-E-A-T Deep-Dive
- Run after main audit (or in parallel with other Phase 2 commands)
- Output goes to `03-content/` folder
- Covers: Page-level content depth analysis, E-E-A-T scoring per Google's Quality Rater Guidelines, thin content detection, readability scoring, AI citation readiness per page, author attribution gaps, content freshness signals
- **Dedup rule:** Use E-E-A-T scores and content quality data from Phase 1 as baseline. Deep-dive into individual pages (top 10 by traffic + top 5 by impressions). Pull fresh DataForSEO content_parsing data for page-level word counts, heading structure, and link analysis. Skip pages already analyzed at the same depth.

### Compilation Step

After all three commands complete:
1. **Merge new findings** into `FULL-AUDIT-REPORT.md` — add new sections or append to existing ones
2. **Update scores** if new data changes category scores
3. **Update ACTION-PLAN.md** with any new recommendations discovered
4. **Update INDEX.md** to reflect all data sources used
