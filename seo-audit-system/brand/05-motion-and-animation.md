# MH1HQ Motion & Animation

## Animation Philosophy

MH1HQ motion is **smooth, natural, and purposeful**. Animations use spring physics to feel organic rather than mechanical. Motion guides attention, reveals content, and adds polish — never just decoration.

---

## Spring Configurations

Spring-based animation is the default. These three presets cover most needs:

| Preset     | Damping | Stiffness | Feel                  | Usage                            |
| ---------- | ------- | --------- | --------------------- | -------------------------------- |
| Smooth     | 200     | —         | Slow, elegant glide   | Page transitions, hero reveals   |
| Balanced   | 80      | 120       | Controlled, confident | Cards, panels, section reveals   |
| Bouncy     | 12      | 100       | Energetic, playful    | Icons, badges, small elements    |

> Use **Smooth** as the default. Reserve **Bouncy** for micro-interactions and moments of delight.

---

## Core Animation Patterns

### Fade In

Content appears by transitioning from transparent to opaque, optionally combined with directional movement.

| Direction | Starting Offset | Usage                          |
| --------- | --------------- | ------------------------------ |
| Up        | +30px Y         | Default for most content       |
| Down      | -30px Y         | Top-anchored elements          |
| Left      | +30px X         | Side-panel reveals             |
| Right     | -30px X         | Secondary content entrance     |
| None      | 0               | Overlays, backgrounds          |

Duration: 15–25 frames at 30fps (0.5–0.8 seconds)

### Scale In

Element grows from a smaller size to its final size with spring physics.

- Start scale: `0.6` to `0.8`
- End scale: `1.0`
- Use **Bouncy** spring for impact
- Best for: icons, avatars, data points, badges

### Gradient Reveal

The brand gradient sweeps across text or a shape:
- Text appears character-by-character or word-by-word
- Gradient fills from left to right
- Duration: 20–30 frames

### Floating / Ambient

Continuous subtle movement for background or decorative elements:
- Motion: sine wave, ~3-5px amplitude
- Speed: very slow (period of 3–5 seconds)
- Use for: background shapes, decorative orbs, particle effects

---

## Transition Patterns

### Between Sections / Scenes

| Type   | Description                      | Duration    | Usage                |
| ------ | -------------------------------- | ----------- | -------------------- |
| Fade   | Opacity crossfade                | 10–15 frames| Default transition   |
| Blur   | Gaussian blur in → content → out | 15–20 frames| Premium transitions  |
| Slide  | Directional slide with fade      | 15 frames   | Sequential content   |

### Staggered Reveals

When multiple items appear together (list items, grid cards, features):
- Stagger delay: 3–5 frames between each item
- Same animation for all items (consistency)
- Max stagger group: 6–8 items before it feels slow

---

## Timing Guidelines

| Context          | FPS  | Notes                                    |
| ---------------- | ---- | ---------------------------------------- |
| Standard video   | 30   | Default for most compositions            |
| Smooth animation | 60   | When motion quality is critical          |
| Web/UI           | 60   | Browser animation target                 |

### Easing (for non-spring contexts)

| Name      | CSS Value                   | Usage                    |
| --------- | --------------------------- | ------------------------ |
| Ease Out  | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering view |
| Ease In   | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving view  |
| Ease Both | `cubic-bezier(0.4, 0, 0.2, 1)`| General transitions   |

---

## Motion Rules

1. **Every animation needs a reason.** If it doesn't guide attention or reveal information, remove it.
2. **Spring physics > CSS easing** wherever the platform supports it.
3. **Consistent direction.** Content enters from bottom-up by default. Don't mix entry directions randomly.
4. **Stagger, don't synchronize.** Multiple items appearing at exactly the same time looks robotic. Add a slight delay between them.
5. **Respect reduced-motion preferences.** On web, honor `prefers-reduced-motion` by replacing animations with simple fades or instant reveals.
6. **Fast > slow.** When in doubt, make animations shorter. A 0.3s animation that feels snappy beats a 1.5s animation that feels sluggish.
