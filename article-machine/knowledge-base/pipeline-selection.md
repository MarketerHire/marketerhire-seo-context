# Pipeline Selection Guide

## Two Pipelines

The Article Machine can use either of two content pipelines:

### SEO Pipeline (default)

**Location:** `pipeline/`

**Best for:** Keyword-driven content where you have specific keyword targets with volume/difficulty data.

**Process:** 5 stages (Parse Context → Brief → Draft → 4-Pass Optimize → 25-Point Scorecard)

**Outputs:** 7 files — parsed-context.md, brief.md, draft-v1.md, draft-optimized.md, schema.json, article-publish.html, article-preview.html, scorecard.md

**Strengths:**
- Comprehensive optimization (SEO + AEO + GEO + Schema in 4 passes)
- Produces HTML outputs ready for CMS paste
- 25-point quality gate catches issues before publishing
- Full JSON-LD schema generation

**When to use:**
- You have keyword research data (volume, KD, intent)
- The article needs to rank for specific search terms
- You need CMS-ready HTML output
- SEO performance is the primary goal

### AEO Pipeline

**Location:** `aeo-agents/`

**Best for:** Question-driven content built from the question bank (questions.json).

**Process:** 4 agents (Brief Generator → Article Writer → Humanizer → Critic)

**Outputs:** 6 files — brief.md, draft-v1.md, draft-v2.md (humanized), humanizer-report.md, critique.md, final.md

**Strengths:**
- Question-first approach (great for AI answer engine visibility)
- Built-in humanization pass
- Critic provides detailed editorial feedback
- Designed for the HubSpot AEO Playbook methodology

**When to use:**
- The content answers a specific question from questions.json
- AI answer engine visibility is the primary goal
- The content is more editorial/thought-leadership
- You don't need CMS-ready HTML (will post-process separately)

## Auto Selection

When `machine-config.json → pipeline` is set to "auto", the Article Machine selects based on:

| Condition | Pipeline |
|-----------|----------|
| Keyword has volume/KD data from DataForSEO | SEO |
| Keyword matches a question in questions.json exactly | AEO |
| Keyword has commercial or transactional intent | SEO |
| Keyword is purely informational with no clear search target | AEO |
| Content type is "pillar-guide" or "comparison" | SEO |
| Content type is "definition" or "case-study" | AEO |
| Default (ambiguous) | SEO |

## Hybrid Approach

For best results, many articles benefit from elements of both:
- Use SEO pipeline for the main content (gets HTML + schema + scorecard)
- Apply AEO humanization rules during the draft stage (already built into SEO pipeline Stage 3)
- The SEO pipeline's Stage 3 already incorporates AEO Page Rules

The Article Machine defaults to the SEO pipeline because it produces more complete outputs and already includes AEO optimization in its drafting and optimization passes.
