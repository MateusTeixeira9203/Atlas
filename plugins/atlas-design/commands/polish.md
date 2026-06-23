---
name: polish
description: Final design polish pass. Delegates to design-polish agent to remove AI-tell patterns, fix token consistency, normalize spacing, and add purposeful motion. Use before any UI ships. Reports a before/after summary of changes made.
cpe:
  source: cpe
  synthesis_sources:
    - open-design (impeccable-design-polish, Apache-2.0, commit 1cb7eae4)
  integrated_at: 2026-06-22
  adaptation: Atlas-authored command — wraps design-polish agent
---

# /polish

Final design polish pass. Removes AI tells, tightens quality.

## Usage

```
/polish                    # polish entire project
/polish src/components/    # polish a specific directory
/polish src/app/page.tsx   # polish a specific file
```

## Process

### 1. Pre-check

If no `DESIGN.md` in project root:
```
No DESIGN.md found. Token replacements will use design-system-tokens defaults.
Continue anyway? (y/n)
```

### 2. Delegate to design-polish Agent

Invoke `design-polish` agent on the target path.

The agent will:
1. Scan for AI-tell patterns
2. Audit visual hierarchy
3. Check token consistency
4. Normalize spacing to 4px grid
5. Audit motion (duration, easing, reduced-motion)
6. Apply fixes in priority order

### 3. Commit Changes

For each category fixed, create a focused commit:
```bash
git commit -m "style: polish — remove AI tells"
git commit -m "style: polish — normalize tokens"
git commit -m "style: polish — fix spacing grid"
git commit -m "style: polish — refine motion"
```

### 4. Report

```
Design Polish Complete
───────────────────────
Files modified: 7

AI Tells removed (HIGH):
  ✓ 2 heavy box-shadows → subtle (shadow-sm)
  ✓ 1 gradient button → flat with hover state
  ✓ 3 oversized border-radius → 8px (radius-md)

Token consistency (HIGH):
  ✓ 5 raw hex colors → design-system-tokens vars
  ✓ 2 arbitrary spacing values → 4px grid

Motion refinement (LOW):
  ✓ 2 hover transitions added (150ms ease-out)
  ✓ prefers-reduced-motion rule added to globals

No accessibility regressions detected.
```

## When NOT to Use

- Do not run on generated files (build output, minified CSS)
- Do not run if `DESIGN.md` specifies intentional deviations (e.g., a deliberately retro aesthetic)
- If a specific AI-tell is intentional (e.g., gradient as brand element), note it in `DESIGN.md` before running
