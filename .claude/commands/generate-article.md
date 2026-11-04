---
name: generate-article
description: Run the full SEO article generation pipeline — semantic analysis, research, outline, draft, humanize, optimize, review
arguments:
  - name: keyword
    description: Target keyword or article title
    required: true
  - name: type
    description: "Content type: pillar (5-8K), how-to (2-3K), comparison (2.5-4K), listicle (2-3K)"
    required: false
    default: pillar
---

You are running the SEO Article Generator pipeline. This is a 5-phase, 12-artifact process.

**Input:** keyword = `$ARGUMENTS.keyword`, content type = `$ARGUMENTS.type`

## Setup

1. Create the slug from the keyword (lowercase, hyphens, no special chars)
2. Create `outputs/{slug}/` directory
3. Save run config to `outputs/{slug}/00-config.json`:
```json
{
  "keyword": "$ARGUMENTS.keyword",
  "content_type": "$ARGUMENTS.type",
  "started": "{ISO timestamp}",
  "status": "running"
}
```

## Phase 1: Semantic Analysis

Read `agents/seo-semantic-analyzer.md` for full instructions. Execute:

1. **6 Circles keyword expansion** — generate 50-100 expanded keywords across 6 lenses
2. **SERP analysis** — call `mcp_infranodus_analyze_google_search_results` with the keyword
3. **Knowledge graph** — call `mcp_infranodus_generate_knowledge_graph` with SERP corpus
4. **Topical clusters** — call `mcp_infranodus_generate_topical_clusters`
5. **Graph metrics** — run `python3 seo/lib/graph_metrics.py` for PageRank, centrality, communities
6. **Gap analysis** — identify what competitors miss

Save: `01-serp-analysis.json`, `02-semantic-graph.json`

**Checkpoint:** Tell the user what you found — top clusters, key gaps, competitor landscape. Ask: "Ready to proceed to research?"

## Phase 2: Research Gathering

Read `agents/seo-research-specialist.md` for full instructions. Execute:

1. **Content gaps** — call `mcp_infranodus_generate_content_gaps`
2. **Research questions** — call `mcp_infranodus_generate_research_questions` + manually generate from clusters, gaps, PAA
3. **Web research** — use `parallel-cli research run` to answer questions (3-4 targeted queries)
4. **Reddit research** — search 3-5 relevant subreddits via Reddit API for practitioner threads (sort by score, take top 15-20)
5. **X/Twitter research** — use xAI Grok x_search (`grok-4-1-fast` + `x_search` tool) for high-engagement thought leader posts (10-15 posts)
6. **Process corpus** — deduplicate and categorize all sources (web + Reddit + X)

Save: `03-research-questions.md`, `04-research-corpus.md`

**Checkpoint:** Tell the user the corpus stats — question count, source count, domain diversity, Reddit thread count, X post count. Ask: "Ready to proceed to outlining?"

## Phase 3: Content Generation

Read `agents/seo-outline-architect.md` then `agents/seo-article-writer.md`. Execute:

1. **Content brief** — synthesize SERP + graph + research into brief with target, intent, angle, gaps
2. **Three outline drafts** — comprehensive, focused, unique-angle
3. **Master outline** — synthesize best elements from all three
4. **Write first draft** — section by section following master outline, incorporating research

Save: `05-content-brief.md`, `06-outline-drafts/`, `07-master-outline.md`, `08-first-draft.md`

**Checkpoint:** Share the master outline and first draft stats. Ask: "Ready to humanize and optimize?"

## Phase 4: Humanization

Read `agents/seo-humanizer.md` for full instructions. Execute three passes:

1. **Pass 1: Word/phrase removal** — replace AI tells (delve, comprehensive, leverage, etc.)
2. **Pass 2: Structure fixes** — break triple patterns, fix perfect parallelism, remove hedge stacks and empty transitions
3. **Pass 3: Voice injection** — add 2-3 personal experiences, 2-3 opinions with reasoning, 1-2 admitted limitations, 2-3 tangents, vary sentence rhythm

Save: `09-humanized-draft.md` with humanization report

## Phase 5: Optimization & Review

Read `agents/seo-optimizer.md` then `agents/seo-critic.md`. Execute:

1. **SEO optimization** — title (<60 chars), meta (150-160 chars), headers, keyword placement, featured snippet, internal/external links
2. **InfraNodus SEO report** — call `mcp_infranodus_generate_seo_report` to compare content vs SERP
3. **E-E-A-T review** — score Experience, Expertise, Authoritativeness, Trustworthiness
4. **Final critique** — strengths, improvements, specific edits
5. **Final polish** — apply critique, final read-aloud test

Save: `10-seo-report.json`, `11-critique.md`, `12-final-article.md`

## Done

Update `00-config.json` with `"status": "complete"` and completion timestamp.

Print summary:
```
--- SEO Article Complete ---
Keyword: {keyword}
Type: {type}
Word count: {count}
E-E-A-T score: {score}/40
SEO score: {score}/100
Artifacts: outputs/{slug}/ (12 files)
---
```

## Important Rules

- **Read each agent file BEFORE executing that phase** — they contain detailed instructions, output formats, and success criteria
- **Save artifacts incrementally** — don't wait until the end
- **Checkpoint after phases 1, 2, and 3** — get user confirmation before proceeding
- **Reference `config/default.json`** for word count targets, SEO settings, and AI detection patterns
- **Use templates from `templates/`** for the content type selected
- **Read `references/eeat-examples.md`** during the critic phase for best-in-class comparison
