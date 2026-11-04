# MH1HQ Color Palette

## Primary Brand Colors

These two colors define the MH1HQ identity. They appear as the signature gradient and as standalone accents.

| Name   | Hex       | RGB              | Usage                                    |
| ------ | --------- | ---------------- | ---------------------------------------- |
| Purple | `#7c3aed` | `124, 58, 237`   | Primary accent, gradient start, CTAs     |
| Pink   | `#ec4899` | `236, 72, 153`   | Secondary accent, gradient end, highlights|

### Primary Gradient

```
direction: 135deg
start:     #7c3aed (0%)
end:       #ec4899 (100%)
```

Use this gradient for:
- Headlines and emphasis text (via background-clip)
- Call-to-action buttons and interactive elements
- Decorative bars, dividers, and accent shapes
- Icon backgrounds and badge fills

---

## Background Colors

MH1HQ is a **dark-mode-first** brand. These backgrounds create depth through layering.

| Name          | Hex       | RGB             | Usage                          |
| ------------- | --------- | --------------- | ------------------------------ |
| Base Dark     | `#0a0e1a` | `10, 14, 26`    | Primary canvas / outermost bg  |
| Surface       | `#1a1f2e` | `26, 31, 46`    | Cards, panels, secondary layer |
| Elevated      | `#28282e` | `40, 40, 46`    | Modals, tooltips, inputs       |
| Deep Dark     | `#0a0a0f` | `10, 10, 15`    | Alternate base for contrast    |
| Panel Dark    | `#212126` | `33, 33, 38`    | Sidebars, toolbars             |

### Background Gradient

```
direction: 180deg (top to bottom)
start:     #0a0e1a (0%)
end:       #1a1f2e (100%)
```

---

## Text Colors

| Name       | Hex       | Opacity Equiv.      | Usage                         |
| ---------- | --------- | ------------------- | ----------------------------- |
| Primary    | `#ffffff` | 100% white          | Headlines, body text on dark  |
| Secondary  | `#d1d5db` | ~83% white          | Subheadings, descriptions     |
| Muted      | `#9ca3af` | ~60% white          | Captions, labels, metadata    |
| Foreground | `#ededed` | (dark mode default) | General content text          |

---

## Functional / UI Colors

Used for status indicators, data visualization, categorization, and interactive states.

| Name    | Hex       | RGB              | Usage                              |
| ------- | --------- | ---------------- | ---------------------------------- |
| Blue    | `#3b82f6` | `59, 130, 246`   | Links, info states, video content  |
| Green   | `#10b981` | `16, 185, 129`   | Success, growth, positive metrics  |
| Red     | `#ef4444` | `239, 68, 68`    | Error, alerts, urgent states       |
| Orange  | `#f97316` | `249, 115, 22`   | Warnings, mid-priority items       |
| Cyan    | `#06b6d4` | `6, 182, 212`    | Informational, cool accents        |
| Yellow  | `#eab308` | `234, 179, 8`    | Attention, highlights              |

### Accent Focus Blue

| Name         | Hex       | Usage                                   |
| ------------ | --------- | --------------------------------------- |
| Focus Accent | `#0b84f3` | Focus rings, active input borders       |

---

## Overlay & Transparency

| Token              | Value                        | Usage                    |
| ------------------ | ---------------------------- | ------------------------ |
| Scrollbar Track    | `rgba(255, 255, 255, 0.04)`  | Subtle track background  |
| Scrollbar Thumb    | `rgba(255, 255, 255, 0.2)`   | Scrollbar handle         |
| Text Shadow (deep) | `0 2px 4px rgba(0,0,0,0.8)`  | Text over images/video   |
| Text Shadow (glow) | `0 0 10px rgba(0,0,0,0.5)`   | Secondary shadow layer   |

---

## Color Usage Rules

1. **Never use pure black `#000000` as a background.** Always use the brand dark navies (`#0a0e1a` or `#0a0a0f`) for warmth and depth.
2. **The purple-to-pink gradient is the brand signature.** Don't swap the direction or substitute other colors into it.
3. **Use functional colors only for their intended purpose.** Green = success, Red = error, etc. Don't use them decoratively.
4. **Maintain contrast.** White text on the dark backgrounds. Muted gray for secondary info. Never place muted text on elevated surfaces without checking legibility.
5. **Layer backgrounds for depth.** Use Base Dark → Surface → Elevated to create visual hierarchy, not just color differences.
