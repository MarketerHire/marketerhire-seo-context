# SEO System Update — April 13, 2026

## What was built today

- **Cannibalization detection system** — every keyword is now automatically checked against the site's existing GSC rankings and published URLs before article production. Each keyword gets a risk level (none/low/medium/high/critical) with the existing page URL and a human-readable recommendation. This prevented us from producing 4 articles that would have competed with pages MarketerHire already ranks for (one was ranking position ~5 on Google — creating a new article would have hurt it).

- **Actionable dashboard buttons** — cannibalized keywords now show inline action buttons: Refresh Existing (update the existing page instead of creating new), Replace (swap with the next-best clean keyword), Proceed Anyway (override with explicit decision), or Skip. Decisions sync to Supabase and flow into the article machine automatically.

- **Refresh pipeline mode** — when a keyword is marked for "refresh" instead of "new," the entire 5-stage article pipeline adapts: the subagent fetches the existing article, the brief designs a keep/rewrite/add/remove strategy, the draft reuses strong sections and rewrites weak ones, schema preserves the original publish date, and the scorecard uses adjusted thresholds. This is built into the client-agnostic engine, not just MarketerHire.

- **Activity timeline panel** — new slide-out panel accessible from every dashboard page (click "Activity" button, top right). Groups all SEO events by date: keywords researched, keywords selected, articles produced, articles published, audits completed. Auto-populates from existing Supabase data — no manual logging needed.

- **Produced 20 articles across 3 batches** (15 today + 5 from April 9), all scoring 23-24/25 on the quality scorecard. ~58,000 words of SEO-optimized content with CMS-ready HTML, JSON-LD schema markup, verified internal links, and FAQ sections. Diversified across 8 keyword clusters to avoid self-cannibalization.

## Production stats

| Batch | Date | Articles | Avg Score | Clusters Covered |
|-------|------|----------|-----------|-----------------|
| batch-001 | Apr 9 | 5 | 23.8/25 | agency-comparison, freelance, scaling |
| batch-002 | Apr 13 | 5 | 24.0/25 | fractional-cmo, hire-marketer, outsource, freelance |
| batch-003 | Apr 13 | 5 | 23.4/25 | fractional-cmo, hire-marketer, fractional-marketing, agency-comparison |
| batch-004 | Apr 13 | 5 | 24.0/25 | hire-marketer, startup-marketing (x4) |
| **Total** | | **20** | **23.8/25** | **8 clusters** |

Each article includes: keyword-driven brief, competitive gap analysis, 4-pass SEO/AEO/GEO optimization, Article + FAQPage + BreadcrumbList + HowTo schema, 7-13 verified internal links, customer voice quotes from discovery calls, zero AI-tell violations.

## What the system looks like now

```
Keyword Research (100+ keywords, scored, clustered)
    ↓
Cannibalization Check (automatic GSC + site: search)
    ↓
Dashboard Review (action buttons: Refresh / Replace / Proceed / Skip)
    ↓
Article Production (subagent-per-article, 5-stage pipeline)
    ↓
Registry + Supabase Sync (auto)
    ↓
Dashboard Updates (articles, activity timeline)
    ↓
Weekly Audit (GA4 + GSC → health scores → quick wins)
```

Live dashboard: https://dashboard-marketer-hire.vercel.app

## Still under construction

- Publishing automation (Erveen) — articles are produced with CMS-ready HTML + schema, but need to be pushed live manually. Once automation is done, auto-indexing to GSC is the next piece.
- 5 keywords with self-cannibalization risk were intentionally skipped — those existing pages should be refreshed (using the new refresh pipeline mode) rather than competing with new articles.
- Dashboard-added keywords without DataForSEO enrichment work but don't have volume/KD/CPC data — the pipeline falls back to web search for SERP research. Not a blocker but enrichment gives better scoring.

## Next steps

1. **Erveen: publishing automation + GSC indexing** — assign Erveen on pushing the 20 produced articles live. Publishing automation should include automatic GSC indexing submission so new pages get crawled immediately. Get an update on timeline.

2. **Push system to GitHub** — the entire SEO engine (article machine, dashboard, CLI commands, pipeline stages) currently runs locally on my machine. Needs to be pushed to a MarketerHire GitHub repo so it's not dependent on my local environment and the team can access it.

3. **Dashboard builder for clients** — replicate the MH dashboard (Supabase + Next.js + Vercel) as a template we can deploy for any client. The article machine is already client-agnostic (`output/{brand}/`), but the dashboard is currently hardcoded to MarketerHire's Supabase project. Need to parameterize: Supabase project URL, brand name, GA4 property ID, GSC domain.

4. **Refresh the 5 cannibalized pages** — "hire fractional cmo," "fractional cmo services," "hire a marketing consultant," "how to hire a marketing consultant," and "outsource marketing services" all have existing MH blog posts. Use the new refresh pipeline to update those existing pages instead of creating competing content.

5. **Run first `/seo-audit`** — once articles are published and indexed, run the weekly audit to start tracking organic sessions, position trends, and health scores in the dashboard.
