---
name: kami-paper-deck
description: Paper-aesthetic HTML presentation template. Parchment background (#f5f4ed), ink-blue accent (≤5% surface), Charter/Georgia serif, no bold/italic — hierarchy from size and color only. Named "kami" (紙, paper in Japanese). Use for editorial, academic, or thoughtful content.
cpe:
  source: open-design
  original_path: templates/kami-deck.html
  original_url: https://github.com/nexu-io/open-design/blob/main/templates/kami-deck.html
  source_commit: 1cb7eae4
  license: Apache-2.0
  integrated_at: 2026-06-22
  adaptation: Extraído e documentado como TEMPLATE.md CPE
---

# Kami Paper Deck

Editorial slide deck with deliberate restraint. Parchment paper, ink-blue accent, serif type. No pure white. No bold. No gradient.

## When to Use

Use when: "paper aesthetic", "editorial deck", "minimal presentation", "academic slides", "kami deck", "parchment style"

Ideal for: research presentations, essays-as-slides, thoughtful product pitches, writing-heavy decks.

**NOT for**: data-heavy dashboards, energetic sales decks, product demos that need screenshots.

## Design System

### Colors

```css
:root {
  --bg:         #f5f4ed;  /* parchment — never pure white */
  --fg:         #2c2c2a;  /* warm off-black */
  --fg-muted:   #6b6960;  /* warm mid-gray */
  --fg-subtle:  #9b9990;  /* warm light gray */
  --accent:     #1B365D;  /* ink blue — use sparingly, ≤5% surface */
  --border:     #dddcd5;  /* warm border */
  --shell:      #1B365D;  /* navigation */
}
```

### Typography

```css
body {
  font-family: Charter, 'Bitstream Charter', Georgia, serif;
  font-weight: 400;       /* body weight only */
  color: var(--fg);
}
/* Hierarchy via SIZE and COLOR only. No bold. No italic. */
h1 { font-size: 80px; color: var(--fg); }
h2 { font-size: 48px; color: var(--fg); }
h3 { font-size: 32px; color: var(--accent); }  /* accent for section labels */
p  { font-size: 24px; line-height: 1.6; color: var(--fg-muted); }
```

### Restraint Rules

- No pure white (`#ffffff`) anywhere
- No bold text (use size/color for hierarchy)
- No italic text
- Accent color on ≤5% of visible surface per slide
- Max 2 type sizes per slide
- No gradients, no shadows heavier than `0 1px 3px rgba(0,0,0,0.06)`

## Slide Patterns

### Cover

```html
<div class="slide active" style="background:var(--bg)">
  <div style="display:flex;flex-direction:column;justify-content:center;padding:160px;max-width:1200px">
    <p style="font-size:20px;color:var(--accent);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:32px">
      SERIES · VOLUME I
    </p>
    <h1 style="font-size:88px;line-height:1.15;font-family:Charter,Georgia,serif;color:var(--fg)">
      The Title of This Work
    </h1>
    <div style="width:64px;height:1px;background:var(--accent);margin:48px 0"></div>
    <p style="font-size:26px;color:var(--fg-muted)">Author Name · Date</p>
  </div>
</div>
```

### Text-Forward Slide

```html
<div class="slide" style="background:var(--bg)">
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:80px;padding:100px">
    <div>
      <p style="font-size:20px;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px">
        SECTION TITLE
      </p>
      <h2 style="font-size:52px;line-height:1.25;margin-bottom:40px">The key point or argument</h2>
      <p style="font-size:24px;line-height:1.65;color:var(--fg-muted)">
        Explanatory text. Serif body type at 24px / 1.65 line-height.
        One idea per slide. Leave space.
      </p>
    </div>
    <div style="border-left:1px solid var(--border);padding-left:64px">
      <!-- Pull quote or supporting note -->
      <p style="font-size:28px;line-height:1.5;color:var(--fg-subtle);font-style:normal">
        "A pull quote goes here, set slightly smaller than the accent."
      </p>
    </div>
  </div>
</div>
```

### Three-Point Slide

```html
<div class="slide" style="background:var(--bg)">
  <div style="padding:100px">
    <p style="font-size:20px;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:48px">
      KEY POINTS
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:64px">
      <div style="border-top:1px solid var(--accent);padding-top:32px">
        <h3 style="font-size:28px;color:var(--fg);margin-bottom:16px">Point One</h3>
        <p style="font-size:20px;line-height:1.6;color:var(--fg-muted)">
          Supporting detail in muted tone.
        </p>
      </div>
      <!-- repeat for points 2 and 3 -->
    </div>
  </div>
</div>
```

## Navigation

Use the `html-deck-framework` TEMPLATE.md for the JS/navigation shell. The kami theme applies to the `<style>` block and slide content only.

## Quality Checklist

Before delivering:
- [ ] No pure white background on any slide
- [ ] Accent blue ≤ 5% surface per slide
- [ ] No `font-weight: 700` or `font-weight: bold`
- [ ] No `font-style: italic`
- [ ] All hierarchy from font-size and color, not weight
- [ ] Line lengths ≤ 65 chars for body text
- [ ] Parchment `#f5f4ed` used consistently
