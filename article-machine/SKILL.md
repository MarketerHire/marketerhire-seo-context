---
name: article-machine
description: |
  Automated SEO/AEO article production machine. Handles the full pipeline from keyword sourcing
  to published articles: guided client setup → keyword intelligence → scoring → selection →
  article generation loop. Context-window efficient via subagent architecture.
  Use when asked to 'run the article machine', 'generate articles automatically',
  'start article pipeline for [client]', 'source keywords and write articles'.
metadata:
  author: mh1-engineering
  version: "1.0.0"
  status: active
  created: "2026-04-09"
  updated: "2026-04-09"
  estimated_runtime: "60-120min for 5 articles"
  max_runtime: "180min"
  estimated_cost: "$10-20 for 5 articles"
  max_cost: "$40"
  client_facing: true
  requires_human_review: true
  tags:
    - generation
    - seo
    - aeo
    - geo
    - content
    - article
    - automation
    - keyword-research
allowed-tools: Read Write Edit Shell CallMcpTool Glob Grep WebSearch WebFetch
---

# SEO/AEO Article Machine

Automated end-to-end article production. Sources keywords, scores them, selects the best ones, compiles research, and runs the article creation pipeline in a configurable loop.

**4 phases. 3 human gates. N articles per run.**

---

## When to Use

Use this skill when:
- You want to produce multiple SEO/AEO articles with minimal manual intervention
- You need automated keyword sourcing and scoring
- You want the full pipeline from zero to published articles
- You're onboarding a new client and want to go from brand setup to content

Do NOT use when:
- You already have a context document and want a single article (use the pipeline files in `pipeline/` directly)
- You only need keyword research without article generation (use `commands/run-keyword-intel.md`)
- You only need brand setup (use `commands/setup-client.md`)

---

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `brand` | string | yes | Brand name, used as folder name under `output/` |
| `article_count` | number | no | Number of articles to generate. Default: 5 |
| `parallel_articles` | number | no | Max articles to generate simultaneously. Default: 2 |
| `skip_setup` | boolean | no | Skip Phase 1 if brand-setup already exists. Default: auto-detect |
| `skip_keyword_intel` | boolean | no | Skip Phase 2 if keyword-selected.json already exists. Default: auto-detect |

---

## Outputs

All outputs written to `output/{brand}/`

```
output/{brand}/
├── brand-setup/              # Phase 1 (brand kit + client-config.json)
├── machine-config.json       # Machine settings
├── keyword-intel/            # Phase 2
│   ├── keyword-universe.json
│   ├── keyword-scored.json
│   ├── keyword-selected.json
│   └── keyword-research-report.md
└── batches/
    └── batch-{N}-{YYYY-MM-DD}/   # Phase 3 + 4
        ├── batch-state.json
        ├── batch-report.md
        └── {article-slug}/        # 7 files per article
```

| Phase | Output | Location |
|-------|--------|----------|
| 1 | Brand setup files (10) | `brand-setup/` |
| 1 | Client config | `brand-setup/client-config.json` |
| 1 | Machine config | `machine-config.json` |
| 2 | Keyword universe | `keyword-intel/keyword-universe.json` |
| 2 | Scored keywords | `keyword-intel/keyword-scored.json` |
| 2 | Selected keywords | `keyword-intel/keyword-selected.json` |
| 2 | Research report | `keyword-intel/keyword-research-report.md` |
| 3 | Article files (7 per article) | `batches/{batch-id}/{article-slug}/` |
| 3 | Batch state | `batches/{batch-id}/batch-state.json` |
| 4 | Aggregate report | `batches/{batch-id}/batch-report.md` |

---

## Process

### Phase 1: Guided Client Setup

**Command:** `commands/setup-client.md`

1. Check if `output/{brand}/brand-setup/` exists
   - If yes and complete → skip to Phase 2
   - If partial → show status, offer to complete missing pieces
   - If no → run the setup wizard
2. Run guided intake wizard (8 questions):
   - Company name, website, industry, target audience
   - Competitors (2-5), content goals, authors, existing blog URL
3. Run brand-setup pipeline via `aeo-agents/` (9 sequential subagents):
   - company-researcher → persona-researcher → question-gatherer → voice-researcher → customer-voice-researcher → content-inventory-mapper → pseo-transcript-miner → pseo-opportunity-extractor → pseo-pattern-clusterer
4. Generate `client-config.json` from wizard answers (authors, internal links, schema)
5. Generate `machine-config.json` with defaults
6. **→ HUMAN GATE: Present brand kit summary for approval**

### Phase 2: Keyword Intelligence

**Command:** `commands/run-keyword-intel.md`

1. Check if `keyword-selected.json` exists → skip if present
2. Load brand context (company-profile, personas, questions.json)
3. Run keyword-research skill (6 Circles Method):
   - Seed generation from brand context
   - 6-circle expansion (what you sell, problems you solve, outcomes, categories, audience terms, competitors)
   - Cluster into topic pillars
4. Enrich with MCP tools:
   - WebSearch: SERP analysis for top keywords, competitor content gaps
   - DataForSEO (if API key available): volume, KD, CPC, SERP features, PAA
5. Run keyword-scorer agent with composite formula:
   ```
   Score = (Business_Value × 0.30) + (Opportunity × 0.25) +
           (Difficulty_Inv × 0.20) + (Relevance × 0.15) + (Content_Gap × 0.10)
   ```
6. Select top N keywords (N = article_count from config)
7. Run keyword-researcher agent for per-keyword deep research:
   - Top 5 SERP results analysis (structure, word count, gaps)
   - PAA questions collected
   - AI Overview check
   - Content gap identification
8. Write all outputs to `output/{brand}/keyword-intel/`
9. **→ HUMAN GATE: Present ranked keyword table for approval**

### Phase 3: Article Generation Loop

**Command:** `commands/run-article-batch.md`

1. Load `keyword-selected.json` (approved keywords)
2. Initialize or resume `batch-state.json`
3. For each keyword (up to `parallel_articles` at a time):
   - **Spawn subagent** (each article runs in its own context window):
     a. Load brand-setup files + client-config from disk
     b. Load keyword research data for this specific keyword
     c. Run context-compiler agent → generate filled `context-template.md`
     d. Run `pipeline/` stages 1-5 (parse → brief → draft → optimize → scorecard)
     e. Write 7 output files to `output/{brand}/batches/{batch-id}/{article-slug}/`
     f. Update `batch-state.json`
   - **Lead reads scorecard** (NOT full article — context efficiency)
   - **→ HUMAN GATE per article:**
     - Score 23+/25 → "PASS — approve?"
     - Score 20-22 → "NEEDS FIXES — re-run optimization?"
     - Score <20 → "NEEDS RE-OPTIMIZATION — re-run full Stage 4?"
4. Continue until all keywords processed

**Context window strategy:**
- Lead orchestrator: ~15K tokens (only holds state, paths, scorecard summaries)
- Per-article subagent: ~85K tokens (brand context + keyword data + pipeline templates + content)
- Subagents are disposable — each article's context is isolated

### Phase 4: Reporting

**Command:** `commands/generate-report.md`

1. Read all scorecards from `output/{brand}/batches/{batch-id}/*/scorecard.md`
2. Read keyword data from `output/{brand}/keyword-intel/`
3. Generate aggregate report:
   - Average scores across all articles
   - Content coverage: which topics are now covered
   - Remaining gaps from keyword-universe.json
   - Next-batch keyword recommendations
4. Write `output/{brand}/batches/{batch-id}/batch-report.md`

---

## Human Approval Gates

| Gate | Phase | Blocking? | What User Sees |
|------|-------|-----------|----------------|
| Brand kit review | End of Phase 1 | Yes | Summary of company profile, personas, question count |
| Keyword selection | End of Phase 2 | Yes | Ranked keyword table with scores, volume, difficulty |
| Per-article scorecard | During Phase 3 | Yes (per article) | Scorecard score, title, word count, verdict |
| Batch report | End of Phase 4 | No | Aggregate metrics, coverage analysis |

---

## Resume Capability

The machine is resumable at any point:

- **Phase 1:** Detects existing brand-setup files, skips if complete
- **Phase 2:** Detects existing keyword-selected.json, skips if present
- **Phase 3:** Reads `batch-state.json` — continues from last pending keyword
- **Phase 4:** Can be re-run anytime to regenerate the report

To resume a stopped run: just invoke the machine again with the same `brand`.

---

## Configuration

Per-brand settings in `output/{brand}/machine-config.json`:

```json
{
  "article_count": 5,
  "pipeline": "seo",
  "parallel_articles": 2,
  "approval_gates": ["keyword_selection", "article_review"],
  "auto_approve_threshold": null,
  "keyword_sources": ["websearch", "questions_json"],
  "content_types": ["pillar-guide", "how-to", "comparison", "listicle"]
}
```

| Setting | Default | Description |
|---------|---------|-------------|
| `article_count` | 5 | Number of articles per run |
| `pipeline` | "seo" | Which pipeline: "seo", "aeo", or "auto" |
| `parallel_articles` | 2 | Max concurrent article subagents |
| `approval_gates` | both | Which gates require human approval |
| `auto_approve_threshold` | null | Auto-approve articles scoring >= this (null = always ask) |
| `keyword_sources` | websearch + questions | Where to source keywords |
| `content_types` | all | Limit to specific content types |

---

## MCP Tools Used

| Tool | Phase | Purpose | Required? |
|------|-------|---------|-----------|
| WebSearch | 2, 3 | SERP analysis, competitor discovery, current stats | Yes |
| WebFetch | 2 | Fetch competitor pages for gap analysis | Optional |
| DataForSEO | 2 | Volume, KD, CPC, SERP features | Optional (provide DataForSEO API key as environment variable if available) |

---

## Quality Criteria

This skill's output passes if:
- [ ] Brand setup complete with all required files (Phase 1)
- [ ] At least N keywords scored and approved (Phase 2)
- [ ] All N articles score 23+/25 on the quality scorecard (Phase 3)
- [ ] Aggregate report generated with coverage analysis (Phase 4)
