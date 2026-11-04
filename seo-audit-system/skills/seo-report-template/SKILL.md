# SEO Report Template Skill

Generate polished, presentation-grade SEO audit reports using the MH1HQ brand identity.

## When to Use

Use this template when creating client-facing SEO analysis reports, quick-win proposals, or audit presentations. Trigger on: "SEO report", "client report", "audit report", "proposal deck", "quick win report", "SEO presentation".

## Template Location

`skills/seo-report-template/seo-report-template.html`

## Brand Identity Reference

Full brand guide at: `brand/`
Design tokens CSS: `brand/07-design-tokens.css`

## Design System (MH1HQ)

**Dark-mode-first.** Every slide uses dark navy backgrounds with layered depth.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--mh1-purple` | `#7c3aed` | Primary accent, gradient start, CTAs |
| `--mh1-pink` | `#ec4899` | Secondary accent, gradient end |
| `--mh1-gradient` | `135deg, #7c3aed → #ec4899` | Signature brand gradient — headlines, accent bars, badges |
| `--bg-base` | `#0a0e1a` | Primary canvas (Layer 0) |
| `--bg-surface` | `#1a1f2e` | Cards, panels (Layer 1) |
| `--bg-elevated` | `#28282e` | Modals, tooltips (Layer 2) |
| `--text-primary` | `#ffffff` | Headlines, body text |
| `--text-secondary` | `#d1d5db` | Subheadings, descriptions |
| `--text-muted` | `#9ca3af` | Captions, labels, metadata |

### Functional Colors (status only)

| Color | Hex | Usage |
|-------|-----|-------|
| Green | `#10b981` | Success, positive metrics |
| Red | `#ef4444` | Error, urgent, technical issues |
| Orange | `#f97316` | Warnings, medium priority |
| Blue | `#3b82f6` | Links, info states |
| Cyan | `#06b6d4` | Informational accents |
| Yellow | `#eab308` | Attention, highlights |

### Typography

| Element | Value |
|---------|-------|
| Font | **Inter** (400, 500, 600, 700) via Google Fonts |
| Mono | **Geist Mono** for data tables `.num` columns |
| Gradient text | `.gradient-text` class — use for key headlines, section numbers, big callout numbers |

### Key Design Rules

1. **Never use pure black (#000000)** — always use brand dark navies
2. **Purple-pink gradient is the brand signature** — don't swap colors or direction
3. **Layer backgrounds for depth** — Base → Surface → Elevated
4. **Functional colors for status only** — Green = success, Red = error, etc.
5. **One gradient accent per focal area** — don't overuse
6. **Borders are subtle** — `rgba(255,255,255,0.08)`, not solid lines
7. **Spacing uses 4px base** — xs:4, sm:8, md:16, lg:24, xl:40, 2xl:60

## Report Structure (19 slides)

### Section 01 — Growth Opportunities (Slides 1-9)
1. **Cover** — Gradient accent bar at top, gradient text on client name
2. **Agenda** — 3-column TOC, gradient text on section numbers (01, 02, 03)
3. **Purpose** — Centered purpose statement on dark canvas
4. **Section Divider** — Full gradient background (`.slide--gradient`)
5. **Current Status** — KPI cards with gradient left-border accent
6. **Competitor Overview** — Horizontal bar chart with gradient fills
7. **Business Potential** — Big number callout with gradient text
8. **Timeline** — Phase dots with purple glow, gradient text labels
9. **Executive Summary** — 4-pillar cards on surface background

### Section 02 — What Needs to Be Done (Slides 10-15)
10. **Section Divider** — Gradient background
11. **Challenges & Solutions** — 2x2 grid of problem areas
12. **Must-Win Projects** — Table + effort/impact matrix with purple highlight cells
13. **Project Detail** — Split slide (surface left panel with gradient inner border)
14. **Roadmap** — 3 sprint cards, featured card has purple border + glow
15. **Investment Overview** — Pricing cards with gradient text on price

### Section 03 — Additional Insights (Slides 16-19)
16. **Section Divider** — Gradient background
17. **Content Gap Analysis** — Data table with mono-font numbers
18. **Search Synergies** — Paid vs organic opportunity table
19. **Thank You** — Gradient text on "Thank You"

## Template Variables (Placeholders)

Replace these `{{PLACEHOLDERS}}` when generating a report:

### Global
- `{{CLIENT_NAME}}` — Client company name
- `{{AGENCY_NAME}}` — Your agency/team name (default: "MH1HQ")
- `{{REPORT_DATE}}` — e.g. "February 2026"

### Cover & Purpose
- `{{PURPOSE_TEXT}}` — 1-2 sentence purpose statement

### Current Status (Slide 5)
- `{{TOTAL_SEARCH_VOLUME}}` — e.g. "1.6M"
- `{{RANKING_EFFICIENCY}}` — e.g. "0.34%"
- `{{NON_BRAND_KEYWORDS}}` — e.g. "6,580"
- `{{MONTHLY_TRAFFIC}}` — e.g. "5,583"
- `{{DOMAIN_RATING}}` — e.g. "72/100"

### Business Potential (Slide 7)
- `{{POTENTIAL_CLICKS}}` — e.g. "+14,183"
- `{{POTENTIAL_YEARLY_CLICKS}}` — e.g. "170,196"
- `{{AD_SPEND_EQUIVALENT}}` — e.g. "$106,373"
- `{{EXISTING_CONTENT_CLICKS}}` — clicks from optimizing existing content
- `{{CONTENT_GAP_CLICKS}}` — clicks from closing content gaps

### Timeline (Slide 8)
- `{{CURRENT_TRAFFIC}}`, `{{SIX_MONTH_TARGET}}`, `{{TWELVE_MONTH_TARGET}}`, `{{TARGET_TRAFFIC}}`

### Executive Summary (Slide 9)
- `{{SUMMARY_TECHNICAL}}`, `{{SUMMARY_CONTENT}}`, `{{SUMMARY_AUTHORITY}}`, `{{SUMMARY_SERP}}`

### Must-Win Projects (Slide 12-13)
- `{{MUST_WIN_PROJECTS}}` — table rows
- `{{PROJECT_NUM}}`, `{{PROJECT_TITLE}}`, `{{PROJECT_CATEGORY}}`, `{{PROJECT_DESCRIPTION}}`, `{{PROJECT_NEXT_STEPS}}`

### Investment (Slide 15)
- `{{SPRINT1_PRICE}}`, `{{SPRINT2_PRICE}}`, `{{SPRINT3_PRICE}}`

### Contact (Slide 19)
- `{{CONTACT_NAME}}`, `{{CONTACT_TITLE}}`, `{{CONTACT_EMAIL}}`

## Slide Components Available

| Component | Class | Description |
|-----------|-------|-------------|
| Default slide | `.slide` | Dark base background |
| Surface slide | `.slide--surface` | Elevated surface layer |
| Gradient slide | `.slide--gradient` | Purple-pink gradient — section dividers |
| Split slide | `.slide--split` + `.split-left` / `.split-right` | Left surface panel (gradient inner border) + right content |
| Gradient text | `.gradient-text` | Apply brand gradient as text fill |
| KPI cards | `.kpi-grid` > `.kpi-card` | Metric boxes with gradient left accent |
| Big number | `.callout` > `.callout__number.gradient-text` | Hero stat on surface card |
| Bar chart | `.bar-chart` > `.bar-row` | Gradient-fill horizontal bars |
| Data table | `.data-table` | Dark header, subtle row borders, mono `.num` |
| Arrow list | `.arrow-list` | Purple arrow bullet points |
| Matrix | `.matrix` > `.matrix__cell` | 2x2 grid, `.matrix__cell--highlight` = purple tint |
| Timeline | `.timeline` > `.timeline__phase` | Purple dots with glow |
| Pricing cards | `.pricing-grid` > `.pricing-card` | `.pricing-card--featured` = purple border + glow |
| Pillar cards | `.pillar-grid` > `.pillar-card` | Surface background with icon tints |
| Badges | `.badge--green`, `.badge--orange`, `.badge--red`, `.badge--purple` | Translucent status labels |
| Section label | `.section-label.gradient-text` | Gradient uppercase category |

## How to Generate a Report

1. Copy the template HTML
2. Replace all `{{PLACEHOLDER}}` values with real data
3. Duplicate slide patterns as needed (e.g., multiple project detail slides)
4. Add/remove slides to match the analysis scope
5. For data tables, replace the sample `<tr>` rows with actual data
6. Save as `{client-name}-seo-report-{date}.html`

## Data Sources

When populating this template, pull data from:
- **GSC MCP** — search analytics, impressions, clicks, positions
- **GA4 MCP** — traffic data, user acquisition
- **DataForSEO MCP** — keyword volumes, domain rankings, competitor analysis, backlinks

## Printing / Export

The template includes `@media print` styles. To export as PDF:
- Open in Chrome → Ctrl+P
- Set to Landscape, no margins
- Background graphics: ON (required for dark backgrounds)
- Save as PDF
