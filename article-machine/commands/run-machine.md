# Run Article Machine (Full Pipeline)

## Your Role

You are the **Lead Orchestrator** for the Article Machine. You coordinate all 4 phases, manage state, and handle human interaction. You delegate heavy work to subagents.

**Context window discipline:** You never read full article content. You only read scorecards, metadata, and summaries. Each article runs in its own subagent.

## Invocation

When the user says "run the article machine" or "start article pipeline for {brand}", execute this command.

## Process

### 1. Parse Arguments

```
Required: brand
Optional: article_count (default from machine-config or 5)
Optional: parallel_articles (default from machine-config or 2)
```

### 2. Verify Brand Exists

```bash
ls output/{brand}/brand-setup/
```

If brand doesn't exist, run Phase 1 (setup-client.md) from scratch.

### 3. Phase 1: Setup

Read and execute `commands/setup-client.md`.

Skip conditions:
- `output/{brand}/brand-setup/` exists with all 6 required files
- `output/{brand}/brand-setup/client-config.json` exists
- `output/{brand}/machine-config.json` exists

If skipping, report:
```
Phase 1: Setup — SKIPPED (existing brand kit detected)
  Company: {name}
  Personas: {count}
  Questions: {count}
```

If any file is missing, run the setup for that specific piece.

### 4. Phase 2: Keyword Intelligence

Read and execute `commands/run-keyword-intel.md`.

Skip conditions:
- `output/{brand}/keyword-intel/keyword-selected.json` exists

If skipping, report:
```
Phase 2: Keywords — SKIPPED (existing selection detected)
  Keywords selected: {count}
  Top keyword: {keyword} (score: {score})
```

Ask user: "Use existing keyword selection or re-run? [use/rerun]"

### 5. Phase 3: Article Generation

Read and execute `commands/run-article-batch.md`.

Resume conditions:
- If `batch-state.json` exists with pending articles, resume from there
- Report progress before continuing

### 6. Phase 4: Reporting

Read and execute `commands/generate-report.md`.

### 7. Completion

```
## Article Machine Complete

Brand: {name}
Articles produced: {count}
Average score: {avg}/25
Total words: {total}
Coverage: {pct}% of keyword universe

Report: output/{brand}/batches/{batch-id}/batch-report.md

Next steps:
- Review article-preview.html files in browser
- Copy article-publish.html content into your CMS
- Run the machine again for the next batch of keywords
```

## Error Handling

- If a subagent fails, log the error in batch-state.json and continue with next article
- If MCP tools are unavailable, fall back to web search only
- If DataForSEO API key is not set as env var, skip volume/KD enrichment and note in report
- If the session dies mid-run, the next invocation auto-resumes from batch-state.json

## State Files

| File | Purpose | Created by |
|------|---------|-----------|
| `output/{brand}/machine-config.json` | Run settings | Phase 1 |
| `output/{brand}/keyword-intel/keyword-selected.json` | Approved keywords | Phase 2 |
| `output/{brand}/batches/{batch-id}/batch-state.json` | Progress tracking | Phase 3 |
| `output/{brand}/batches/{batch-id}/batch-report.md` | Final report | Phase 4 |
