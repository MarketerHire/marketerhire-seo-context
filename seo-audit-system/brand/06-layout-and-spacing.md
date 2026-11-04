# MH1HQ Layout & Spacing

## Spacing System

Use a consistent spacing scale based on multiples of 4px:

| Token  | Value  | Usage                                         |
| ------ | ------ | --------------------------------------------- |
| xs     | 4px    | Tight gaps (icon-to-label, inline elements)   |
| sm     | 8px    | Internal padding (buttons, tags, badges)      |
| md     | 16px   | Standard padding (cards, inputs, small gaps)  |
| lg     | 24px   | Section internal spacing                      |
| xl     | 40px   | Element-to-element gaps within sections       |
| 2xl    | 60px   | Section-to-section gaps                       |
| 3xl    | 100px  | Frame/canvas padding, major section breaks    |

---

## Canvas Dimensions

| Format            | Width  | Height | Aspect Ratio | Usage                        |
| ----------------- | ------ | ------ | ------------ | ---------------------------- |
| Standard HD       | 1920   | 1080   | 16:9         | Video, presentations, web    |
| Vertical / Reel   | 1080   | 1920   | 9:16         | Stories, reels, mobile-first |
| Square            | 1080   | 1080   | 1:1          | Social posts, thumbnails     |
| Web (fluid)       | —      | —      | —            | Responsive, max-width based  |

---

## Frame Padding

The outer padding between content and the canvas edge:

| Canvas Size   | Padding | Notes                              |
| ------------- | ------- | ---------------------------------- |
| 1920 x 1080   | 100px   | Standard breathing room            |
| 1080 x 1920   | 60px    | Tighter for vertical formats       |
| 1080 x 1080   | 80px    | Balanced for square                |
| Web           | 5-8vw   | Responsive percentage-based        |

---

## Alignment Principles

1. **Left-align text by default.** Center alignment only for short hero headlines or single-line callouts.
2. **Vertical rhythm matters.** Consistent spacing between elements creates a sense of order. Don't eyeball — use the spacing tokens.
3. **Grid-based layouts.** Use 12-column grids for web, simple halves/thirds for fixed-size canvases.
4. **Anchor to edges.** Position brand marks (logo, watermark) relative to canvas edges, not content.

---

## Content Density

| Zone          | Description                                       |
| ------------- | ------------------------------------------------- |
| Hero / Focus  | One headline + one supporting element. Max 30% fill.|
| Content       | 2-4 elements. Generous spacing. 50-60% fill.      |
| Data-dense    | Tables, grids, dashboards. Up to 70% fill.         |
| Watermark     | Logo + tagline. Always at edge. Minimal footprint. |

---

## Border Radius

| Context          | Radius  | Notes                          |
| ---------------- | ------- | ------------------------------ |
| Buttons          | 8px     | Softly rounded                 |
| Cards / Panels   | 12px    | Visible but not pill-shaped    |
| Avatars / Icons  | 50%     | Fully circular                 |
| Containers       | 4-8px   | Subtle rounding                |
| Tags / Badges    | 4px     | Barely rounded                 |

---

## Responsive Scaling

When adapting designs across canvas sizes, scale proportionally:

| Breakpoint   | Scale Factor | Notes                          |
| ------------ | ------------ | ------------------------------ |
| 1920px wide  | 1.0x         | Baseline reference             |
| 1080px wide  | 0.65x        | Reduce sizes proportionally    |
| 768px wide   | 0.5x         | Tablet / compact layouts       |
| 375px wide   | 0.35x        | Mobile                         |

Apply the scale factor to font sizes, spacing, and element dimensions. Don't just shrink — reorganize layout when needed (e.g., stack columns on mobile).
