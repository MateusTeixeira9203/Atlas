---
name: quality-gate
description: Run a comprehensive quality gate check on one or all files. Validates formatting, linting, and type checking. Supports TypeScript (Biome/Prettier), Go (gofmt), Python (ruff). Does NOT include lint or type checks — those are separate.
cpe:
  source: ecc
  original_path: commands/quality-gate.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; adapted from hook-input format to direct invocation
---

# /quality-gate

Format check for one file or the whole project.

## Usage

```
/quality-gate                  — Check all files
/quality-gate src/auth.ts      — Check a specific file
/quality-gate --fix            — Auto-apply formatting fixes
/quality-gate --strict         — Fail on any formatting issue
```

## Supported Languages

| Language | Tool | Config |
|----------|------|--------|
| TypeScript / JavaScript | Biome or Prettier | `biome.json` / `.prettierrc` |
| Go | `gofmt` | built-in |
| Python | `ruff format` | `pyproject.toml` |
| Markdown / JSON | Prettier | `.prettierrc` |

> Note: TypeScript/JavaScript under Biome may skip this gate since post-edit formatting runs separately.

## Process

1. Detect formatter from config files
2. Run formatter in check mode (no writes unless `--fix`)
3. Report files with formatting issues
4. If `--fix`: apply and report changes
5. If `--strict`: exit non-zero on any issue

## Output

```
Quality Gate — Formatting Check
─────────────────────────────────
✓  src/auth/service.ts        (biome: clean)
✗  src/utils/format.ts        (biome: 3 issues)
     Line 12: trailing whitespace
     Line 45: missing semicolon
     Line 67: incorrect indentation
✓  src/db/migrations/          (gofmt: clean)

Summary: 1 file with issues
Run with --fix to auto-correct.
```

## Scope

This command checks **formatting only**.

For lint and type checking, use:
```
/build-fix         → fix type errors
npx tsc --noEmit   → type check
npx eslint .       → lint
```
