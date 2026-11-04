# Output Formats

This document describes every file produced by the SEO and AEO pipelines.

---

## SEO Pipeline Outputs

All files written to `output/{article-slug}/`.

### 1. parsed-context.md (Stage 1)

Structured extraction of the input context document into 4 standardized sections:

1. **On-Page SEO Recommendations** — H1, title tag, meta description, URL slug, schema types
2. **Keyword Research** — Keyword table with volume, KD, CPC, intent, type
3. **Article Outline** — Section-by-section breakdown with word count targets and keywords per section
4. **H2 Keyword Map** — Each H2 heading with primary keyword, secondary keywords, SEO notes

Format: Markdown with tables and structured headers.

### 2. brief.md (Stage 2)

Full article brief with optimization specifications. Sections include:

- Target definition (search queries, user intent, SERP features to target)
- Content architecture (outline with per-section word counts, keyword assignments, format requirements)
- Internal linking plan (pillar pages and existing posts to link to)
- E-E-A-T specification (expertise signals, author credentials, source requirements)
- Schema plan (which JSON-LD types to generate)
- AEO formatting requirements (answer blocks, FAQ structure, featured snippet targets)
- GEO readiness requirements (modularity, citation readiness, entity coverage)

Format: Markdown.

### 3. draft-v1.md (Stage 3)

First complete draft of the article. Written following:

- AEO rules: answer-first paragraphs, 40-60 word answer blocks, self-contained sections
- SEO rules: keyword placement in headings and body, internal links woven in
- Voice rules: brand tone applied, AI-tell phrases removed, humanized during writing
- Structure: FAQ section, proper heading hierarchy (H2/H3), data citations

Format: Markdown.

### 4. draft-optimized.md (Stage 4)

Final optimized article with YAML frontmatter. Includes all optimizations from 4 passes:

- Pass 1 (On-Page SEO): title tag, meta description, headings, links, alt text, URL slug
- Pass 2 (AEO Formatting): answer blocks, FAQ answers, structured formats, PAA alignment
- Pass 3 (GEO Readiness): modularity, data + sources, entities, depth, author expertise
- Pass 4 (Schema): validated JSON-LD types identified

YAML frontmatter includes:
```yaml
title: "SEO title tag (under 60 characters)"
meta_description: "Meta description (under 160 characters)"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
author: "Author Name"
schema_types: ["Article", "FAQPage", "BreadcrumbList"]
```

Format: Markdown with YAML frontmatter.

### 5. schema.json (Stage 4)

Complete JSON-LD structured data ready to embed. Contains one or more of:

- `Article` or `BlogPosting` — headline, author, datePublished, image, publisher
- `FAQPage` — question/answer pairs from the FAQ section
- `BreadcrumbList` — site navigation path
- `Person` — author entity with credentials
- `Organization` — publisher entity with logo and social profiles

Format: JSON (single `@graph` array or individual JSON-LD blocks).

### 6. article-publish.html (Stage 4)

CMS-ready HTML snippet for pasting into any content management system.

**Structure:**
- HTML comment metadata block at the top containing title, meta description, slug, date, author
- Semantic HTML article body (`<h1>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<table>`, `<blockquote>`)
- All `<table>` elements wrapped in `<div style="overflow-x:auto">` for responsive scroll on narrow containers
- Internal links as relative URLs
- `<script type="application/ld+json">` block at the bottom with the complete schema

**Does NOT include:**
- No `<!DOCTYPE>` declaration
- No `<html>`, `<head>`, or `<body>` wrapper tags
- No CSS or styling
- No external script tags

This file is designed to be pasted directly into a CMS editor (WordPress, Webflow, Ghost, etc.) that provides its own page wrapper and styling.

### 7. article-preview.html (Stage 4)

Full standalone HTML page for local browser viewing. Open this file directly in a browser to review the article with formatting.

**Required structure:**

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Article Title} — Preview</title>
  <style>
    /* Embedded CSS for typography, layout, meta box, schema block */
  </style>
</head>
<body>
  <div class="meta-preview">
    <!-- Grey box containing: -->
    <p><strong>Title Tag:</strong> {title} <span>({char count} chars)</span></p>
    <p><strong>Meta Description:</strong> {description} <span>({char count} chars)</span></p>
    <p><strong>URL:</strong> {domain}/{slug}</p>
    <p><strong>Author:</strong> {author name}</p>
    <p><strong>Date:</strong> {date}</p>
    <p><strong>Schema Types:</strong> {comma-separated list}</p>
  </div>

  <article>
    <!-- Full styled article content -->
  </article>

  <div class="word-count">
    <p>Word count: {X} words</p>
  </div>

  <div class="schema-preview">
    <h3>Structured Data (JSON-LD)</h3>
    <pre><code>{JSON-LD as visible, formatted text}</code></pre>
  </div>
</body>
</html>
```

**Key requirements:**
- Must be a complete, self-contained HTML page (DOCTYPE, html, head, body)
- `.meta-preview` — grey background box showing SEO metadata with character counts
- Styled article body with readable typography (max-width, line-height, font stack)
- `.word-count` — footer showing total word count
- `.schema-preview` — dark background code block showing JSON-LD as visible, human-readable text (not a hidden script tag)
- All CSS embedded in `<style>` tag (no external stylesheets)

### 8. scorecard.md (Stage 5)

25-point quality scorecard with pass/fail verdict.

Scored across 5 categories:
- Content & Structure (6 points)
- SEO (6 points)
- AEO (4 points)
- GEO (5 points)
- Schema (4 points)

Verdicts:
- **PASS** (23+/25): Ready to publish
- **NEEDS FIXES** (20-22/25): Specific fixes listed
- **NEEDS RE-OPTIMIZATION** (<20/25): Loops back to Stage 4

Format: Markdown with tables and summary.

---

## AEO Pipeline Outputs

All files written to `output/{article-slug}/`.

### 1. brief.md

AEO-specific content brief generated by the brief-generator agent. Focuses on:
- Target AI answer engines (Google AI Overviews, Perplexity, ChatGPT)
- Question clusters to answer
- Answer block specifications (40-60 words, standalone)
- Entity coverage requirements
- Citation and source requirements

Format: Markdown.

### 2. draft-v1.md

First draft from the article-writer agent. Follows AEO-first writing rules:
- Answer-first paragraph structure
- Self-contained sections that can be extracted independently
- FAQ with concise, direct answers
- Entity-rich content with proper noun usage

Format: Markdown.

### 3. draft-v2.md

Revised draft incorporating feedback from the critic agent. Addresses:
- Missing answer blocks
- Sections that are not self-contained
- Weak entity coverage
- Insufficient depth on key questions

Format: Markdown.

### 4. humanizer-report.md

Report from the humanizer agent documenting all changes made to remove AI-tells:
- List of AI phrases found and replaced
- Tone adjustments applied
- Voice injection points (brand-specific language added)
- Before/after examples for significant changes

Format: Markdown.

### 5. critique.md

Detailed critique from the critic agent evaluating the draft against AEO standards:
- Section-by-section analysis
- Missing elements flagged
- Strength and weakness assessment
- Specific revision instructions for the writer

Format: Markdown.

### 6. final.md

Publication-ready article after all agent passes. This is the AEO pipeline's equivalent of `draft-optimized.md` in the SEO pipeline.

Format: Markdown.
