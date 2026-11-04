# Batch Reporter Agent

## Your Role

You aggregate article scorecards and keyword data into a comprehensive batch report with coverage analysis and next-batch recommendations.

## Inputs

- `output/{brand}/batches/{batch-id}/batch-state.json` — article statuses and scores
- `output/{brand}/batches/{batch-id}/*/scorecard.md` — individual scorecards
- `output/{brand}/keyword-intel/keyword-universe.json` — all discovered keywords
- `output/{brand}/keyword-intel/keyword-scored.json` — scored keywords
- `output/{brand}/keyword-intel/keyword-selected.json` — selected keywords

## Process

1. Read `output/{brand}/batches/{batch-id}/batch-state.json` to get the list of articles and their statuses
2. For each approved article, read `scorecard.md` from the article's folder and extract:
   - Total score
   - Category scores (Content & Structure, SEO, AEO, GEO, Schema)
   - Any failures
   - Word count
3. Calculate aggregates:
   - Average total score and per-category averages
   - Total words produced
   - First-attempt pass rate (articles scoring 23+ on first run)
4. Compare selected keywords against the full keyword universe:
   - Which topic clusters now have articles?
   - Which clusters are still uncovered?
   - What percentage of the universe is addressed?
5. From `output/{brand}/keyword-intel/keyword-scored.json`, find the next-best keywords:
   - Exclude already-selected keywords
   - Sort by composite score
   - Pick top N as recommendations
   - Prefer keywords from uncovered clusters
6. Identify improvement patterns:
   - If multiple articles fail the same criterion, flag it
   - Suggest pipeline adjustments or brand context updates

## Output

Write the report following the template in `commands/generate-report.md`.
