# SEO Audit System — Standalone

A self-contained SEO audit system with 12 specialized skills and 2 report generators. Any Claude instance can run this by opening this folder as a project.

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/seo audit <url>` | Full website audit with parallel subagent delegation |
| `/seo page <url>` | Deep single-page analysis |
| `/seo technical <url>` | Technical SEO audit (8 categories) |
| `/seo content <url>` | E-E-A-T and content quality analysis |
| `/seo schema <url>` | Detect, validate, and generate Schema.org markup |
| `/seo images <url>` | Image optimization analysis |
| `/seo sitemap <url or generate>` | Analyze or generate XML sitemaps |
| `/seo geo <url>` | AI Overviews / Generative Engine Optimization |
| `/seo plan <business-type>` | Strategic SEO planning |
| `/seo programmatic [url\|plan]` | Programmatic SEO analysis and planning |
| `/seo competitor-pages [url\|generate]` | Competitor comparison page generation |
| `/seo hreflang [url]` | Hreflang/i18n SEO audit and generation |
| `/generate-branded-report` | Light-theme MH1 HTML report from audit data |
| `/generate-executive-overview-deck` | Dark-theme executive slide deck (HTML + PDF) |

## How to Run

1. Open this folder as your project root in Claude Code
2. Run any command above, e.g. `/seo audit https://example.com`
3. Output goes to `audits/{ClientName}/audit-{YYYY-MM-DD}/`

## Skill Loading

When a command is invoked, read the corresponding SKILL.md:
- **Root orchestrator**: `skills/SKILL.md` — defines scoring, quality gates, industry detection
- **Sub-skills**: `skills/seo-{name}/SKILL.md` — each has its own methodology
- **Report design**: `skills/mh1-report-design/SKILL.md` (light-theme) and `skills/seo-report-template/SKILL.md` (dark-theme decks)

Load skills on demand. Do NOT preload all at startup.

## Reference Docs

Load from `references/` as needed during analysis:
- `cwv-thresholds.md` — Core Web Vitals thresholds (INP, not FID)
- `schema-types.md` — Schema.org types with deprecation status
- `eeat-framework.md` — E-E-A-T evaluation criteria (Sept 2025 QRG update)
- `quality-gates.md` — Content length minimums, uniqueness thresholds
- `google-seo-reference.md` — Google's SEO documentation reference

## Agent Delegation

For full audits (`/seo audit`), spawn parallel subagents. Agent specs are in `agents/`:
- `seo-technical.md`, `seo-content.md`, `seo-schema.md`, `seo-sitemap.md`, `seo-performance.md`, `seo-visual.md`

Each agent runs its corresponding sub-skill independently. Collect results and merge into the unified report.

## Report Generation

Two report systems:

**Light-theme branded reports** (`/generate-branded-report`):
- Read `skills/mh1-report-design/SKILL.md` for the full template and component reference
- Brand colors, typography: `brand/`
- Design tokens: `skills/mh1-report-design/design-tokens.css`
- Output: single self-contained HTML file (all CSS/JS inline, only Google Fonts external)

**Dark-theme executive decks** (`/generate-executive-overview-deck`):
- Read `skills/seo-report-template/SKILL.md` for design system
- The command file itself contains the full slide structure, component library, and CSS variables
- PDF generation: `~/.local/bin/weasyprint "{html}" "{pdf}" --presentational-hints`

## Brand Identity

All brand files are in `brand/`:
- `00-OVERVIEW.md` through `08-agent-module-colors.md` — Full MH1 brand identity
- `07-design-tokens.css` — CSS custom properties
- `mh1-logo-v2.svg` — MH1 logo for inline SVG use

## Output Convention

```
audits/{ClientName}/
  audit-{YYYY-MM-DD}/
    01-raw-data/           — Crawl data, site detection
    02-technical/          — Technical SEO findings
    03-content/            — Content quality and E-E-A-T
    04-schema/             — Structured data audit
    05-sitemap/            — Sitemap analysis
    06-geo/                — GEO/AI visibility
    07-client-report/      — Light-theme branded HTML report
    08-executive-deck/     — Dark-theme executive deck (HTML + PDF)
    09-competitors/        — Competitive analysis
    FULL-AUDIT-REPORT.md   — Consolidated findings
    ACTION-PLAN.md         — Prioritized action items
```

## Quality Gates (Hard Rules)

- Never recommend HowTo schema (deprecated Sept 2023)
- FAQ schema only for government and healthcare sites
- All Core Web Vitals references use INP, never FID
- WARNING at 30+ location pages (enforce 60%+ unique content)
- HARD STOP at 50+ location pages (require user justification)

## Scoring Methodology

SEO Health Score (0-100), weighted:

| Category | Weight |
|----------|--------|
| Technical SEO | 25% |
| Content Quality | 25% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| Images | 5% |
| AI Search Readiness | 5% |

## Optional: MCP Tools

For enriched data (DataForSEO, Perplexity), configure MCP servers per `mcp-config/mcp.json`. Supply your own API keys.

## Optional: Python Dependencies

Some scripts in `scripts/` require Python packages:
```bash
pip install -r requirements.txt
```
