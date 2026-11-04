# MarketerHire — SEO Article System (shared context bundle)

This repo is a frozen snapshot of MarketerHire's SEO article production system: the pipeline code, the dashboard, the quality rubric, and every article the machine has produced for marketerhire.com so far.

**If you just want to see the output:** jump to [article-machine/output/marketerhire/batches/](article-machine/output/marketerhire/batches/).

**If you want to understand how the sausage is made:** read `CLAUDE.md` (the module overview), then `article-machine/SKILL.md` (the engine spec), then any `batch-00N-*/<article>/scorecard.md` to see the quality bar in practice.

---

## What's in here

| Folder | Purpose |
|---|---|
| [article-machine/](article-machine/) | **The engine.** 4-phase pipeline (brand setup → keyword intel → article batch → report) that produces publication-ready articles. Full docs in `article-machine/SKILL.md` and `article-machine/CLAUDE.md`. |
| [article-machine/output/marketerhire/batches/](article-machine/output/marketerhire/batches/) | **The articles.** 4 batches × ~5 articles = 20 published pieces. Each article folder holds `brief.md`, `draft-optimized.md`, `article-publish.html` (Webflow embed), `article-preview.html` (standalone render), `scorecard.md` (0-25 quality grade), `schema.json` (JSON-LD), and the feature image. |
| [dashboard/](dashboard/) | Next.js operational dashboard — registers published URLs, tracks health (GA4 + GSC), surfaces quick wins. Supabase-backed. |
| [registry/article-registry.json](registry/article-registry.json) | Local mirror of what's been produced / published / monitored. |
| [workflow-blog-content-pipeline.md](workflow-blog-content-pipeline.md) | End-to-end narrative: how a keyword becomes a live article. |
| [CLAUDE.md](CLAUDE.md) | SEO module operating guide — command routing, MCP servers, lifecycle rules. |
| [agents/](agents/), [lib/](lib/), [templates/](templates/), [references/](references/), [LEGACY-README.md](LEGACY-README.md) | Legacy InfraNodus pipeline — standalone 12-step generator predating the Article Machine. Kept for reference. |
| [audit/](audit/), [seo-audit-system/](seo-audit-system/) | Weekly SEO audit cycle: pulls GA4 + GSC, scores article health, finds quick wins. |

---

## Quick article tour

The 20 MH articles below cover fractional CMO / marketing agency / marketing hire topics. All graded 23+/25 on the internal rubric.

### batch-001-2026-04-09
- best-freelance-marketing-platforms
- fractional-cmo-vs-marketing-agency
- marketing-agency-alternatives-startups
- scale-marketing-without-full-time-hires
- signs-marketing-agency-is-failing

### batch-002-2026-04-13
- outsource-marketing-agency
- *(plus others — see folder listing)*

### batch-003-2026-04-13
- fractional-marketing-services
- *(plus others)*

### batch-004-2026-04-13
- best-marketing-hire-for-series-a-startup
- cost-of-bad-marketing-hire
- hire-digital-marketing-consultant
- marketing-as-a-service-for-startups
- when-should-a-startup-hire-its-first-marketer

Each folder: open `article-preview.html` in a browser for a reader view, or `article-publish.html` for the Webflow-ready embed.

---

## Quality rubric (the 25-point scorecard)

Every article is graded on 5 dimensions × 5 points each:

| Dimension | What it measures |
|---|---|
| Content depth | Answers query in first paragraph, covers subtopics with specifics (pricing, examples, data) |
| E-E-A-T signals | Real author, data cited, expertise signals, trustworthy references |
| On-page SEO | Keyword in H1 + first 100 words + meta, logical H2/H3 structure |
| AI-tell removal | No "delve", "landscape", "comprehensive", "it's worth noting"; no triplet lists |
| Technical | Valid schema, resolving links, clean HTML |

Full methodology: [article-machine/knowledge-base/scoring-methodology.md](article-machine/knowledge-base/scoring-methodology.md) · AI-tell rules: [article-machine/rules/](article-machine/rules/) · Scorecards per article: `article-machine/output/marketerhire/batches/*/<article>/scorecard.md`

---

## Re-running the pipeline (for other brands)

The engine is brand-agnostic. The separate `seo-machine-template/` repo wraps this engine with per-client deployment scripts — tell Claude Code "deploy dashboard for \<brand\>" and it provisions a scoped instance. This repo is the context/output snapshot; that repo is the deployment harness.

---

## What's NOT in this repo

Deliberately excluded:
- `node_modules/`, `.next/`, `.vercel/` — build artifacts
- `.env`, `.env.local`, `.mcp.json` — secrets (Supabase, Ahrefs, DataForSEO, Perplexity, GSC OAuth, GA4 service accounts)
- `service-account*.json`, `client_secrets*.json`

To run the dashboard locally, see `dashboard/README.md` for the required env vars. To run the article machine, see `article-machine/README.md` + `.mcp.json` setup.

---

## Snapshot date

Frozen on **2026-11-04**. The live system continues to evolve in the main MH-OS monorepo.
