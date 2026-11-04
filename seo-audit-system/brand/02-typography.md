# MH1HQ Typography

## Font Families

| Role      | Font            | Fallback Stack              | Usage                            |
| --------- | --------------- | --------------------------- | -------------------------------- |
| Primary   | **Inter**       | `system-ui, sans-serif`     | All body text, headings, UI      |
| Monospace | **Geist Mono**  | `monospace`                 | Code, data, technical labels     |
| Emergency | Arial           | `Helvetica, sans-serif`     | Fallback only — never choose this|

### Font Sources

- **Inter**: [Google Fonts](https://fonts.google.com/specimen/Inter) — variable weight (100–900)
- **Geist Mono**: [Vercel Geist](https://vercel.com/font) — variable weight

---

## Type Scale

This scale is resolution-independent. Apply it proportionally to your canvas size.

| Level       | Base Size | Weight  | Usage                                    |
| ----------- | --------- | ------- | ---------------------------------------- |
| Display     | 68px      | 700     | Hero headlines, splash screens           |
| Heading 1   | 52px      | 700     | Section titles, primary headings         |
| Heading 2   | 40px      | 600     | Sub-section headings                     |
| Heading 3   | 30px      | 600     | Card titles, feature headings            |
| Body        | 24px      | 400     | Paragraphs, descriptions                 |
| Caption     | 22px      | 400     | Supporting text, timestamps              |
| Label       | 18px      | 500     | Tags, badges, small UI elements          |
| Overline    | 14px      | 600     | Category labels, uppercase metadata      |

> **Note:** These sizes reference a 1920x1080 canvas. For web, scale proportionally (e.g. Display → 3.5rem, Body → 1.25rem). For mobile, reduce by ~30-40%.

---

## Font Weights in Use

| Weight | Name       | When to Use                              |
| ------ | ---------- | ---------------------------------------- |
| 400    | Regular    | Body text, descriptions, long-form       |
| 500    | Medium     | Labels, navigation, UI elements          |
| 600    | Semibold   | Subheadings, emphasis, branding text     |
| 700    | Bold       | Headlines, display text, strong emphasis |

---

## Letter Spacing

| Context         | Value    | Notes                                |
| --------------- | -------- | ------------------------------------ |
| Default         | `0`      | Inter has excellent default spacing  |
| Branding text   | `0.5px`  | Slightly open for brand presence     |
| Overlines       | `1.5px`  | Uppercase labels, category markers   |
| Display (large) | `-0.5px` | Tighten at very large sizes          |

---

## Line Height

| Context   | Value  | Notes                          |
| --------- | ------ | ------------------------------ |
| Headlines | 1.1    | Tight for impact               |
| Body text | 1.5    | Comfortable reading rhythm     |
| Captions  | 1.4    | Slightly tighter than body     |
| UI labels | 1.0    | Single-line elements           |

---

## Gradient Text Treatment

For emphasis headlines, apply the brand gradient as a text fill:

```css
background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Use this for:
- Primary headlines on dark backgrounds
- Feature titles and key callouts
- Brand name treatments

Don't use this for:
- Body text or paragraphs
- Small text (below 24px) — legibility drops
- Text on light backgrounds

---

## Typography Rules

1. **Inter is the brand typeface.** Use it for everything unless there's a specific technical reason to use Geist Mono.
2. **Never use more than 3 weight levels in a single composition.** Pick a primary weight and one or two for contrast.
3. **Gradient text is an accent, not a default.** Reserve it for one or two key elements per view.
4. **Respect the hierarchy.** Display > H1 > H2 > H3 > Body > Caption. Don't skip levels.
5. **White text on dark backgrounds.** Use `#ffffff` for primary text, `#d1d5db` for secondary, `#9ca3af` for muted.
