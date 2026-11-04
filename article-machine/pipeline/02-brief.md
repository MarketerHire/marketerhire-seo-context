# Stage 2: Generate Article Brief

## Purpose
Transform the parsed context + client config into a complete article brief that specifies exactly what to write, how to structure it, and what optimization targets to hit.

## Inputs
- `parsed-context.md` from Stage 1
- `brand-setup/client-config.json`
- (Optional) MCP tool data: DataForSEO PAA/SERP, web search for competitor analysis

## Refresh Mode (Conditional)

If `existing-article.md` exists in the article output directory, this is a CONTENT REFRESH (not a new article):

1. Read `existing-article.md` before generating the brief
2. Analyze the existing article's strengths and weaknesses:
   - Which sections are strong and current? (keep with light edits)
   - Which sections are outdated, thin, or poorly structured? (rewrite)
   - What's missing that competitors now cover? (add)
   - What's no longer relevant? (remove)
3. Add **Section 0: Refresh Strategy** at the top of the brief:

```
### Section 0: Refresh Strategy

Existing URL: {url}
Last updated: {date from article or "unknown"}

#### Sections to KEEP (minor edits only)
- {section heading}: {reason it's strong}

#### Sections to REWRITE
- {section heading}: {reason — outdated data, thin content, poor structure}

#### Sections to ADD (new)
- {topic}: {reason — content gap, new competitor coverage, new data}

#### Sections to REMOVE
- {section heading}: {reason — no longer relevant, cannibalized by other page}
```

The rest of the brief sections below generate as normal, but informed by the refresh strategy.

---

## Brief Generation

Using the parsed context and client config, generate the following brief sections:

---

### Section 1: Target Definition

```
Primary query: [from keyword research — highest priority Primary Target]
Secondary queries: [all other Primary Target + Secondary keywords]
Search intent: [from keyword research]
Target SERP features: [infer from keywords — AI Overview, Featured Snippet, PAA]
Target AI platforms: [Google AI Overviews, Perplexity, ChatGPT Search]
```

### Section 2: Competitive Intelligence (Optional — MCP Enrichment)

If MCP tools available, pull:
- DataForSEO: top 10 SERP results for primary query, PAA questions, AI Overview content
- Web search: top 3 competitor articles — note structure, word count, what's missing

Format as:
```
### Competitor 1: [URL]
- Structure: [heading outline]
- Word count: ~X
- Strengths: [what they do well]
- Gaps: [what's missing — our opportunity]

### AI Overview Analysis
- Currently triggered: Yes/No
- Sources cited: [list]
- Content format: [paragraph/list/table]
- Gap: [what's not covered]
```

If MCP tools unavailable, note: "Competitive intelligence skipped — no MCP tools available. Brief built from context document only."

### Section 3: Content Architecture

Build from the Article Outline (Section 3 of parsed context):

```
## Proposed H1
[From on-page SEO recommendations]

## Full Outline

### INTRO (150-200 words)
- Open with [specific stat or hook from outline description]
- Keywords to include: [from outline]
- AEO requirement: first 100 words must be extractable standalone answer

### H2: [Section title] (XXX-XXX words)
- Requirement: [1-sentence description from outline]
- Keywords: primary — [from H2 keyword map], secondary — [from H2 keyword map]
- AEO requirement: open with 40-60 word answer block
- Format: [table/list/paragraphs — infer from description]

[Repeat for each H2]

### FAQ Section (200-250 words)
- Questions: [from outline + any PAA questions from MCP]
- Each answer: 40-60 words, self-contained
- Schema: FAQPage JSON-LD

### CONCLUSION + CTA (100-150 words)
- CTA: [from outline]
```

**Total target word count:** [from outline]

### Section 4: Internal Linking Plan

From client config `internal_links`:
```
Pages that should link TO this article:
- [url] — [topic relevance]

Pages this article should link TO:
- [url] — [anchor text suggestion]
```

### Section 5: E-E-A-T Specification

```
Author: [from client config authors, or Organization if no individual]
Credentials: [title, bio from config]
Experience signals to include:
- [specific data points, case studies, or examples to reference]
- [industry expertise markers]

External sources to cite:
- [authoritative sources relevant to the topic — industry reports, studies, official docs]

"Last Updated" date: [today's date]
```

### Section 6: Schema Plan

From on-page SEO recommendations + playbook requirements:
```
Required schema types:
- Article/BlogPosting (headline, author, publisher, dates, image)
- FAQPage (wrapping FAQ section)
- BreadcrumbList (from site nav structure)
- Person (author, if individual)
- Organization (publisher — from sitewide_schema)
- HowTo (if step-by-step content exists)
```

### Section 7: AEO + GEO Requirements

```
AEO Requirements:
- First 100 words: direct answer to primary query, extractable as standalone snippet
- Every H2/H3: opens with 40-60 word answer block
- FAQ answers: 40-60 words each, self-contained
- Comparisons in tables, processes in numbered lists
- Headings should match real search phrasing (question format where natural)

GEO Requirements:
- Every section must be modular — makes sense without reading prior sections
- Key claims must include specific, verifiable data with named sources
- Entity names must be precise and consistent throughout
- Content depth must match or exceed what AI currently cites
- Author expertise must be woven into content naturally (not just a bio box)
```

## Output

Write the complete brief as markdown to: `output/{article_slug}/brief.md`
