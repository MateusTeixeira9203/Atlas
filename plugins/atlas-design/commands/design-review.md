---
name: design-review
description: Visual audit of a UI artifact. Delegates to ux-reviewer and design-polish agents for a full analysis covering WCAG AA accessibility, usability heuristics, AI-tell patterns, token consistency, and spacing. Outputs a structured report and BLOCK/WARN/APPROVE verdict.
cpe:
  source: cpe
  synthesis_sources:
    - open-design (Apache-2.0, commit 1cb7eae4)
    - anthropic-frontend (Apache-2.0, commit 545162ba)
  integrated_at: 2026-06-22
  adaptation: Atlas-authored command — orchestrates ux-reviewer + design-polish agents
---

# /design-review

Full visual and UX audit of a UI artifact.

## Usage

```
/design-review                    # review current project
/design-review src/components/    # review a specific directory
/design-review src/app/login/     # review a specific page
```

## Process

### 1. Discover Scope

```bash
# Find reviewable files
find ${TARGET:-.} -name "*.tsx" -o -name "*.html" -o -name "*.css" | head -50
```

### 2. Run UX Review

Invoke `ux-reviewer` agent for the discovered files.

Checks:
- WCAG 2.1 AA violations (CRITICAL)
- Nielsen usability heuristics (HIGH)
- Information architecture (HIGH)
- Responsive design (MEDIUM)
- Form design (MEDIUM)
- Empty/error/success states (LOW)

### 3. Run Design Polish Audit

Invoke `design-polish` agent in audit-only mode (read, don't edit).

Checks:
- AI-tell patterns (oversized radius, heavy shadows, gradient buttons)
- Token consistency (raw hex vs. design-system-tokens)
- Visual hierarchy (heading scale, weight, spacing)
- Motion (duration, easing, reduced-motion fallback)

### 4. Compile Report

```
Design Review — <target path>
══════════════════════════════════════════
[ux-reviewer findings]
[design-polish findings]

VERDICT: BLOCK | WARN | APPROVE
Blocking issues: <N>
Action required before:
  1. <specific fix>
  2. <specific fix>
```

### 5. Verdict Logic

| Verdict | Condition |
|---------|-----------|
| BLOCK | Any WCAG AA violation OR AI-tell pattern that significantly affects professionalism |
| WARN | No blockers, but MEDIUM+ findings present |
| APPROVE | No CRITICAL, no HIGH findings |

## Auto-fix Option

If the review finds only design quality issues (no WCAG failures), offer:

```
Found 3 design quality issues.
Run /polish to auto-fix them? (y/n)
```
