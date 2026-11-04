---
name: mh1-report-design
description: >
  Generate client-facing HTML audit reports using the MH1 light-theme design system.
  Card-based layout with sidebar navigation, progress bar, hero section,
  "Built by MH-1" methodology block, and dark footer. Use when creating
  SEO audits, GEO audits, content audits, or any client deliverable HTML report.
  Triggers on: "HTML report", "client report", "audit report", "generate report",
  "MH1 report", "report design".
---

# MH1 Audit Report Design System

Generate single-file, self-contained HTML reports using the MH1 brand identity. Reports are light-theme, card-based, sidebar-navigated, and fully responsive. All CSS + JS is inline — no external dependencies except Google Fonts.

## Reference Files

- **Brand assets**: `brand/`
- **Design tokens CSS**: `skills/mh1-report-design/design-tokens.css`
- **MH1 Logo SVG (inline)**: `brand/mh1-logo-v2.svg`

## Design Principles

1. **Light theme first** — white cards on light gray background
2. **Card-based sections** — each audit section is a white card with rounded corners and shadow
3. **Fixed sidebar** — dark navy sidebar with scroll spy; collapses to hamburger on tablet
4. **Progress bar** — gradient fill at top of viewport tracking scroll position
5. **Single HTML file** — all CSS, JS, SVG logos inline. Only external: Google Fonts
6. **Data density** — tables, stat grids, callout boxes. Never sacrifice data for aesthetics
7. **Mobile-first responsive** — 4 breakpoints: 1024px, 768px, 640px, 400px

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--sg-coral` | `#FF52E5` | Primary accent (magenta) |
| `--sg-rose` | `#D63CC0` | Secondary accent |
| `--sg-gradient` | `linear-gradient(135deg, #FDDE3C 0%, #FF52E5 100%)` | Yellow→magenta gradient — hero badge, progress bar, gradient text, card accent bars |
| `--bg-base` | `#F8F8F8` | Page background (light gray) |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-elevated` | `#F0F0F2` | Code blocks, alternating table rows |
| `--text-primary` | `#0A0A0A` | Headlines, body text |
| `--text-secondary` | `#4A5568` | Subheadings, descriptions |
| `--text-muted` | `#9CA3AF` | Captions, labels, metadata |
| `--border-subtle` | `rgba(0,0,0,.08)` | Card borders, dividers |

### Functional Colors (status only)

| Color | Hex | Usage |
|-------|-----|-------|
| Green | `#22C55E` | Success, good scores, positive metrics |
| Red | `#EF4444` | Critical, errors, urgent |
| Orange | `#F97316` | Warnings, needs work |
| Blue | `#3B82F6` | Info, links |
| Cyan | `#06B6D4` | Informational accents |
| Yellow | `#EAB308` | Attention, highlights |

### Dark Surfaces (sidebar, hero, footer only)

| Element | Background | Text |
|---------|-----------|------|
| Sidebar | `#0A0A0A` | `#fff` (links at `rgba(255,255,255,.55)`) |
| Hero | `linear-gradient(135deg, #0A0A0A, #1a1a2e, #16213e)` | `#fff` |
| Footer | `#0A0A0A` | `rgba(255,255,255,.7)` / `.4` / `.35` |

## Typography

| Element | Value |
|---------|-------|
| Font | **Work Sans** (300, 400, 500, 600, 700, 800) via Google Fonts |
| Mono | `ui-monospace, 'Cascadia Code', monospace` — for code, table numbers |
| Gradient text | `.g` class — `background: var(--sg-gradient); -webkit-background-clip: text` |

## Key Design Rules

1. **Never use pure black backgrounds in content area** — always `#F8F8F8` base, `#FFFFFF` cards
2. **Yellow→magenta gradient is the brand signature** — used sparingly: progress bar, hero badge, gradient text, card accent bars
3. **Table headers are dark navy** — `thead { background: #0A0A0A }` with white text
4. **Cards have subtle shadows** — `0 2px 4px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.05)`
5. **Stat card values never line-break** — use `white-space: nowrap` on `.kc .vl`
6. **Callout boxes use colored left borders** (not colored backgrounds) — `.co--d` = red, `.co--w` = orange, `.co--i` = blue, `.co--ok` = green
7. **Tags are pills** — `border-radius: 100px` with translucent colored backgrounds
8. **Sidebar active link** — white text, `rgba(255,255,255,.05)` background, magenta left border
9. **Section headers** — small magenta label (`.sl`) + large bold title (`.st`) + gray subtitle (`.ss`)

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>{{CLIENT_NAME}} — {{REPORT_TITLE}}</title>
  <link rel="icon" href="data:image/svg+xml,...">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>/* Full CSS here */</style>
</head>
<body>

<!-- 1. Hamburger (hidden on desktop) -->
<button class="hamburger" aria-label="Toggle navigation">
  <span></span><span></span><span></span>
</button>

<!-- 2. Sidebar overlay (mobile) -->
<div class="sidebar-overlay"></div>

<!-- 3. Progress bar -->
<div class="progress-bar"><div class="progress-fill"></div></div>

<!-- 4. Sidebar navigation -->
<nav class="sidebar">
  <div class="sb-brand">
    <!-- Inline MH1 SVG logo (white version for dark sidebar) -->
    <svg width="100" height="36" viewBox="0 0 168 60" ...></svg>
    <span style="color:var(--sg-coral)">{{CLIENT_NAME}}</span>
    <small>{{REPORT_SUBTITLE}}</small>
  </div>
  <div class="sb-sec">
    <a class="sec-link" href="#hero"><span class="sec-num"></span>Top</a>
    <a class="sec-link" href="#section-id"><span class="sec-num">01</span>Section Name</a>
    <ul class="sb-sub">
      <li><a href="#section-id">Sub-heading</a></li>
    </ul>
    <!-- Repeat for each section -->
  </div>
</nav>

<!-- 5. Main content wrapper -->
<div class="main-content">

  <!-- 6. Hero section -->
  <section class="hero" id="hero">
    <div class="hero-content">
      <div class="hero-badge">MH1 Intelligence</div>
      <h1><span class="g">{{CLIENT_NAME}}</span><br>{{REPORT_TITLE}}</h1>
      <p class="sub">{{REPORT_DESCRIPTION}}</p>
      <p class="date">{{DATE}} — Prepared by MH-1</p>
      <div class="hero-stats">
        <div class="hero-stat"><div class="num">{{STAT_VALUE}}</div><div class="label">{{STAT_LABEL}}</div></div>
        <!-- 3-5 hero stats -->
      </div>
    </div>
  </section>

  <!-- 7. Built by MH-1 section (between hero and report content) -->
  <section style="background:var(--bg-base);padding:64px 24px;text-align:center">
    <!-- MH1 logo (dark version for light background) -->
    <!-- "Built by MH-1" heading -->
    <!-- "AI Marketing Operations Engine" subtitle -->
    <!-- Description paragraph -->
    <!-- Stats row: sections, data sources, URLs, keywords, audits -->
    <!-- "What Went Into This Report" 2x2 card grid -->
  </section>

  <!-- 8. Report content -->
  <div id="report-content">

    <section class="s" id="{{SECTION_ID}}">
      <div class="c">
        <span class="sl g">{{SECTION_LABEL}}</span>
        <h2 class="st">{{SECTION_TITLE}}</h2>
        <p class="ss">{{SECTION_SUBTITLE}}</p>
        <!-- Section content: tables, stat grids, callout boxes, etc. -->
      </div>
    </section>
    <!-- Repeat for each section -->

    <a href="#hero" class="back-to-top">&uarr; Back to Top</a>
  </div>

  <!-- 9. Footer -->
  <footer class="foot" style="background:#0A0A0A;color:#fff;padding:48px 24px;border-top:none">
    <!-- MH1 logo SVG (white version) -->
    <p>{{CLIENT_NAME}} — {{REPORT_TITLE}}</p>
    <p>Generated {{DATE}}</p>
    <p>Prepared by <span class="g">MH-1</span></p>
  </footer>

</div><!-- /.main-content -->

<script>/* Hamburger, progress bar, scroll spy, fade-in */</script>
</body>
</html>
```

## Component Reference

### Stat Cards (Key Metrics Grid)

```html
<div class="kg">
  <div class="kc">
    <div class="lb">Label</div>
    <div class="vl" style="color:var(--color-green)">Value</div>
    <div class="nt">Footnote</div>
  </div>
</div>
```

- Grid: `repeat(auto-fit, minmax(160px, 1fr))`
- Cards have gradient left accent bar via `::before`
- Values use `white-space: nowrap` — never line-break numbers
- Color values inline: `--color-green`, `--color-red`, `--color-orange`

### Tables

```html
<div class="tw">
  <table>
    <thead><tr><th>Header</th><th>Header</th></tr></thead>
    <tbody>
      <tr><td>Cell</td><td class="n">123</td></tr>
    </tbody>
  </table>
</div>
```

- `.tw` wrapper handles overflow scrolling + rounded corners
- Dark navy `thead` with white text
- `.n` class for right-aligned numeric columns (monospace)
- Alternating row backgrounds: `nth-child(even) { background: var(--bg-base) }`

### Callout Boxes

```html
<div class="co co--d">
  <div class="ic">!</div>
  <div>
    <strong>Title</strong>
    <p>Description</p>
  </div>
</div>
```

Variants: `.co--d` (danger/red), `.co--w` (warning/orange), `.co--i` (info/blue), `.co--ok` (success/green)

**Critical alignment rule**: The `.co h4` inside callout boxes MUST have `margin-top: 0` to align with the icon. The global `h4` style sets `margin: 24px 0 10px` which will push the heading down and misalign it from the icon circle. Always include this CSS:

```css
.co h4 { margin: 0 0 6px; line-height: 1.4 }
.co p:last-child { margin-bottom: 0 }
.co .ic { margin-top: 2px }  /* fine-tune icon to align with heading baseline */
```

### Tags / Pills

```html
<span class="tag tag-r">Critical</span>
<span class="tag tag-o">Needs Work</span>
<span class="tag tag-g">Good</span>
<span class="tag tag-b">Info</span>
<span class="tag tag-p">Featured</span>
```

### Score Bars

```html
<div class="sb">
  <div style="width:62%;background:var(--color-orange)"></div>
</div>
```

### Two-Column Grid

```html
<div class="g2">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

Collapses to single column at 640px.

### Cards

```html
<div class="cd">
  <h4>Card Title</h4>
  <p>Card content</p>
</div>
```

`.cd--hl` for highlighted cards (magenta border).

### Gradient Text

```html
<span class="g">Gradient Text</span>
```

Works on any inline element. Yellow→magenta gradient.

### Section Dividers

```html
<div class="dv">
  <h2>Divider Title</h2>
  <p>Subtitle</p>
</div>
```

## Responsive Breakpoints

| Breakpoint | Changes |
|-----------|---------|
| `≤1024px` | Sidebar hides (hamburger appears), body margin-left removed, progress bar full-width |
| `≤768px` | Hero padding reduces, font sizes shrink, tables go full-bleed (no border-radius), stat grid 2-col, sections reduce padding, "Built by" grid goes 1-col |
| `≤640px` | Stat grid forced 2-col, callout boxes stack vertically, two-col grids go single-col |
| `≤400px` | Hero ultra-compact, stat grid forced 1-col, hero stats stack vertically, minimal padding |
| `print` | Sidebar/hamburger/progress hidden, white background, no shadows, page-break-inside: avoid |

## JavaScript (inline at end of body)

### Required Interactions

1. **Hamburger toggle** — opens/closes sidebar and overlay on mobile
2. **Sidebar overlay** — click to close sidebar
3. **Close on link click** — sidebar closes when a nav link is clicked (mobile only)
4. **Progress bar** — scroll-based width% on `.progress-fill`
5. **Scroll spy** — IntersectionObserver highlights active `.sec-link` in sidebar
6. **Fade-in** — IntersectionObserver adds `.visible` to `.fade-in` sections

### JS Template

```javascript
/* Hamburger */
const hamburger=document.querySelector('.hamburger');
const sidebar=document.querySelector('.sidebar');
const overlay=document.querySelector('.sidebar-overlay');
function toggleSidebar(){
  sidebar.classList.toggle('open');
  hamburger.classList.toggle('open');
  overlay.classList.toggle('open');
}
hamburger.addEventListener('click',toggleSidebar);
overlay.addEventListener('click',toggleSidebar);
sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  if(window.innerWidth<=1024){
    sidebar.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
  }
}));

/* Progress bar */
const progressFill=document.querySelector('.progress-fill');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progressFill.style.width=(h>0?((window.scrollY/h)*100):0)+'%';
},{passive:true});

/* Scroll spy */
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.sidebar a.sec-link');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id=e.target.id;
      navLinks.forEach(l=>{
        l.classList.toggle('active',l.getAttribute('href')==='#'+id);
      });
    }
  });
},{rootMargin:'-20% 0px -70% 0px',threshold:0});
sections.forEach(s=>observer.observe(s));

/* Fade-in */
const fadeEls=document.querySelectorAll('.s');
const fadeObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('fade-in','visible');
      fadeObs.unobserve(e.target);
    }
  });
},{threshold:0.05});
fadeEls.forEach(el=>{el.classList.add('fade-in');fadeObs.observe(el)});
```

## MH1 Logo SVG (Inline)

### White version (for dark backgrounds: sidebar, footer)

```html
<svg width="100" height="36" viewBox="0 0 168 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="120" y="24" width="12" height="12" fill="white"/>
  <path d="M156 0V48H168V60H132V48H144V12H132V0H156Z" fill="url(#paint0_radial_ID)"/>
  <path d="M84 24H96V0H108V60H96V36H84V60H72V0H84V24Z" fill="white"/>
  <path d="M60 0V60H48V12H36V60H24V12H12V60H0V0H60Z" fill="white"/>
  <defs><radialGradient id="paint0_radial_ID" cx="0" cy="0" r="1"
    gradientTransform="matrix(36 60 -65.0006 6.77089 132 0)"
    gradientUnits="userSpaceOnUse">
    <stop stop-color="#FDDE3C"/><stop offset="1" stop-color="#FF5BFE"/>
  </radialGradient></defs>
</svg>
```

### Dark version (for light backgrounds: "Built by" section)

Same SVG but replace `fill="white"` with `fill="#0A0A0A"`.

**Important**: Use unique `id` values for each `<radialGradient>` when multiple logo instances appear on the same page (e.g., `paint0_radial_logo`, `paint0_radial_ft`, `paint0_radial_bm`).

## Deployment

Reports deploy to Vercel as static single-file sites:

1. Copy HTML to `deploy/index.html`
2. Run `vercel --yes --prod` from deploy folder
3. URL pattern: `{client}-audit-{date}.vercel.app`

## Checklist Before Delivery

- [ ] All `{{PLACEHOLDERS}}` replaced with real data
- [ ] `<title>` tag matches report title
- [ ] `<meta name="robots" content="noindex, nofollow">` present
- [ ] Sidebar links match all section `id` attributes
- [ ] All stat card values use `white-space: nowrap` (no line breaks)
- [ ] Tables with long content have `.tw` wrapper for horizontal scroll
- [ ] Hero stats show 3-5 key metrics at a glance
- [ ] "Built by MH-1" section reflects actual data sources used
- [ ] Footer date matches report date
- [ ] Gradient text (`.g`) used for: client name in hero, section labels, score highlights
- [ ] Callout boxes: icon and heading text are vertically aligned (`.co h4 { margin-top: 0 }`)
- [ ] Mobile: sidebar collapses, tables scroll, stat cards reflow
- [ ] Print: sidebar hidden, white background, sections avoid page breaks
