# SEO/AEO Article Machine

You are running the Article Machine — an automated end-to-end SEO/AEO article production system.

## How to start

Read `SKILL.md` for the full system overview, then execute `commands/run-machine.md`.

**Quick start:** The user will provide a brand name. Follow the 4-phase process:

1. **Phase 1 — Setup:** Run `commands/setup-client.md` (skip if `output/{brand}/brand-setup/` exists)
2. **Phase 2 — Keywords:** Run `commands/run-keyword-intel.md` (skip if `output/{brand}/keyword-intel/keyword-selected.json` exists)
3. **Phase 3 — Articles:** Run `commands/run-article-batch.md` (resume from `batch-state.json` if exists)
4. **Phase 4 — Report:** Run `commands/generate-report.md`

## Output structure

```
output/{brand}/
├── brand-setup/                        # Brand kit + client-config.json
├── machine-config.json                 # Run settings
├── keyword-intel/                      # Keyword research + scoring
│   ├── keyword-universe.json
│   ├── keyword-scored.json
│   ├── keyword-selected.json
│   └── keyword-research-report.md
└── batches/
    └── batch-{N}-{YYYY-MM-DD}/         # One batch per run
        ├── batch-state.json
        ├── batch-report.md
        └── {article-slug}/             # 7 files per article
            ├── parsed-context.md
            ├── brief.md
            ├── draft-v1.md
            ├── draft-optimized.md
            ├── schema.json
            ├── article-publish.html
            ├── article-preview.html
            ├── {article-slug}_feature_image.jpg
            └── scorecard.md
```

## MCP servers available

This system has 5 MCP servers configured in `.mcp.json`. **Ahrefs is the primary source for keyword research.**

| Server | What it does | Priority | Use in |
|--------|-------------|----------|--------|
| **ahrefs** | Organic keywords, keyword explorer, volume, KD, CPC, competitor gap, cannibalization detection | **PRIMARY** | Phase 2: keyword discovery, scoring, cannibalization, competitor gaps |
| **dataforseo** | SERP features, PAA questions, AI Overview presence, keyword suggestions | Supplementary | Phase 2: SERP feature data, PAA for briefs |
| **perplexity** | AI-powered search with citations | Supplementary | Phase 2: content gap analysis, competitor research |
| **gsc** (Google Search Console) | Impression data, CTR, click data | Supplementary | Phase 2: impression/CTR data (Ahrefs covers ranking positions) |
| **analytics-mcp** (GA4) | Organic traffic, top pages, user behavior | Supplementary | Phase 2: traffic intelligence (optional, not blocking) |

### How to use MCPs in each phase

**Phase 2 — Keyword Intelligence:**
- Use **Ahrefs** first (PRIMARY): pull organic keywords the site ranks for, keyword expansion via matching/related terms, competitor gap analysis, cannibalization detection via `serp_target_positions_count`. This is the most authoritative source.
- Use **DataForSEO** (supplementary): PAA questions, SERP features, AI Overview presence. Skip volume/KD if Ahrefs already provided.
- Use **Perplexity** (supplementary): research content gaps, find what AI engines cite for target keywords.
- Use **GSC** (supplementary): impression/CTR data. Skip if not available — Ahrefs covers ranking positions.
- Use **GA4** (supplementary): traffic intelligence. Skip if not available — not blocking for keyword research.

**Phase 3 — Article Briefs:**
- Use **DataForSEO**: pull PAA questions and SERP features for each target keyword.
- Use **Perplexity**: research current data/stats to cite in articles.

## Folder reference

| Folder | Purpose |
|--------|---------|
| `pipeline/` | SEO article pipeline — 5 stages (parse → brief → draft → optimize → scorecard) |
| `aeo-agents/` | AEO article agents — 4 agents (brief → writer → humanizer → critic) |
| `agents/` | Machine-specific agents (keyword-scorer, keyword-researcher, context-compiler, batch-reporter) |
| `commands/` | Phase orchestrators (setup, keyword-intel, article-batch, report, run-machine) |
| `rules/` | AI-tell removal rules |
| `schemas/` | JSON schemas for keyword data and machine config |
| `templates/` | Presentation templates (setup wizard, keyword approval, batch report) |
| `knowledge-base/` | Scoring methodology and pipeline selection guide |
| `brand-setup-templates/` | Blank templates for new brand onboarding |
| `output-spec/` | Output format documentation (article-publish.html vs article-preview.html) |
| `output/` | Runtime output — organized by brand → batch → article |

## Critical rules

1. **article-preview.html** must be a full standalone HTML page with DOCTYPE, meta box, styled article, word count footer, and visible schema block
2. **article-publish.html** must be a bare `<article>` snippet with HTML comment metadata and `<script type="application/ld+json">` — NO wrapper
3. **AI-tell removal** is mandatory — see `rules/remove-ai-tells.md`
4. **Human approval** required at keyword selection and per-article scorecard (unless auto-approve threshold is set)
5. **Each article runs in its own subagent** — never load full article content into the lead orchestrator
6. **All internal links** must be verified against client-config.json — never fabricate URLs

## GA4 property IDs

Default: `324078883` (marketerhire_web). Change in `.mcp.json` per client.

Available properties:
- MarketerHire: `324078883`
- Soko Glam: `281074590`
