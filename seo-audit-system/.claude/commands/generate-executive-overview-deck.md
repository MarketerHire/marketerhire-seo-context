---
description: Generate an executive overview slide deck (HTML + PDF) using the MH1 dark-mode design system. Landscape slides with scroll-snap, automated PDF via weasyprint, metric cards, score bars, and timeline phases. Follows the proven SokoGlam executive deck format.
---

## Folder Management

Before generating the deck, ensure the correct folder structure exists:

1. **Identify the client folder** — Look in the working directory for the client brand folder (e.g., `SokoGlam/`, `MarketerHire/`).
2. **Identify or create the audit date folder** — Use the most recent `audit-YYYY-MM-DD/` folder, or create one with today's date if none exists.
3. **Create the executive deck subfolder** — Save all output to `08-executive-deck/` inside the audit folder.
4. **Naming convention**:
   - HTML: `{brand-slug}-executive-overview.html`
   - PDF: `{brand-slug}-executive-overview.pdf`

### Folder structure example:
```
{ClientName}/
  audit-{YYYY-MM-DD}/
    08-executive-deck/
      {brand-slug}-executive-overview.html
      {brand-slug}-executive-overview.pdf
```

### Data sources
Read audit data from sibling folders in the same audit directory:
- `01-raw-data/` — GSC, DataForSEO, site detection data
- `02-technical/` or `02-subagent-reports/` — Technical SEO findings
- `03-content/` or `03-data-sources/` — Content quality and E-E-A-T
- `04-schema/` — Structured data audit
- `05-sitemap/` or `05-geo-analysis/` — Sitemap or GEO analysis
- `07-client-report/` — Full branded HTML report (if already generated)
- `08-geo/` — GEO/AI visibility deep dive
- `09-competitors/` — Competitive analysis
- `FULL-AUDIT-REPORT.md` and `ACTION-PLAN.md` — Consolidated findings
- `ai-citability-audit.md` — AI citability data (if present)

## Design System

Reference `brand/` for the brand identity:
- `00-OVERVIEW.md` — Quick reference table
- `01-colors.md` — Full palette with dark backgrounds `#0a0e1a` / `#1a1f2e`, functional colors
- `02-typography.md` — Inter (brand guide) / Work Sans (deck variant) — **use Work Sans for decks** to match the reference implementation
- `04-design-principles.md` — Dark-mode-first, gradient-as-identity, minimal & intentional
- `06-layout-and-spacing.md` — Spacing system, composition rules
- `07-design-tokens.css` — CSS custom properties for code implementation

### Key Design Rules (from brand guide):
- Never use pure black `#000000` — always use brand dark navies
- Purple-to-pink gradient is the brand signature — don't substitute colors
- Functional colors only for their intended purpose (green=success, red=error)
- Layer backgrounds for depth: Base Dark -> Surface -> Elevated
- One focal point per section; typography does the heavy lifting
- Gradient text is an accent, not a default — max one per slide

## Reference Implementation

The full deck template, component library, and CSS variables are defined below. Follow them exactly:
- Slide-based layout: each `<section class="slide">` = one page, `100vh` height, `scroll-snap-type: y mandatory`
- Print/PDF styles: `@page { size: landscape; margin: 0; }` with `page-break-after: always` per slide
- `.cover-slide` with gradient background, MH1 SVG logo, brand name in `.g` gradient text, 4 hero stats
- `.closing-slide` with centered layout, logo, report stats, "Prepared by MH-1" footer
- All CSS is inline in `<style>` — no external stylesheets
- JavaScript `SlidePresentation` class for keyboard nav + intersection observer + nav dots
- `.slide-footer` on every content slide: `{Brand} — Executive SEO Overview | MH-1 Intelligence | {page} / {total}`

### MH1 SVG Logo (inline, used on cover + closing slides):
```html
<svg width="120" height="43" viewBox="0 0 168 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="120" y="24" width="12" height="12" fill="white"/>
  <path d="M156 0V48H168V60H132V48H144V12H132V0H156Z" fill="url(#g1)"/>
  <path d="M84 24H96V0H108V60H96V36H84V60H72V0H84V24Z" fill="white"/>
  <path d="M60 0V60H48V12H36V60H24V12H12V60H0V0H60Z" fill="white"/>
  <defs><radialGradient id="g1" cx="0" cy="0" r="1" gradientTransform="matrix(36 60 -65 6.77 132 0)" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FDDE3C"/><stop offset="1" stop-color="#FF5BFE"/>
  </radialGradient></defs>
</svg>
```

## Required Slide Structure (12-15 slides)

Each slide follows this anatomy:
```html
<section class="slide">
  <div class="slide-label">NN — Section Name</div>
  <h2 class="slide-title">Title with <span class="g">gradient accent</span></h2>
  <p class="slide-subtitle">One-line context.</p>
  <!-- Content area using component library -->
  <div class="why-matters">
    <span class="wm-label">Why it matters</span>
    <span class="wm-text">Business impact statement.</span>
  </div>
  <div class="slide-footer">
    <span>{Brand} — Executive SEO Overview</span>
    <span>MH-1 Intelligence</span>
    <span>{page} / {total}</span>
  </div>
</section>
```

### Slide Sequence:

1. **Cover Slide** (`.cover-slide`) — MH1 logo, brand name in `.g` gradient, audit type, date, 4 hero metrics (health score, keywords, traffic value, AI visibility), "Prepared by MH-1" tagline
2. **Executive Summary** (`.two-col`) — Left: Where brand stands + What audit found + Trajectory. Right: Key opportunities + Competitive context + Path forward
3. **Health Score Breakdown** — `.score-row` bars for each audit dimension. Color code: green (70+), orange (50-69), red (<50). Tags: "Excellent" / "Good" / "Needs Work" / "Critical"
4. **Key Metrics** — `.metrics-grid` with 8 `.metric-card` items (keywords, P1 rankings, keywords lost, traffic value, est. traffic, GSC clicks, CTR, avg. position)
5. **Trajectory / Trends** — `.two-col` with before->after metric cards showing 6-month direction + root cause analysis
6. **Critical Issues** — `.issue-list` with 5-7 `.issue-card` items (red left border, numbered badges)
7. **CTR Analysis** (if data available) — `.data-table` with page-type CTR breakdown + opportunity callout
8. **E-E-A-T Assessment** — `.eeat-grid` with 4 `.eeat-card` items (Experience, Expertise, Authoritativeness, Trustworthiness) + gap callouts
9. **Competitive Landscape** — `.comp-row` bars + missing brand/content opportunities table
10. **AI Visibility / GEO** — `.two-col` with AI citation metrics + critical GEO gaps list
11. **Schema & Technical** — `.two-col` with schema issue list + CWV metrics
12. **Quick Wins** — `.issue-list` with 5-7 `.issue-card.win` items (green left border, "+" badges, time estimates)
13. **Implementation Roadmap** — `.timeline` with 4 `.phase-card` columns (Phase 1: Critical/Week 1, Phase 2: High/Weeks 2-4, Phase 3: Recovery/Months 1-3, Phase 4: Advanced/Months 3-6)
14. **ROI Projections** — `.proj-grid` tables: Phase 1-2 impact (4 weeks) + Full implementation (6 months)
15. **Closing Slide** (`.closing-slide`) — MH1 logo, "Full Report Available", report stats (sections, data sources, URLs, action items), "Prepared by MH-1" + date + "Confidential"

### Slide Component Library

Each slide uses these reusable CSS components (copy from reference implementation):
- `.metrics-grid` + `.metric-card` — 4-column KPI cards with gold-to-pink gradient top border (`::before`)
- `.score-row` + `.score-bar` + `.score-bar-fill` — Horizontal score bars with `.score-label`, `.score-value`, `.score-tag`
- `.issue-card` / `.issue-card.win` — Red/green left-bordered cards with `.issue-num` numbered badges
- `.data-table` + `.data-row` — Grid-based table rows with `.header` variant and `.val` right-aligned values
- `.two-col` — Two-column grid (`1fr 1fr`) layout
- `.timeline` + `.phase-card` — 4-column roadmap phases with colored `border-top`
- `.comp-row` + `.comp-bar` + `.comp-bar-fill` — Competitor horizontal bar chart
- `.eeat-grid` + `.eeat-card` — 4-column E-E-A-T dimension cards with `.eeat-score`, `.eeat-name`, `.eeat-gap`
- `.proj-grid` + `.proj-cell` — Projection tables with `.header`, `.metric-name`, `.current`, `.projected`, `.change` variants
- `.big-stat` — Hero stat callout with `.big-num` + `.big-label`
- `.why-matters` — Pink left-bordered insight callout with `.wm-label` + `.wm-text`
- `.slide-footer` — Bottom bar: flexbox with space-between, auto margin-top, top border
- `.nav-dots` + `.nav-dot` — Right-side navigation dots (hidden in print via `@media print`)
- `.g` — Gradient text: `background: linear-gradient(135deg, var(--gold) 0%, var(--pink) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
- `.small-label` — Uppercase label: 11-14px, font-weight 600, letter-spacing 0.5px, color var(--text-3)
- `.slide-label` — Section label: 13-16px, font-weight 700, letter-spacing 2px, uppercase, color var(--pink)
- `.slide-title` — Section heading: 24-48px, font-weight 800, line-height 1.1

### CSS Variables (Dark Mode Deck)
```css
:root {
    --bg: #0A0A0A;
    --bg-card: #16161C;
    --bg-card-alt: #1A1F2E;
    --text: #FFFFFF;
    --text-2: #B4B4B4;
    --text-3: #646464;
    --pink: #FF52E5;
    --pink-dark: #EC4899;
    --gold: #FDDE3C;
    --green: #22C55E;
    --red: #EF4444;
    --orange: #F97316;
    --blue: #3B82F6;
    --cyan: #06B6D4;
    --purple: #A855F7;
    --font: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --radius: 12px;
}
```

### WeasyPrint-Compatible CSS (CRITICAL)

WeasyPrint 68.1 does NOT support these CSS features — **never use them**:
- `clamp()` — use fixed `px` values instead (compute at 1122×794px page dimensions)
- Viewport units (`vw`, `vh`, `dvh`) — use `%`, `mm`, or `px` instead
- `background-clip: text` — use `@supports` fallback (solid color for print, gradient for browsers)
- `overflow-x` property

**Slide dimensions** must use fixed units, not viewport units:
```css
.slide {
    width: 100%;
    height: 210mm; /* landscape A4 height */
    padding: 36px 50px; /* tight enough to fit dense slides */
}
```

**Gradient text** must use `@supports` for browser-only gradient with solid fallback:
```css
.g { color: var(--pink); }
@supports (-webkit-background-clip: text) {
    .g {
        background: linear-gradient(135deg, var(--gold) 0%, var(--pink) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
    }
}
```

**Computing fixed values from responsive formulas:** At landscape A4 (297mm × 210mm = 1122px × 794px at 96dpi):
- 1vw = 11.2px, 1vh = 7.9px
- For `clamp(min, Nvw, max)`: compute `N × 11.2`, then clamp between min and max
- For `clamp(min, Nvh, max)`: compute `N × 7.9`, then clamp between min and max
- Use the **computed** value, NOT the max — using max values causes slide overflow

### Print / PDF Styles (must be included in the HTML):
```css
@page {
    size: landscape;
    margin: 0;
}
@media print {
    html { scroll-snap-type: none; }
    .slide {
        width: 100%;
        height: 210mm;
        min-height: 210mm;
        max-height: 210mm;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
    }
    .slide:last-child { page-break-after: auto; }
    .nav-dots, .progress-bar { display: none !important; }
}
```

## PDF Generation

After saving the HTML file, automatically generate the PDF using weasyprint:

```bash
~/.local/bin/weasyprint "{path-to-html}" "{path-to-pdf}" --presentational-hints
```

This produces a landscape PDF with each slide as a separate page (15 slides = 15 pages).

**WeasyPrint notes:**
- WeasyPrint 68.1 is installed at `~/.local/bin/weasyprint`
- It respects `@page` directives, `page-break-after`, and background colors/gradients
- The `--presentational-hints` flag ensures inline styles are respected
- Google Fonts (Work Sans) will be fetched automatically if the system has internet access
- **Verify page count**: After generating, check that page count matches slide count. If extra pages appear, reduce padding or font sizes on dense slides

## Execute

Generate the executive overview deck by:
1. Read all available audit data from the audit folder (FULL-AUDIT-REPORT.md, ACTION-PLAN.md, and all numbered subfolders)
2. Read `skills/seo-report-template/SKILL.md` and `brand/` files for design reference
3. Synthesize key findings into the slide structure above
4. Produce a single self-contained HTML file with all CSS inline in `<style>` and the SlidePresentation JS at the bottom
5. Save the HTML to `08-executive-deck/{brand-slug}-executive-overview.html`
6. Run `weasyprint` to generate the PDF automatically: `weasyprint "{html-path}" "{pdf-path}" --presentational-hints`
7. Confirm both files exist and report the output paths

User's request: $ARGUMENTS