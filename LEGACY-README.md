# SEO Article Generator

A standalone, AI-powered SEO article generation pipeline that creates publication-ready content optimized for search engines while maintaining a human voice.

## Overview

This project uses a multi-phase workflow to generate high-quality SEO content:

```
RESEARCH → BRIEF → OUTLINE → DRAFT → HUMANIZE → OPTIMIZE → REVIEW
```

### Key Features

- **Semantic Analysis**: Uses InfraNodus to build knowledge graphs from SERP data
- **Graph Metrics**: NetworkX calculates PageRank, centrality, and community detection
- **Research Automation**: Generates 50+ research questions answered via Parallel-Search
- **AI Humanization**: Removes AI tells and injects authentic voice
- **SEO Optimization**: On-page checklist + InfraNodus SEO reports
- **E-E-A-T Review**: Quality checks against best-in-class content examples

## Tech Stack

| Component | Tool |
|-----------|------|
| SERP Analysis | InfraNodus MCP |
| Knowledge Graphs | InfraNodus MCP |
| Graph Metrics | NetworkX + python-louvain |
| Web Research | Parallel-Search MCP |
| Deep Scraping | Firecrawl (backup) |

## Project Structure

```
seo/
├── agents/                 # Agent prompts for each phase
├── lib/                    # Python utilities
├── references/             # E-E-A-T examples, AI detection patterns
├── templates/              # Content structure templates
├── config/                 # Default settings
└── outputs/                # Generated articles
```

## Usage

### Prerequisites

1. Claude Code with MCP tools configured:
   - InfraNodus MCP
   - Parallel-Search MCP
   - Firecrawl (optional)

2. Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Generate an Article

Open this project in Claude Code and provide:

1. **Target keyword** or article title
2. **Content type**: pillar, how-to, comparison, or listicle
3. **Optional**: Brand voice context

The pipeline will generate a 12-step artifact trail in `outputs/{article-slug}/`.

## Workflow Phases

### Phase 1: Semantic Analysis
- 6 Circles keyword expansion
- SERP scraping via InfraNodus
- Knowledge graph generation
- Graph metrics calculation (PageRank, centrality, communities)

### Phase 2: Research Gathering
- Content gap identification
- 50 research questions generated
- Parallel web search for answers
- Corpus deduplication and categorization

### Phase 3: Content Generation
- Content brief creation
- Iterative outline writing (3 drafts → master)
- Section-by-section article writing

### Phase 4: Humanization
- AI word/phrase removal (delve, comprehensive, leverage, etc.)
- Voice injection (personal experience, opinions, tangents)
- Rhythm variation (sentence length, fragments)

### Phase 5: Optimization & Review
- InfraNodus SEO report
- On-page optimization checklist
- E-E-A-T quality review
- Final polish

## Output Structure

Each article generates:

```
outputs/{article-slug}/
├── 00-config.json           # Run configuration
├── 01-serp-analysis.json    # SERP data + competitor analysis
├── 02-semantic-graph.json   # Knowledge graph + metrics
├── 03-research-questions.md # Generated questions (up to 50)
├── 04-research-corpus.md    # Compiled research
├── 05-content-brief.md      # Target, intent, angle, gaps
├── 06-outline-drafts/       # 3 outline iterations
├── 07-master-outline.md     # Synthesized final outline
├── 08-first-draft.md        # Initial article
├── 09-humanized-draft.md    # After AI detection removal
├── 10-seo-report.json       # InfraNodus optimization report
├── 11-critique.md           # E-E-A-T review
└── 12-final-article.md      # Publication-ready with meta
```

## Content Types

| Type | Word Count | Structure |
|------|------------|-----------|
| Pillar Guide | 5,000-8,000 | Hook, quick answer, 3-5 core sections, FAQ |
| How-To Tutorial | 2,000-3,000 | What you'll achieve, steps, variations, mistakes |
| Comparison | 2,500-4,000 | Quick verdict, table, deep dives, head-to-head |
| Listicle | 2,000-3,000 | Context, summary table, items, how to choose |

## References

This project incorporates methodologies from:
- Vibe-Skills SEO Content workflow
- E-E-A-T best practices (Paul Graham, Brian Dean, Lenny Rachitsky examples)
- AI detection pattern research

## License

Internal use only.






