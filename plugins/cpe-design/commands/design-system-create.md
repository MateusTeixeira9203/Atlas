---
name: design-system-create
description: Generate a complete design system from a DESIGN.md brief. Creates CSS tokens file, a component library starter (Button, Card, Input, Badge, Modal), and a tokens documentation page. Requires an existing DESIGN.md (run /design-brief first).
cpe:
  source: cpe
  synthesis_sources:
    - open-design (Apache-2.0, commit 1cb7eae4)
    - anthropic-frontend (Apache-2.0, commit 545162ba)
  integrated_at: 2026-06-22
  adaptation: CPE-authored command
---

# /design-system-create

Generate a design system from an existing DESIGN.md specification.

## Usage

```
/design-system-create                    # uses DESIGN.md in project root
/design-system-create --framework react  # react (default), vue, vanilla
/design-system-create --out src/design   # custom output directory (default: src/design)
```

## Prerequisites

Requires `DESIGN.md` in the project root. If missing: run `/design-brief` first.

## Process

### 1. Read Brief

Read `DESIGN.md` and extract all resolved tokens.

If `DESIGN.md` not found:
```
No DESIGN.md found. Run /design-brief first to create one.
```

### 2. Generate CSS Tokens File

Create `${OUT}/tokens.css`:

```css
/* Generated from DESIGN.md — do not edit manually */
:root {
  /* From design-system-tokens skill + project-specific values */
  --color-accent: <from DESIGN.md>;
  --color-accent-hover: <darkened by 10%>;
  ...all tokens from design-system-tokens skill...
}
[data-theme="dark"] { ...dark overrides... }
```

### 3. Generate Component Starters

For each component, create `${OUT}/components/<Name>.<ext>`:

**Button** — primary, secondary, ghost, danger variants. Loading state with spinner. All 6 interactive states.

**Card** — header, body, footer regions. Hover lift (shadow-sm → shadow-md). Optional image slot.

**Input** — text, email, password (with show/hide). Error state with aria-describedby. Label + helper text.

**Badge** — info, success, warning, error. Pill and rounded variants.

**Modal** — focus trap, esc to close, backdrop click to close, aria-labelledby. `data-open` attribute.

All components:
- Use only tokens from `tokens.css` — no raw values
- Include focus-visible style
- Include `@media (prefers-reduced-motion: reduce)` fallbacks

### 4. Generate Documentation Page

Create `${OUT}/index.html` — a living style guide showing:
- Color palette with token names
- Typography scale
- All components with interactive states
- Spacing scale visualization

### 5. Commit

```bash
git add ${OUT}/
git commit -m "design: generate design system from brief"
```

### 6. Report

```
Design System created
──────────────────────
Framework:  React (TypeScript)
Output:     src/design/

Generated:
  tokens.css         — 47 CSS custom properties
  components/
    Button.tsx       — 4 variants, 6 states
    Card.tsx         — 3 regions, hover lift
    Input.tsx        — text/email/password, error state
    Badge.tsx        — 4 colors, 2 shapes
    Modal.tsx        — accessible, focus-trapped
  index.html         — living style guide

Next: /design-review to verify the output
```
