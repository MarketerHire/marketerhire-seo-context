# Phase 4: Aggregate Reporting

## Your Role

You are the **Batch Reporter**. You synthesize all article scorecards and keyword data into an aggregate report with coverage analysis and next-batch recommendations.

## Inputs

- `output/{brand}/batches/{batch-id}/batch-state.json` — batch state with statuses
- `output/{brand}/batches/{batch-id}/*/scorecard.md` — individual scorecards
- `output/{brand}/keyword-intel/keyword-universe.json` — full keyword list
- `output/{brand}/keyword-intel/keyword-scored.json` — scored keywords
- `output/{brand}/keyword-intel/keyword-selected.json` — selected keywords

## Process

### Step 1: Collect Data

Read all scorecards for approved articles. Extract:
- Article title, slug, score
- Category scores (Content & Structure, SEO, AEO, GEO, Schema)
- Word count
- Any failures or fixes applied

### Step 2: Aggregate Metrics

Calculate:
- Average total score
- Average score per category
- Total word count produced
- Articles per content type
- Pass rate (first attempt vs. after fixes)

### Step 3: Coverage Analysis

Compare approved article topics against the full `keyword-universe.json`:
- Which topic clusters are now covered?
- Which clusters have no articles yet?
- What percentage of the keyword universe is addressed?

### Step 4: Next-Batch Recommendations

From `keyword-scored.json`, identify the next best keywords:
- Exclude keywords already selected/written
- Apply the same scoring formula
- Recommend top N for the next run
- Note any clusters that need prioritization

### Step 5: Write Report

Write `output/{brand}/batches/{batch-id}/batch-report.md`:

```markdown
# Article Machine Report: {client_name}

**Batch ID:** {batch-id}
**Date:** {date}
**Articles produced:** {approved_count}/{total_count}

---

## Score Summary

| Metric | Value |
|--------|-------|
| Average score | {avg}/25 |
| Content & Structure avg | {avg}/6 |
| SEO avg | {avg}/6 |
| AEO avg | {avg}/4 |
| GEO avg | {avg}/5 |
| Schema avg | {avg}/4 |
| First-attempt pass rate | {pct}% |
| Total words produced | {total} |

## Articles Produced

| # | Title | Keyword | Score | Words | Status |
|---|-------|---------|-------|-------|--------|
| 1 | ... | ... | 24/25 | 2,450 | Approved |
| ... |

## Topic Coverage

| Cluster | Keywords | Articles Written | Coverage |
|---------|----------|-----------------|----------|
| ... | 12 | 2 | 17% |
| ... | 8 | 0 | 0% |

**Overall coverage:** {pct}% of keyword universe addressed

## Areas for Improvement

[Based on common scorecard failures across articles]
- If multiple articles fail on the same criteria, flag the pattern
- Suggest adjustments to the pipeline or brand context

## Next Batch Recommendations

| # | Keyword | Score | Volume | KD | Cluster | Rationale |
|---|---------|-------|--------|-----|---------|-----------|
| 1 | ... | 78 | 8,100 | 32 | ... | Uncovered cluster, low difficulty |
| ... |

## Run Again

To produce the next batch:
1. Review and approve the keywords above
2. Run the Article Machine again with the same brand slug
3. It will auto-detect existing work and skip to article generation
```

## Output

`output/{brand}/batches/{batch-id}/batch-report.md`
