---
name: retro-quarterly-review
description: Bold editorial quarterly review presentation. 3 cinematic slides — cover, priorities triptych, roadmap+KPIs. Blue (#1B4B8A) + orange (#E8640C) editorial palette, cream paper sections, heavyweight slab headlines. Self-contained single HTML file. Premium wipe transitions.
cpe:
  source: open-design
  original_path: skills/html-ppt-retro-quarterly-review/SKILL.md
  original_url: https://github.com/nexu-io/open-design/tree/main/skills/html-ppt-retro-quarterly-review
  source_commit: 1cb7eae4
  license: Apache-2.0
  integrated_at: 2026-06-22
  adaptation: Documentado como TEMPLATE.md CPE
---

# Retro Quarterly Review

High-impact quarterly review presentation. 3 slides, bold editorial aesthetic, premium transitions. Deadline-ready.

## When to Use

Use when: "quarterly review", "Q1/Q2/Q3/Q4 deck", "roadmap presentation", "retro quarterly", "priorities slide"

Ideal for: company all-hands, team retrospectives, investor updates, OKR reviews.

## Activation Triggers

"retro quarterly review", "quarterly review template", "roadmap slide", "Q* review deck"

## Design System

### Colors

```css
:root {
  --blue:   #1B4B8A;   /* editorial navy */
  --orange: #E8640C;   /* accent — headlines, highlights */
  --cream:  #F4EFE8;   /* paper section backgrounds */
  --dark:   #1A1A1A;   /* near-black body text */
  --light:  #FFFFFF;   /* slide backgrounds */
  --muted:  #6B6B6B;   /* secondary text */
}
```

### Typography

```css
/* Slab serif for headlines — use Roboto Slab or Playfair Display */
h1 { font-family: 'Roboto Slab', serif; font-size: 96px; font-weight: 700; }
h2 { font-family: 'Roboto Slab', serif; font-size: 56px; font-weight: 700; }
/* Clean sans for body */
p  { font-family: 'Inter', system-ui, sans-serif; font-size: 24px; }
```

## Three-Slide Architecture (do not alter)

### Slide 1 — Cover

```
╔══════════════════════════════════════════════════════════════╗
║  COMPANY NAME                                       Q1 2026  ║
║──────────────────────────────────────────────────────────────║
║                                                              ║
║  [orange bar: 8px]                                           ║
║  Q1 2026                          [COMPANY LOGO]             ║
║  QUARTERLY                                                   ║
║  REVIEW                                                      ║
║                                                              ║
║  Presented by <Name>                                         ║
║  <Date>                                                      ║
╚══════════════════════════════════════════════════════════════╝
```

Structure: dark navy full-bleed, orange accent bar top-left, large slab title, logo right.

```html
<div class="slide active" style="background:var(--blue);color:#fff;padding:100px">
  <div style="border-left:8px solid var(--orange);padding-left:40px;margin-bottom:60px">
    <p style="font-size:28px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.7">Q1 2026</p>
    <h1 style="font-family:'Roboto Slab',serif;font-size:96px;line-height:1.05;color:#fff">
      QUARTERLY<br>REVIEW
    </h1>
  </div>
  <p style="font-size:24px;opacity:0.7">Presented by [Name] · [Date]</p>
</div>
```

### Slide 2 — Priorities (Triptych Grid)

```
╔═══════════════╦═══════════════╦═══════════════╗
║  [01]         ║  [02]         ║  [03]         ║
║  PRIORITY 1   ║  PRIORITY 2   ║  PRIORITY 3   ║
║               ║               ║               ║
║  Description  ║  Description  ║  Description  ║
║  of the first ║  of the       ║  of the third ║
║  priority.    ║  second.      ║  priority.    ║
║               ║               ║               ║
║  ▲ Status     ║  ● Status     ║  ▼ Status     ║
╚═══════════════╩═══════════════╩═══════════════╝
```

Cream (`#F4EFE8`) background, 3-column grid, numbered with orange digits.

```html
<div class="slide" style="background:var(--cream);padding:80px">
  <h2 style="font-family:'Roboto Slab',serif;color:var(--blue);font-size:40px;margin-bottom:60px;text-transform:uppercase;letter-spacing:0.1em">
    TOP PRIORITIES
  </h2>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px">
    <div style="background:#fff;padding:48px;border-top:4px solid var(--orange)">
      <p style="font-size:64px;font-weight:700;color:var(--orange);margin-bottom:8px">01</p>
      <h3 style="font-family:'Roboto Slab',serif;font-size:28px;color:var(--dark);margin-bottom:16px">Priority Title</h3>
      <p style="font-size:20px;color:var(--muted);line-height:1.6">Description of the priority and what it means for the quarter.</p>
    </div>
    <!-- repeat for 02, 03 -->
  </div>
</div>
```

### Slide 3 — Roadmap + KPIs

Two-panel layout: timeline left (60%), KPI stack right (40%).

```html
<div class="slide" style="background:#fff;padding:80px">
  <div style="display:grid;grid-template-columns:3fr 2fr;gap:64px">
    <!-- Left: Timeline -->
    <div>
      <h2 style="font-family:'Roboto Slab',serif;color:var(--blue);font-size:40px;margin-bottom:48px;text-transform:uppercase;letter-spacing:0.1em">ROADMAP</h2>
      <!-- Quarter rows -->
      <div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:32px">
        <div style="background:var(--orange);color:#fff;padding:8px 16px;font-weight:700;white-space:nowrap">Q1</div>
        <div>
          <p style="font-size:22px;font-weight:600;color:var(--dark)">Initiative Name</p>
          <p style="font-size:18px;color:var(--muted)">Supporting detail</p>
        </div>
      </div>
      <!-- Repeat for Q2, Q3, Q4 -->
    </div>
    <!-- Right: KPIs -->
    <div style="background:var(--blue);padding:48px;color:#fff">
      <h3 style="font-size:24px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:40px;opacity:0.7">KEY METRICS</h3>
      <div style="margin-bottom:32px">
        <p style="font-size:56px;font-weight:700;color:var(--orange)">87%</p>
        <p style="font-size:18px;opacity:0.8">Metric label</p>
      </div>
      <!-- repeat for 2-3 KPIs -->
    </div>
  </div>
</div>
```

## Transitions

```javascript
// Premium wipe transition between slides
function wipe(direction) {
  const current = document.querySelector('.slide.active');
  const next = direction > 0
    ? current.nextElementSibling || slides[0]
    : current.previousElementSibling || slides[slides.length - 1];

  next.style.transform = `translateX(${direction * 100}%)`;
  next.style.display = 'flex';
  requestAnimationFrame(() => {
    current.style.transition = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)';
    next.style.transition = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)';
    current.style.transform = `translateX(${-direction * 100}%)`;
    next.style.transform = 'translateX(0)';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.display = '';
      current.style.transform = '';
      current.style.transition = '';
      next.classList.add('active');
      next.style.transform = '';
      next.style.transition = '';
    }, 400);
  });
}
```

## Keyboard Shortcuts

- `←` / `→` — navigate slides
- `1` / `2` / `3` — jump directly to slide
- `R` — restart to slide 1

## Quality Checklist

Before delivering:
- [ ] Exactly 3 slides (cover, priorities, roadmap+KPIs)
- [ ] Single self-contained HTML file (no external dependencies)
- [ ] CSS variables used for all colors
- [ ] Wipe transitions smooth at 400ms
- [ ] Keyboard shortcuts work
- [ ] Orange accent consistent (`#E8640C`)
- [ ] Navy blue consistent (`#1B4B8A`)
- [ ] KPI numbers legible at full screen
