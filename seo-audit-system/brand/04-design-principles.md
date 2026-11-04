# MH1HQ Design Principles

## Brand Positioning

**MH1HQ is an AI-native marketing platform.** The visual identity should communicate:

- **Intelligence** — Sophisticated, precise, data-driven
- **Modernity** — Cutting-edge technology, forward-thinking
- **Trust** — Clean, professional, reliable
- **Energy** — Dynamic, vibrant, not sterile

---

## Core Aesthetic: Dark, Gradient, Minimal

### 1. Dark Mode First

Every surface starts dark. The brand lives on deep navy backgrounds (`#0a0e1a`), not white. This:
- Conveys tech sophistication
- Makes the purple-pink gradient pop
- Reduces visual fatigue in long sessions
- Positions MH1HQ as a tool for professionals

Light mode exists as an accommodation, not the default. When a light variant is needed, use `#ffffff` backgrounds with dark text (`#171717`) and maintain the purple-pink accents.

### 2. Gradient as Identity

The purple-to-pink gradient (`#7c3aed → #ec4899`) is the single most recognizable element of the brand. It appears:
- As text fills on key headlines
- As button/CTA backgrounds
- As decorative accent bars and shapes
- As subtle glows and highlights

**One gradient per view is the maximum for primary use.** Additional instances should be subtler (lower opacity, smaller scale).

### 3. Minimal & Intentional

- **Whitespace (dark space) is a design element.** Don't fill every pixel.
- **One focal point per section.** Guide the eye, don't scatter attention.
- **Typography does the heavy lifting.** The type scale and weight hierarchy create structure — not boxes, lines, or decorative elements.
- **Every element earns its place.** If removing something doesn't hurt comprehension, remove it.

---

## Visual Hierarchy Rules

1. **Gradient text** = highest emphasis (use sparingly)
2. **White bold text** = primary content
3. **Gray text** (`#d1d5db`) = supporting content
4. **Muted text** (`#9ca3af`) = metadata, captions
5. **Functional colors** = status only (green/red/orange/blue)

---

## Depth & Layering

Create depth through **background layering**, not drop shadows:

```
Layer 0 (canvas):    #0a0e1a — Base dark
Layer 1 (surface):   #1a1f2e — Cards, panels
Layer 2 (elevated):  #28282e — Modals, popovers
```

Subtle borders (`rgba(255,255,255,0.1)`) or 1px lines can separate layers when needed. Avoid heavy borders or outlines.

---

## Imagery & Iconography

- **Icons**: Line-style, minimal. White or muted gray on dark backgrounds. Colored only when representing a specific module/category.
- **Screenshots & UI previews**: Show in dark mode. Frame with subtle rounded corners and a thin border.
- **Photography**: Not a primary element. When used, apply a dark overlay to maintain brand consistency.
- **Illustrations**: Abstract, geometric. Use brand colors. Avoid cartoonish or overly playful styles.

---

## Tone of Voice (Visual)

| Do                                      | Don't                                    |
| --------------------------------------- | ---------------------------------------- |
| Clean, confident compositions           | Cluttered layouts with competing elements|
| Subtle, purposeful animation            | Flashy, distracting effects             |
| Data-forward presentations              | Vague or decorative-only visuals        |
| Professional tech aesthetic             | Startup-casual or overly corporate      |
| Bold gradient accents on dark canvases  | Rainbow palettes or flat pastel themes  |

---

## Format-Agnostic Application

These principles apply universally:

- **Web pages**: Dark backgrounds, gradient CTAs, Inter typography, layered card layouts
- **Videos**: Dark backdrops, gradient text reveals, spring-based animations
- **Presentations**: Dark slides, minimal text per slide, gradient accent bars
- **Social media**: Dark cards, gradient text overlays, consistent watermark
- **Documentation**: Dark code blocks, brand-colored syntax highlighting
- **Print**: Reverse the model — white backgrounds with purple-pink gradient accents, dark text

The aesthetic should be **instantly recognizable as MH1HQ** regardless of medium.
