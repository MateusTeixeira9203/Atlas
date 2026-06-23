---
name: design-brief
description: Create a DESIGN.md specification from a design brief. Accepts I-Lang structured briefs or natural language descriptions. Resolves 8 design dimensions (palette, accent, typography, layout, mood, density, constraints) and outputs DESIGN.md + brief-preview.html.
cpe:
  source: open-design
  original_path: skills/design-brief/SKILL.md
  original_url: https://github.com/nexu-io/open-design/tree/main/skills/design-brief
  source_commit: 1cb7eae4
  license: Apache-2.0
  integrated_at: 2026-06-22
  adaptation: adapted from skill to command — adds file output and git commit
---

# /design-brief

Create a DESIGN.md specification from a brief.

## Usage

```
/design-brief "A dark professional dashboard for a fintech product"
/design-brief palette=ocean-dark accent=cyan-400 body=inter layout=dashboard mood=professional density=compact
```

## Process

### 1. Parse Brief

Apply `design-brief` skill to resolve all 8 dimensions from the input.

For natural language: map to closed vocabulary using the skill's lookup table.  
For I-Lang: validate all values against the closed vocabulary.

If any value is not in the vocabulary: ask for clarification. Do NOT invent values.

### 2. Resolve Defaults

For unspecified dimensions, apply defaults from the skill and list them explicitly at the end (transparency requirement).

### 3. Generate DESIGN.md

Create `DESIGN.md` in the project root with the 9-section template from the skill:

1. Visual Theme
2. Color Palette (all hex values)
3. Typography (stacks + scale)
4. Spacing & Layout
5. Components
6. Motion
7. Voice & Tone
8. Do's and Don'ts (anti-AI tells for this palette)
9. Agent Prompt Guidelines

End with `## Resolved from Defaults` listing all auto-resolved dimensions.

### 4. Generate brief-preview.html

Create `brief-preview.html` in the project root rendering:
- Color swatches with token names and hex values
- Typography specimens at each scale step
- Spacing ruler
- Sample button, card, and form in the resolved style

### 5. Commit

```bash
git add DESIGN.md brief-preview.html
git commit -m "design: add design brief — <palette>/<mood>/<layout>"
```

### 6. Report

```
Design Brief created
─────────────────────
Palette:    ocean-dark
Accent:     cyan-400 (#22d3ee)
Body font:  Inter
Display:    Plus Jakarta Sans
Layout:     dashboard
Mood:       professional
Density:    compact
Constraints:(none)

Resolved from defaults: display, constraints

Files created:
  DESIGN.md          — 9-section design specification
  brief-preview.html — visual preview of resolved tokens
```
