---
name: scaffold
description: Generate a project artifact from a Atlas template. Lists available templates, asks which to apply, generates the output file(s) in the current project. Supports deck templates (html-deck-framework, kami-paper-deck, retro-quarterly-review) and workflow templates (agent-profiles).
cpe:
  source: cpe
  synthesis_sources:
    - open-design (Apache-2.0, commit 1cb7eae4)
    - ruflo (MIT, commit 9c28fe03)
  integrated_at: 2026-06-22
  adaptation: Atlas-authored command — orchestrates template generation
---

# /scaffold

Generate a project artifact from a Atlas template.

## Usage

```
/scaffold                           # interactive — lists templates
/scaffold deck                      # filter to deck templates
/scaffold kami                      # generate kami-paper-deck directly
/scaffold agent-profiles            # generate .claude/agent-profiles.yaml
/scaffold retro-quarterly-review    # generate the quarterly review deck
```

## Available Templates

### Decks

| Template | Use case |
|----------|----------|
| `html-deck-framework` | Bare-bones HTML slides (build on top) |
| `kami-paper-deck` | Paper/editorial aesthetic, serif, no-bold |
| `retro-quarterly-review` | Bold Q* review, 3 slides, orange+navy |

### Workflows

| Template | Use case |
|----------|----------|
| `agent-profiles` | Multi-agent config (dev/safe/ci profiles) |

## Process

### 1. Identify Template

If no template named in command: list options and ask.

```
Available templates:
  Decks:
    1. html-deck-framework  — bare HTML slide framework
    2. kami-paper-deck      — editorial, paper aesthetic
    3. retro-quarterly-review — bold quarterly review, 3 slides

  Workflows:
    4. agent-profiles — multi-agent coordination profiles

Which template? (1-4 or name)
```

### 2. Gather Context

Ask only what the template needs:

**For decks:** presentation title, author, date, number of slides needed, any custom color overrides?

**For agent-profiles:** which profiles (dev/safe/ci)? any project-specific blocked commands?

### 3. Generate Output

Apply the template's TEMPLATE.md instructions to generate the actual files:

| Template | Output |
|----------|--------|
| `html-deck-framework` | `deck.html` |
| `kami-paper-deck` | `deck.html` |
| `retro-quarterly-review` | `deck.html` |
| `agent-profiles` | `.claude/agent-profiles.yaml` |

Fill in all user-provided values. Use template defaults for anything not specified.

### 4. Quality Check

Run the template's quality checklist before delivering:
- For decks: verify CSS variables, no external dependencies, keyboard nav works
- For agent-profiles: verify no `.env` in allowed patterns, profile names correct

### 5. Commit

```bash
git add <generated-files>
git commit -m "scaffold: add <template-name>"
```

### 6. Report

```
Scaffolded: kami-paper-deck
──────────────────────────────
File:   deck.html (self-contained, 1 file)
Slides: 8 slides generated
Style:  parchment #f5f4ed, ink blue, Charter serif

Quality checklist: ✓ all passing

Next steps:
  - Edit slide content in deck.html
  - /design-review to audit before sharing
```
