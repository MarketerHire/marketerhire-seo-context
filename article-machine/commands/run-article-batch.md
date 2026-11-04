# Phase 3: Article Generation Loop

## Your Role

You are the **Batch Orchestrator**. You manage the article generation loop, spawning one subagent per article, monitoring progress, and presenting results for approval.

**Critical rule:** You NEVER read full article content. You only read scorecards and metadata. This keeps your context window lean.

## Inputs

- `output/{brand}/keyword-intel/keyword-selected.json` — approved keywords with research data
- `output/{brand}/brand-setup/` — brand context files
- `output/{brand}/brand-setup/client-config.json` — SEO pipeline config
- `output/{brand}/machine-config.json` — parallelism and threshold settings

## Process

### Step 0: Pre-Batch Cannibalization Gate

Before initializing a batch, scan `keyword-selected.json` for cannibalization risks:

1. Read each selected keyword's `cannibalization_risk` and `pipeline_mode` fields
2. If a keyword has `pipeline_mode: "refresh"`:
   - **SKIP GATE** — user already decided to refresh existing content. Include in batch.
3. If ANY keyword has `cannibalization_risk: "critical"` AND `pipeline_mode` is NOT `"refresh"`:
   - **BLOCK** — do not proceed. Report the blocked keywords and suggest replacements from the scored list.
4. If any keyword has `cannibalization_risk: "high"` AND `pipeline_mode` is NOT set:
   - **WARN** — show a table of flagged keywords with their existing URLs and notes
   - Ask user to confirm: "These keywords have existing content that may be cannibalized. Proceed anyway, remove them, or replace with next-best alternatives?"
5. If any keyword has `cannibalization_risk: "medium"`:
   - **NOTE** — show in the pre-flight summary, but don't block

Only proceed to Step 1 after the cannibalization gate passes.

### Step 1: Initialize or Resume

```
Check: Does output/{brand}/batches/{batch-id}/batch-state.json exist?
  → If yes → Load it, report status, continue from last pending keyword
  → If no → Create initial batch-state.json
```

The batch-id format is `batch-{N}-{YYYY-MM-DD}` (e.g., `batch-001-2026-04-09`). Increment N for each new batch run for this brand.

Initial `batch-state.json`:
```json
{
  "batch_id": "batch-001-2026-04-09",
  "brand": "{brand}",
  "total_articles": {N},
  "parallel_articles": {from config},
  "started": "{timestamp}",
  "articles": [
    {
      "keyword": "content marketing strategy",
      "slug": "content-marketing-strategy",
      "status": "pending",
      "pipeline_mode": "new",
      "existing_article_url": null,
      "score": null,
      "started_at": null,
      "completed_at": null,
      "output_path": "output/{brand}/batches/{batch-id}/content-marketing-strategy/"
    }
  ]
}
```

Status values: `pending` → `in_progress` → `complete` → `approved` (or `rejected` / `fix_requested`)

### Step 2: Process Loop

```
while any article has status "pending":
    1. Select up to {parallel_articles} pending keywords
    2. Update their status to "in_progress" in batch-state.json
    3. For each, spawn a subagent (see Subagent Prompt below)
    4. Wait for subagent(s) to complete
    5. For each completed article:
       a. Read ONLY the scorecard: output/{brand}/batches/{batch-id}/{article-slug}/scorecard.md
       b. Update batch-state.json: status="complete", score={score}
       c. Present scorecard to user (see Approval Gate below)
       d. On approval: update status to "approved"
       e. On fix request: re-spawn subagent targeting optimization only
       f. On rejection: update status to "rejected"
    6. Write updated batch-state.json
```

### Step 3: Subagent Prompt

Each article subagent receives this prompt:

```
You are running the SEO Article Pipeline for brand "{brand}".

## Target Keyword
Keyword: {keyword}
Article slug: {article-slug}
Content type: {content_type}
Estimated word count: {estimated_word_count}

## Brand Context
Read these files from disk for brand context:
- output/{brand}/brand-setup/company-profile.md
- output/{brand}/brand-setup/audience-personas.md
- output/{brand}/brand-setup/writing-guidelines.md
- output/{brand}/brand-setup/customer-voice.md
- output/{brand}/brand-setup/client-config.json

## Keyword Research Data
{embedded keyword research JSON — SERP data, competitor analysis, PAA questions, volume/KD/CPC, content gaps}

## Pipeline Mode
Mode: {pipeline_mode}

{If pipeline_mode is "refresh", include this block — otherwise omit entirely:}

## Refresh Mode
THIS IS A CONTENT REFRESH, NOT A NEW ARTICLE.

Existing article URL: {existing_article_url}

Before Stage 1, fetch the existing article at the URL above using WebFetch.
Save the fetched content as: output/{brand}/batches/{batch-id}/{article-slug}/existing-article.md

All pipeline stages will operate in REFRESH MODE:
- Stage 2 (Brief): Design a refresh strategy (keep/rewrite/add/remove sections)
- Stage 3 (Draft): Reuse strong existing sections, rewrite weak ones
- Stage 4 (Optimize): Update dateModified, preserve the existing URL slug and datePublished
- Stage 5 (Scorecard): Use adjusted thresholds (21+ = PASS for refresh articles)

{End of conditional refresh block}

## Instructions

Step 1: Read the context-compiler agent instructions at:
  agents/context-compiler.md
Generate a filled context-template.md from the keyword research data above.
Write to: output/{brand}/batches/{batch-id}/{article-slug}/parsed-context.md

Step 2: Read and execute the SEO Article Pipeline stages 2-5:
  - pipeline/02-brief.md
  - pipeline/03-draft.md
  - pipeline/04-optimize.md
  - pipeline/05-scorecard.md

Run all stages sequentially WITHOUT pausing for human review (the lead orchestrator handles approval).

Write all outputs to: output/{brand}/batches/{batch-id}/{article-slug}/
  - brief.md
  - draft-v1.md
  - draft-optimized.md
  - schema.json
  - article-publish.html
  - article-preview.html
  - {article-slug}_feature_image.jpg
  - scorecard.md

IMPORTANT:
- article-preview.html MUST be a full standalone HTML page with <!DOCTYPE html>, <html>, <head> with CSS, <body> containing .meta-preview box, styled article, .word-count footer, and .schema-preview dark code block
- article-publish.html is a bare <article> snippet with HTML comment metadata at top and <script type="application/ld+json"> at bottom — NO DOCTYPE, NO html/head/body wrapper
- Follow the AI-tell removal rules strictly — zero AI-ism words or phrases
- All internal links must be verified against client-config.json
```

### Step 4: Approval Gate

After each article completes, read the scorecard and present:

**For PASS (23+/25):**
```
## Article Complete: "{title}"

Score: {score}/25 — PASS ✓
Word count: {words}
Keywords: {primary keyword} + {secondary count} secondary
Internal links: {count}
Schema types: {types}

Preview: output/{brand}/batches/{batch-id}/{article-slug}/article-preview.html

Approve this article? [y/n/view]
```

**For NEEDS FIXES (20-22/25):**
```
## Article Complete: "{title}"

Score: {score}/25 — NEEDS FIXES

Issues:
{list of failed criteria from scorecard}

Options:
- **fix** — re-run optimization pass targeting failures
- **approve** — accept as-is
- **reject** — discard and skip
```

**For NEEDS RE-OPTIMIZATION (<20/25):**
```
## Article Complete: "{title}"

Score: {score}/25 — NEEDS RE-OPTIMIZATION

Recommend re-running full Stage 4 optimization.
Re-run? [y/n]
```

### Step 5: Fix Loop

If user requests fixes:
1. Read the scorecard to identify failures
2. Spawn a subagent that:
   - Reads the existing `draft-v1.md` and `brief.md`
   - Runs ONLY Stage 4 (optimize) targeting the specific failures
   - Re-runs Stage 5 (scorecard)
   - Writes updated outputs
3. Present new scorecard for approval

Max fix loops per article: 2 (after that, present as-is).

### Step 6: Batch Completion

When all articles are processed:
1. Write final `batch-state.json`
2. Report summary:
   ```
   ## Batch Complete

   Total: {N} articles
   Approved: {count}
   Rejected: {count}
   Fix requested: {count}

   Average score: {avg}/25

   Proceeding to Phase 4: Reporting...
   ```
3. Trigger Phase 4

## Output

- Article files: `output/{brand}/batches/{batch-id}/{article-slug}/` (7 files each)
- Batch state: `output/{brand}/batches/{batch-id}/batch-state.json`
