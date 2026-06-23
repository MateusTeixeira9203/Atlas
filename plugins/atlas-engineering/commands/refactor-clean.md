---
name: refactor-clean
description: Invoke the refactor-cleaner agent to find and safely remove dead code, unused exports, and unused dependencies. Reports findings by risk level and requires confirmation before removal.
cpe:
  source: ecc
  original_path: commands/refactor-clean.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: references Atlas refactor-cleaner agent
---

# /refactor-clean

Find and safely remove dead code, unused exports, and dependencies.

## Usage

```
/refactor-clean              — Full analysis + removal
/refactor-clean --dry-run    — Analysis only, no changes
```

## Process

Invokes the `refactor-cleaner` agent:

```bash
# Analysis
npx knip                              # unused files, exports, deps
npx depcheck                          # unused npm packages
npx ts-prune                          # unused TypeScript exports
npx eslint --report-unused-disable-directives
```

Findings are categorized:
- **SAFE** — remove immediately
- **CAREFUL** — verify before removing (possible dynamic imports)
- **RISKY** — needs architectural review

## Confirmation Gate

For each category, display findings and ask for confirmation before removing:

```
Refactor Clean Analysis
────────────────────────
SAFE to remove:
  - 3 unused npm packages (lodash, moment, uuid)
  - 7 unused TypeScript exports
  
CAREFUL (verify first):
  - 2 files possibly unused (check dynamic imports)
  
RISKY (skip for now):
  - 1 function referenced from external package

Proceed with SAFE removals? [y/n]
```

## Removal Order

1. Unused npm dependencies → `npm uninstall <pkg>`
2. Unused exports → remove with Edit
3. Unused files → delete after grepping for all references
4. Duplicate implementations → merge, update imports

Test and build after each category.

## Report

```
Refactor Clean Summary
───────────────────────
Removed: 3 npm packages, 7 exports, 2 files
Bundle size: 245KB → 198KB (-19%)
Tests: ✓ all passing
Build: ✓ clean
```
