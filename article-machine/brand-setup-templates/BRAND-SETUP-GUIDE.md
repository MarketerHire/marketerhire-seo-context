# Brand Setup Guide

Before running either pipeline, you need to configure your brand data. This tells the system who you are, who you write for, and how you sound.

## Setup Instructions

1. Copy each `.template.*` file in this directory
2. Rename the copy by removing `.template` (e.g., `client-config.template.json` becomes `client-config.json`)
3. Fill in your data following the inline instructions in each template
4. Delete all placeholder text and instructions before running the pipeline

---

## Required Files

| File | Purpose | Minimum Viable Content |
|------|---------|----------------------|
| `client-config.json` | Core identity: brand name, domain, audience, tone, authors, internal links, schema org data | Brand name, domain, industry, one author, at least 3 internal links |
| `company-profile.md` | Deep company context: what you do, for whom, how, and why you win | Problem + Solution + Key Differentiators sections filled out |
| `audience-personas.md` | Detailed buyer personas the content targets | At least 1 persona with role, pain points, motivations, and trust builders |
| `questions.json` | Target questions/keywords the pipeline writes articles for | At least 1 question entry with topic, search volume, funnel stage |
| `writing-guidelines.md` | Brand voice rules, tone, forbidden words, style preferences | Voice description + 5 forbidden words/phrases + 3 style rules |
| `customer-voice.md` | Real customer quotes organized by theme | At least 5 quotes with attribution, categorized into 2+ themes |

## Optional Files

| File | Purpose | When to Include |
|------|---------|----------------|
| `content-inventory.json` | Existing content catalog with URLs, topics, freshness status | When you have existing blog content and want the pipeline to avoid duplication and link to it |

---

## File Details

### client-config.json

The system's primary config file. Every pipeline stage reads this.

**What goes in it:**
- `client_name` — Your brand name as it appears publicly
- `domain` — Your website URL (with https://)
- `site_context` — Industry, primary audience description, tone summary, content goals
- `authors` — Array of author objects (name, title, bio) used in schema markup and bylines
- `internal_links.pillar_pages` — Your main landing/service pages for internal linking
- `internal_links.existing_blog_posts` — Published articles the pipeline can link to
- `sitewide_schema.organization` — Org name, URL, logo URL, social profile URLs for JSON-LD

### company-profile.md

Deep context about your company that informs article tone, claims, proof points, and competitive positioning.

**Sections to fill:**
- The Problem — What pain does your market face?
- What You Do — Your solution, how it works
- Who This Is For — Ideal customers and who is not a fit
- How It Works — Step-by-step process
- Why You (Differentiators) — What makes you different, with competitor comparisons if available
- Results — Case studies, metrics, social proof
- Key Facts — Founded, HQ, funding, team size, notable clients

### audience-personas.md

Detailed buyer personas. The pipeline uses these to match tone, examples, and pain points to the target reader.

**Per persona, include:**
- Name and archetype label
- Role/Title and company context
- Daily Reality — What their workday looks like
- Core Fears — What keeps them up at night
- Deep Motivations — What they actually want to achieve
- Trust Builders — What makes them believe in a solution
- Trust Killers — What makes them walk away
- Critical Pain Points — Specific, quantified problems

### questions.json

The question bank that drives article topics. Each entry maps a search query to metadata the pipeline uses for targeting and prioritization.

**Per question:**
- `id` — Unique identifier (e.g., "Q001")
- `question` — The actual search query or question
- `topic` — Short topic label
- `search_volume` — Monthly search volume
- `funnel_stage` — awareness / consideration / decision
- `source` — Where the question came from (keyword research, PAA, customer interviews)
- `persona_ids` — Which personas this question maps to
- `priority` — high / medium / low

### writing-guidelines.md

The voice and style rulebook. Every draft and optimization pass references this.

**Sections to fill:**
- Brand Voice — Describe your voice across 3-5 dimensions (formality, expertise, confidence, warmth, pacing)
- Tone by Content Type — How voice shifts for blog posts vs. landing pages vs. email
- Sentence and Paragraph Style — Target sentence length, paragraph length, reading level
- Forbidden Words/Phrases — Words that clash with your brand (jargon, AI-tells, tone-breakers)
- Style Markers — What makes your voice distinctive
- Good/Bad Examples — At least 2 before/after pairs showing your voice in action

### customer-voice.md

Real quotes from customers, organized by theme. The pipeline uses these to inject authentic proof and match the language your buyers actually use.

**Organization:**
- Group quotes by category: Pain Points, Solution Experience, Results, Objections, Emotional
- Per quote: the quote text, source/attribution, which persona it maps to, whether it is headline-ready
- Include both positive and negative quotes (negative ones are used for objection handling)

### content-inventory.json (optional)

Catalog of existing published content. Helps the pipeline avoid topic duplication and create internal links to your existing articles.

**Per entry:**
- `title` — Article title
- `url` — Full URL
- `estimated_date` — Publish or last-update date
- `topic_mapping` — Short topic label matching your questions.json topics
- `question_ids` — Which questions this article addresses
- `freshness` — current / aging / stale
- `content_type` — guide / comparison / listicle / case-study / etc.
