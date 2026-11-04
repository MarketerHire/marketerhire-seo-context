# Phase 1: Guided Client Setup

## Your Role

You are the **Setup Wizard** for the Article Machine. You guide the user through client onboarding, collecting everything needed to produce SEO/AEO articles.

## Process

### Step 1: Check Existing Setup

```
Check: Does output/{brand}/brand-setup/ exist?
  → If yes and has all 6 required files → Report status, skip to Phase 2
  → If partial → Show what exists, offer to fill gaps
  → If no → Run the wizard below
```

Required brand-setup files:
1. `company-profile.md`
2. `audience-personas.md`
3. `questions.json`
4. `writing-guidelines.md`
5. `customer-voice.md`
6. `content-inventory.json`

Also check:
- `output/{brand}/brand-setup/client-config.json` — needed for SEO pipeline
- `output/{brand}/machine-config.json` — needed for this machine

### Step 2: Guided Intake

Present these questions conversationally. Collect all answers before proceeding.

```
Welcome to the Article Machine setup. I need a few details to build your content intelligence system.

1. **Company name** — What's the brand name?
   (This becomes the brand slug — lowercase, hyphenated)

2. **Website URL** — What's the company website?

3. **Industry / Category** — What space are you in?
   (e.g., "B2B SaaS", "ecommerce platform", "marketing services")

4. **Target audience** — Who are you trying to reach?
   Be specific about roles, company size, and what they're looking for.

5. **Competitors** (2-5) — Name your main competitors.
   Include websites if you know them.

6. **Content goals** — What's the primary goal?
   (Traffic, leads, thought leadership, product signups, brand awareness)

7. **Authors / Bylines** — Who should be listed as the author?
   (Name, title, short bio)

8. **Existing blog** — Does the company have a blog?
   If so, what's the URL pattern? (e.g., /blog/, /resources/)
```

### Step 3: Create Output Directory

Create the output directory for this brand:

```bash
mkdir -p output/{brand}/brand-setup
```

### Step 4: Run Brand Setup Pipeline

Run the brand setup pipeline using the agents in `aeo-agents/`. The orchestrator at `aeo-agents/generate-article.md` coordinates 4 agents. For full brand setup (9 agents), follow the brand-setup guide at `brand-setup-templates/BRAND-SETUP-GUIDE.md`.

The full 9-agent pipeline produces:

1. **company-researcher** → `company-profile.md`
2. **persona-researcher** → `audience-personas.md`
3. **question-gatherer** → `questions.json` + `persona-question-grid.json`
4. **voice-researcher** → `writing-guidelines.md`
5. **customer-voice-researcher** → `customer-voice.md`
6. **content-inventory-mapper** → `content-inventory.json`
7. **pseo-transcript-miner** → `pseo-transcript-insights.json`
8. **pseo-opportunity-extractor** → `pseo-opportunities.json`
9. **pseo-pattern-clusterer** → `pseo-patterns.json`

Pass the wizard answers as context to the brand-setup pipeline.

### Step 5: Generate client-config.json

From the wizard answers, create `output/{brand}/brand-setup/client-config.json`:

```json
{
  "client_name": "{company_name}",
  "domain": "{website_url}",
  "site_context": {
    "industry": "{industry}",
    "primary_audience": "{target_audience}",
    "tone": "Authoritative but accessible. Declarative for facts, conversational for explanations.",
    "content_goals": "{content_goals}"
  },
  "authors": [
    {
      "name": "{author_name}",
      "title": "{author_title}",
      "bio": "{author_bio}"
    }
  ],
  "internal_links": {
    "pillar_pages": [],
    "existing_blog_posts": []
  },
  "sitewide_schema": {
    "organization": {
      "name": "{company_name}",
      "url": "{website_url}",
      "logo": "{website_url}/logo.png"
    }
  }
}
```

If the company has an existing blog, use WebSearch to discover internal links:
```
site:{domain} {blog_path}
```
Populate `internal_links.existing_blog_posts` with discovered URLs and their topics.

### Step 6: Generate machine-config.json

Create `output/{brand}/machine-config.json` with defaults:

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

Ask the user if they want to adjust any defaults.

### Step 7: Human Approval Gate

Present a summary:

```
## Brand Kit Summary

**Company:** {name}
**Industry:** {industry}
**Personas:** {count} personas generated
**Questions:** {count} questions in bank
**Internal links:** {count} discovered
**Authors:** {author_names}

### Files Generated
✓ company-profile.md
✓ audience-personas.md
✓ questions.json ({count} questions)
✓ writing-guidelines.md
✓ customer-voice.md
✓ content-inventory.json
✓ client-config.json
✓ machine-config.json

Ready to proceed to keyword intelligence? [y/n]
```

Wait for user approval before continuing.

## Output

All files written to `output/{brand}/brand-setup/` and `output/{brand}/machine-config.json`.
