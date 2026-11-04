# Stage 4: Optimize (4 Passes)

## Purpose
Run four optimization passes on the draft, then generate YAML frontmatter, JSON-LD schema, publishable HTML, and a local preview. Produces all final outputs.

## Inputs
- `draft-v1.md` from Stage 3 (or revised draft from user feedback)
- `brief.md` from Stage 2
- `brand-setup/client-config.json`

## Run all four passes as a single operation. Return the complete optimized article + all output formats.

---

### Pass 1: On-Page SEO

**Title tag:**
- Include primary keyword (front-loaded if possible)
- Add a hook or differentiator
- Under 60 characters
- Format: `[Primary Keyword]: [Benefit/Hook]` or `[Primary Keyword] — [Context] ([Year])`

**Meta description:**
- Include primary keyword
- Format: `[Direct answer]. [Proof/credibility]. [CTA or hook].`
- 150-155 characters (hard max 160)

**Heading hierarchy:**
- Verify: exactly one H1, all H2s under it, H3s under H2s, no skipped levels
- Verify: primary keyword in H1
- Verify: secondary keywords appear naturally in H2s

**Internal links:**
- Verify all links from the brief's linking plan are placed
- Verify anchor text is descriptive and natural (not "click here")
- Suggest any additional link opportunities discovered in the content
- Target: 4-8 internal links per article
- **CRITICAL — Link verification:** Every internal link MUST be verified against the client's `client-config.json` internal_links inventory (pillar_pages + existing_blog_posts). Do NOT guess or fabricate URLs. If a URL is not in the client config, run a web search (`site:{domain} [topic]`) to find the real URL before including it. Broken internal links damage SEO and user trust.

**Alt text:**
- Write descriptive alt text for any suggested/referenced images
- Include relevant keywords where natural

**URL slug:**
- Clean, keyword-informed
- Lowercase, hyphens, no stop words
- Match the slug from on-page SEO recommendations if provided

---

### Pass 2: AEO Formatting

**First 100 words:**
- Must be an extractable standalone answer to the primary query
- If not, rewrite to be self-contained and directly answering
- Should work as a featured snippet or AI Overview response

**H2/H3 answer blocks:**
- Every H2/H3 must open with a 40-60 word answer block
- The block must directly answer what the heading promises
- Must be self-contained (no references to other sections)
- Write missing answer blocks, tighten those that are too long

**FAQ section:**
- Each answer: 40-60 words, completely self-contained
- Fix any that exceed 60 words or reference other sections
- Ensure questions match real search phrasing

**Structured formats:**
- Comparisons → tables (not paragraphs)
- Processes/steps → numbered lists
- Features/options → bullet lists
- Convert any paragraphs that should be structured

**PAA alignment:**
- Cross-check headings against PAA phrasing from the brief
- Adjust heading wording to match natural question phrasing where possible

---

### Pass 3: GEO Readiness

**Section modularity:**
- Each section must make sense without reading prior sections
- Flag any that say "as mentioned above," "as we discussed," or depend on prior context
- Rewrite flagged sections to be self-contained

**Data verification:**
- Key claims must have specific, verifiable data with named sources
- Flag any claims that say "studies show," "research indicates," or "experts say" without a named source
- Add source names where possible, or flag for user to provide

**Entity consistency:**
- Entity names (brand names, product names, technical terms) must be precise and consistent
- No switching between "AI Overviews" and "AI overview" and "Google's AI answers"
- Pick one canonical form per entity and use it throughout

**Depth check:**
- Compare section depth against what the brief specifies
- Flag any sections that are significantly shorter than their target word count
- Ensure content matches or exceeds what AI-cited competitors cover (per brief)

**Author expertise:**
- Verify author/brand expertise is woven into content naturally
- Not just a bio box — references to experience, credentials, data from their work
- At least 2-3 natural authority signals throughout the article

---

### Pass 4: Schema Markup

Generate complete JSON-LD for:

**Article/BlogPosting:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[from title tag]",
  "author": {
    "@type": "[Person or Organization]",
    "name": "[from client config]",
    "url": "[from client config]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[from sitewide_schema]",
    "logo": { "@type": "ImageObject", "url": "[from sitewide_schema]" }
  },
  "datePublished": "[today, or preserve original datePublished if refresh mode]",
  "dateModified": "[today]",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "[domain + slug]" },
  "image": "[placeholder — user provides]"
}
```

**FAQPage:**
Wrap all FAQ Q&A pairs in FAQPage schema with `mainEntity` array of `Question` + `acceptedAnswer`.

**BreadcrumbList:**
Build from client config `internal_links.pillar_pages` + article position.

**Person** (if individual author):
Reference from client config authors array.

**Organization:**
Reference from sitewide_schema.

**HowTo** (conditional):
Only if the article contains step-by-step instructional content.

**Refresh Mode adjustments:**
- Set `dateModified` to today's date
- Preserve the original `datePublished` from the existing article (if available from `existing-article.md`)
- Keep the same URL slug as the existing article (do NOT generate a new slug)
- In `article-publish.html`, add an HTML comment at the top: `<!-- REFRESH: Updated from {existing_url} on {date} -->`

---

## Pass 5: Feature Image Generation

Generate a branded feature image for the article using the Gemini image generation API.

**API:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`

**Prompt template:**

```
Generate an image.

Flat vector illustration, modern SaaS editorial style. 1920x1080 landscape.

Background: solid hot pink (#FF52E5).

Subject: {concept — a single, clear visual metaphor for the article topic. One main subject, maximum 2 supporting elements.}

Color palette: deep purple (#440177), bright yellow (#FCDE3D), mint green (#6BFFDC) for all subjects and elements. Thick deep purple outlines on all shapes.

No gradients, no shadows, no text, no photorealism.

Minimal elements. Clean, bold, uncluttered.
```

**How to write the concept:**
- Read the article title and H1
- Identify the core metaphor (e.g., "hiring" = magnifying glass + people, "cost" = cracked dollar sign, "comparison" = podium)
- Describe ONE main subject with at most 1-2 secondary elements
- Keep the description concrete and visual — shapes, objects, spatial relationships
- Never describe abstract concepts — translate them into physical objects

**API call:**
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "{prompt}"}]}],
    "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
  }'
```

Load `GEMINI_API_KEY` from environment (same `.env` as other keys).

**Response handling:**
- Extract base64 image from `candidates[0].content.parts[].inlineData.data`
- Save as `{article-slug}_feature_image.jpg` in the article output directory
- Compress with ImageMagick: `convert {article-slug}_feature_image.jpg -strip -quality 82 -sampling-factor 4:2:0 {article-slug}_feature_image.jpg`
- Target: under 500KB (Webflow limit is 4MB, but smaller is better for page speed)

**Client-agnostic notes:**
- The prompt template uses MarketerHire's brand colors as default. For other clients, the colors should come from `client-config.json` (add `feature_image_style` field with background, palette, and style instructions).
- If `client-config.json` has a `feature_image_style` field, use those colors/style instead of the defaults above.

**Output:** `{article-slug}_feature_image.jpg` — saved alongside other article files.

---

## Output Formats

### 1. Optimized Article: `draft-optimized.md`

The working markdown file with YAML frontmatter:

```yaml
---
title: "[title tag]"
meta_description: "[meta description]"
url_slug: "[clean slug]"
author: "[author name]"
date_published: "YYYY-MM-DD"
date_modified: "YYYY-MM-DD"
schema_types:
  - Article
  - FAQPage
  - BreadcrumbList
---

# [H1]

[Full optimized article content]
```

### 2. Schema: `schema.json`

Complete JSON-LD array with all schema types in a single `<script>` block format.

---

### 3. Publishable Article: `article-publish.html`

Clean HTML body content ready to paste into any CMS (WordPress, Webflow, Ghost, headless, etc.).

**Structure:**
```html
<!--
  SEO METADATA (copy into your CMS fields)
  ==========================================
  Title Tag: [title]
  Meta Description: [meta description]
  URL Slug: [slug]
  Author: [author]
  Published: [date]
  Modified: [date]
  Schema Types: Article, FAQPage, BreadcrumbList
-->

<!-- ARTICLE BODY — paste into CMS editor -->
<article>
  <h1>[H1]</h1>

  [Full article as semantic HTML]
  - <h2>, <h3> for headings
  - <p> for paragraphs
  - <ul>/<ol> for lists
  - <div style="overflow-x:auto"><table>...</table></div> for comparison tables
  - <blockquote> for pull quotes
  - <a href="..."> for internal/external links
  - <img src="..." alt="..."> for images (src as placeholder)
  - <strong>/<em> for emphasis

  <section class="faq">
    <h2>[FAQ heading]</h2>
    <h3>[Question]</h3>
    <p>[Answer]</p>
    ...
  </section>
</article>

<!-- SCHEMA — paste into <head> or CMS schema field -->
<script type="application/ld+json">
[complete JSON-LD from schema.json]
</script>
```

**Rules:**
- No `<html>`, `<head>`, or `<body>` wrapper — just the content block + schema block
- No inline styles or classes (CMS will apply its own) — **exception:** table scroll wrappers use `<div style="overflow-x:auto">`
- Semantic HTML only — no divs for layout **except** table scroll wrappers
- All internal links use absolute URLs (domain from client config)
- Image `src` attributes use placeholder `[IMAGE: description]` — user replaces
- FAQ section wrapped in `<section class="faq">` for easy CMS targeting
- Schema JSON-LD in a separate `<script>` block at the end

---

### 4. HTML Preview: `article-preview.html`

Self-contained HTML document for viewing the article locally in a browser.

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Article Title] — Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      line-height: 1.7; color: #1a1a1a; background: #fff;
      max-width: 740px; margin: 0 auto; padding: 2rem 1.5rem;
    }
    h1 { font-size: 2rem; line-height: 1.2; margin-bottom: 1rem; }
    h2 { font-size: 1.5rem; margin-top: 2.5rem; margin-bottom: 0.75rem;
         padding-top: 1.5rem; border-top: 1px solid #e5e5e5; }
    h3 { font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.4rem; }
    div[style*="overflow-x"] { margin: 1.5rem 0; -webkit-overflow-scrolling: touch; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; min-width: 480px; }
    th, td { padding: 0.6rem 0.8rem; border: 1px solid #ddd; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    blockquote { border-left: 3px solid #333; padding-left: 1rem; margin: 1.5rem 0; color: #555; }
    a { color: #2563eb; }
    img { max-width: 100%; height: auto; margin: 1rem 0; }
    .meta-preview {
      background: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 8px;
      padding: 1.5rem; margin-bottom: 2rem; font-size: 0.9rem;
    }
    .meta-preview h2 { font-size: 1.1rem; margin: 0 0 1rem; padding: 0; border: none; color: #666; }
    .meta-preview dt { font-weight: 600; color: #333; }
    .meta-preview dd { margin-bottom: 0.5rem; margin-left: 0; color: #555; }
    .schema-preview {
      background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 8px;
      margin-top: 3rem; font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.85rem; overflow-x: auto; white-space: pre-wrap;
    }
    .schema-preview h2 { color: #888; font-size: 1rem; margin: 0 0 1rem; padding: 0; border: none; }
    .faq { margin-top: 2rem; }
    .word-count {
      text-align: center; color: #999; font-size: 0.85rem; margin-top: 2rem;
      padding-top: 1rem; border-top: 1px solid #e5e5e5;
    }
  </style>
</head>
<body>
  <!-- META PREVIEW PANEL -->
  <div class="meta-preview">
    <h2>SEO Metadata</h2>
    <dl>
      <dt>Title Tag</dt><dd>[title] ([char count] chars)</dd>
      <dt>Meta Description</dt><dd>[meta description] ([char count] chars)</dd>
      <dt>URL</dt><dd>[domain][slug]</dd>
      <dt>Author</dt><dd>[author]</dd>
      <dt>Published</dt><dd>[date]</dd>
      <dt>Schema Types</dt><dd>[list]</dd>
    </dl>
  </div>

  <!-- ARTICLE -->
  <article>
    [Full article as HTML — same content as article-publish.html]
  </article>

  <div class="word-count">Word count: [X] words</div>

  <!-- SCHEMA PREVIEW -->
  <div class="schema-preview">
    <h2>JSON-LD Schema</h2>
    [Pretty-printed JSON-LD]
  </div>
</body>
</html>
```

**Rules:**
- Fully self-contained — no external CSS/JS dependencies
- Opens in any browser by double-clicking the file
- Meta preview panel at top: title tag (with char count), meta description (with char count), URL, author, dates
- Article body is the full styled content
- Word count shown after article
- Schema JSON-LD at bottom in a dark code block for review

---

## Output Paths
- `output/{article_slug}/draft-optimized.md` — working markdown
- `output/{article_slug}/schema.json` — standalone schema
- `output/{article_slug}/article-publish.html` — CMS-ready HTML
- `output/{article_slug}/article-preview.html` — local browser preview
