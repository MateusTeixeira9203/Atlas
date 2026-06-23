---
name: html-deck-framework
description: Self-contained HTML presentation framework. 1920×1080px, 16:9, keyboard navigation, CSS variable theming, localStorage slide position, PDF print support. The technical skeleton — apply a design theme on top (see kami-paper-deck or retro-quarterly-review for styled variants).
cpe:
  source: open-design
  original_path: templates/deck-framework.html
  original_url: https://github.com/nexu-io/open-design/blob/main/templates/deck-framework.html
  source_commit: 1cb7eae4
  license: Apache-2.0
  integrated_at: 2026-06-22
  adaptation: Normalizado como TEMPLATE.md com instruções de uso Atlas
---

# HTML Deck Framework

Bare-bones HTML presentation skeleton. Use this as the base for any slide deck, then apply a design system on top.

## When to Use

Use when: "create a slide deck", "presentation", "HTML slides", "pitch deck", "deck"

For a pre-styled variant:
- Editorial / paper aesthetic → use `kami-paper-deck`
- Bold quarterly review → use `retro-quarterly-review`

## Generation Instructions

Generate a single self-contained `index.html` file with this structure:

### Required CSS Variables

```css
:root {
  --bg:     #ffffff;   /* slide background */
  --fg:     #0f172a;   /* primary text */
  --accent: #6366f1;   /* accent color */
  --shell:  #1e293b;   /* navigation bar */
  --slide-w: 1920px;
  --slide-h: 1080px;
}
```

### Stage & Scaling (do not modify)

```css
.stage {
  width: var(--slide-w);
  height: var(--slide-h);
  transform-origin: top left;
  /* JS sets: transform: scale(<viewport/1920>) */
}

.slide {
  width: 100%;
  height: 100%;
  position: absolute;
  display: none;
}
.slide.active { display: flex; }
```

### Navigation Shell

```html
<div class="shell">
  <button id="prev">←</button>
  <span id="counter">1 / N</span>
  <button id="next">→</button>
</div>
```

### Required JavaScript

```javascript
// Navigation
const slides = document.querySelectorAll('.slide');
let current = parseInt(localStorage.getItem('slide') || '0');

function show(n) {
  slides.forEach(s => s.classList.remove('active'));
  current = Math.max(0, Math.min(n, slides.length - 1));
  slides[current].classList.add('active');
  document.getElementById('counter').textContent = `${current + 1} / ${slides.length}`;
  localStorage.setItem('slide', current);
}

document.getElementById('prev').onclick = () => show(current - 1);
document.getElementById('next').onclick = () => show(current + 1);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') show(current + 1);
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'Home') show(0);
  if (e.key === 'End') show(slides.length - 1);
});

// Responsive scaling
function scale() {
  const ratio = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  document.querySelector('.stage').style.transform = `scale(${ratio})`;
}
window.addEventListener('resize', scale);
scale();

// Init
show(current);
```

### Print/PDF CSS

```css
@media print {
  .shell { display: none; }
  .slide { display: flex !important; position: relative; page-break-after: always; }
  .stage { transform: none !important; width: 1920px; height: 1080px; }
}
```

## Slide Content Patterns

### Title Slide
```html
<div class="slide active">
  <div style="display:flex;flex-direction:column;justify-content:center;padding:120px">
    <p style="color:var(--accent);font-size:24px;margin-bottom:16px">CATEGORY</p>
    <h1 style="font-size:96px;line-height:1.1;font-weight:700">Main Title</h1>
    <p style="font-size:32px;color:gray;margin-top:24px">Subtitle or date</p>
  </div>
</div>
```

### Content Slide (3-column grid)
```html
<div class="slide">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:48px;padding:80px">
    <div>
      <h3>Column 1</h3>
      <p>Content</p>
    </div>
    <!-- repeat -->
  </div>
</div>
```

## Quality Checklist

Before delivering:
- [ ] All CSS in `<style>` — no external dependencies
- [ ] All JS inline — runs without a server
- [ ] Keyboard navigation works (←/→/Space/Home/End)
- [ ] Scaling maintains 16:9 on any viewport
- [ ] CSS variables are used for all colors
- [ ] Slide counter updates correctly
