---
description: Create a branded HTML report by executing the MH1 light-theme design workflow. Card-based layout with sidebar navigation, progress bar, hero section, and dark footer.
---

## Folder Management

Before generating the report, ensure the correct folder structure exists:

1. **Identify the client folder** — Look in the working directory for the client brand folder (e.g., `SokoGlam/`, `MarketerHire/`).
2. **Identify or create the audit date folder** — Use the most recent `audit-YYYY-MM-DD/` folder, or create one with today's date if none exists.
3. **Create the client report subfolder** — Save all output to `07-client-report/` inside the audit folder.
4. **Naming convention** — `{brand-slug}-seo-report-{YYYY-MM-DD}.html` (e.g., `sokoglam-seo-report-2026-02-27.html`).
5. **Deploy subfolder** — Create `07-client-report/deploy/` with `index.html` copying the report for Vercel deployment.

### Folder structure example:
```
{ClientName}/
  audit-{YYYY-MM-DD}/
    07-client-report/
      {brand-slug}-seo-report-{date}.html
      deploy/
        index.html
```

### Data sources
Read audit data from sibling folders in the same audit directory:
- `01-raw-data/` — GSC, DataForSEO, site detection data
- `02-technical/` or `02-subagent-reports/` — Technical SEO findings
- `03-content/` or `03-data-sources/` — Content quality and E-E-A-T
- `04-schema/` — Structured data audit
- `05-sitemap/` or `05-geo-analysis/` — Sitemap or GEO analysis
- `06-aeo-citation-audit/` — AEO citation audit (if present)
- `08-geo/` — GEO/AI visibility deep dive (if present)
- `09-competitors/` — Competitive analysis (if present)
- `FULL-AUDIT-REPORT.md` and `ACTION-PLAN.md` — Consolidated findings
- `ai-citability-audit.md` — AI citability data (if present)

## Design System

Reference `brand/` for brand colors, typography, and design tokens:
- `brand/01-colors.md` — Full palette with light-theme report colors
- `brand/02-typography.md` — Work Sans font for reports
- `brand/04-design-principles.md` — Design philosophy
- `brand/07-design-tokens.css` — CSS custom properties

The full report template and component reference is in `skills/mh1-report-design/SKILL.md`.

## Execute

Run the mh1-report-design skill for the user's request: $ARGUMENTS