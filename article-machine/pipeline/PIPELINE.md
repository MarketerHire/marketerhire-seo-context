# SEO Article Pipeline

5-stage pipeline that transforms keyword research context into a publication-ready article optimized for traditional search (SEO), AI answer engines (AEO), and generative search (GEO).

**Pauses after every stage for human review.** You control the pace.

---

## When to Use

Use this skill when:
- You have a keyword research context document (from Numbers, CSV, or markdown)
- You want a complete, publication-ready SEO article
- The article needs AEO optimization (AI Overviews, featured snippets)
- The article needs GEO optimization (Perplexity/ChatGPT citation readiness)

Do NOT use when:
- You need batch article production (use the full playbook pipeline instead)
- You only need a content brief without a draft (use seo-content skill Phase 2)
- You're doing keyword research (use keyword-research skill first)

---

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `context_file` | file path | yes | Path to context document (.numbers, .csv, or .md) |
| `article_slug` | string | no | URL-friendly article name. Auto-derived from context if omitted |

**Accepted context formats:**
- `.numbers` — Apple Numbers spreadsheet (parsed via `numbers-parser`)
- `.csv` — CSV with section headers
- `.md` — Markdown following `context-template.md` format

**Context document must contain 4 sections:**
1. On-Page SEO Recommendations (H1, title tag, meta description, URL slug, schema types)
2. Keyword Research (keyword table with volume, KD, CPC, intent, type)
3. Article Outline (section-by-section with word count targets + keywords per section)
4. H2 Keyword Map (each H2 with primary keyword, secondary keywords, SEO notes)

---

## Outputs

All outputs written to: `output/{article_slug}/`

| Stage | Output | Description |
|-------|--------|-------------|
| 1 | `parsed-context.md` | Structured extraction of context document |
| 2 | `brief.md` | Full article brief with all optimization specs |
| 3 | `draft-v1.md` | First draft following AEO/GEO/SEO rules |
| 4 | `draft-optimized.md` | Optimized article with YAML frontmatter |
| 4 | `schema.json` | Complete JSON-LD structured data |
| 4 | `article-publish.html` | CMS-ready semantic HTML (paste into any CMS) |
| 4 | `article-preview.html` | Self-contained styled HTML for local browser viewing |
| 5 | `scorecard.md` | 25-point quality gate with pass/fail verdict |

---

## Process

The pipeline runs 5 stages sequentially, **pausing after each stage** for human review.

### Stage 1: Parse Context

Read template: `01-parse-context.md`

1. Detect input format by file extension
2. Extract data:
   - `.numbers` → use Python `numbers-parser` library to extract all tables
   - `.csv` → parse rows, detect section boundaries
   - `.md` → pass through (already structured)
3. Structure into 4 standardized sections
4. Validate: flag any missing sections or empty fields
5. Write `parsed-context.md`
6. **→ PAUSE: present parsed context to user for review**

### Stage 2: Generate Brief

Read template: `02-brief.md`

1. Load `parsed-context.md` from Stage 1
2. Load client config from `brand-setup/`
3. (Optional) Enrich with MCP tools:
   - DataForSEO: PAA questions, AI Overview content, SERP features for target keywords
   - Web search: competitor content structure, current stats/data to cite
4. Generate full brief with sections:
   - Target definition (queries, intent, SERP features)
   - Content architecture (outline + per-section specs)
   - Internal linking plan
   - E-E-A-T spec
   - Schema plan
   - AEO formatting requirements
   - GEO readiness requirements
5. Write `brief.md`
6. **→ PAUSE: present brief for review. User can request changes.**

### Stage 3: Draft Article

Read template: `03-draft.md`

1. Load `brief.md` from Stage 2
2. Load client config for tone/voice
3. Write complete first draft following merged rule sets:
   - **Playbook rules:** answer-first, 40-60 word answer blocks, self-contained sections, FAQ
   - **SEO-content rules:** no AI-isms, voice injection, specificity, "So What?" chains
   - **AEO rules:** 7 Page Rules (answer first, go deeper, original data, FAQ, structure, standalone, product integration)
4. Humanization applied during writing (not as a separate pass)
5. Write `draft-v1.md`
6. **→ PAUSE: present draft for review. User can request rewrites.**

### Stage 4: Optimize (4 Passes)

Read template: `04-optimize.md`

1. Load `draft-v1.md` + `brief.md` + client config
2. Run 4 optimization passes as a single operation:
   - **Pass 1 — On-Page SEO:** title tag, meta description, headings, links, alt text, URL slug
   - **Pass 2 — AEO Formatting:** answer blocks, FAQ answers, structured formats, PAA alignment
   - **Pass 3 — GEO Readiness:** modularity, data + sources, entities, depth, author expertise
   - **Pass 4 — Schema Markup:** Article, FAQPage, BreadcrumbList, Person, Organization JSON-LD
3. Write `draft-optimized.md` (with YAML frontmatter)
4. Write `schema.json` (complete JSON-LD)
5. Write `article-publish.html` (CMS-ready semantic HTML — no wrapper, no styles, paste into any CMS)
6. Write `article-preview.html` (self-contained styled HTML — open in browser to review)
7. **→ PAUSE: present optimized article + schema + preview for review.**

### Stage 5: Quality Gate

Read template: `05-scorecard.md`

1. Load `draft-optimized.md` + `schema.json` + `brief.md`
2. Score across 25 criteria in 5 categories:
   - Content & Structure (6 pts)
   - SEO (6 pts)
   - AEO (4 pts)
   - GEO (5 pts)
   - Schema (4 pts)
3. Assign verdict:
   - **PASS** (23+/25): ready to publish
   - **NEEDS FIXES** (20-22): specific fixes listed, user can say "fix the issues"
   - **NEEDS RE-OPTIMIZATION** (<20): loops back to Stage 4
4. Write `scorecard.md`
5. **→ PAUSE: present scorecard. User decides next action.**

---

## Quality Criteria

This skill's output passes if:
- [ ] All 4 context sections parsed correctly (Stage 1)
- [ ] Brief includes all 7 required sections (Stage 2)
- [ ] Draft meets target word count from context doc (Stage 3)
- [ ] No AI-ism words or phrases detected in draft (Stage 3)
- [ ] YAML frontmatter includes title, meta, slug, date (Stage 4)
- [ ] JSON-LD schema validates (Stage 4)
- [ ] Scorecard score >= 23/25 (Stage 5)

---

## Client Setup

See `../brand-setup/BRAND-SETUP-GUIDE.md` for brand setup instructions.
