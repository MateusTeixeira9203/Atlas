---
name: build-fix
description: Systematically resolve build errors, type errors, and compilation failures. Reads errors, groups by dependency order, fixes one at a time, verifies after each fix. Stops if a fix introduces more errors than it resolves.
cpe:
  source: ecc
  original_path: commands/build-fix.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; removed ECC-specific tooling references
---

# /build-fix

Systematically resolve build, type, and compilation errors.

## Detection

Auto-detect build system from project files:
- `tsconfig.json` → `npx tsc --noEmit`
- `Cargo.toml` → `cargo build`
- `pom.xml` / `build.gradle` → `mvn compile` / `./gradlew build`
- `go.mod` → `go build ./...`

## Process

1. **Run diagnostics** — collect all errors
2. **Group by file** in dependency order (fix upstream errors first)
3. For each error:
   - Read the file with context
   - Diagnose root cause
   - Apply minimal fix
   - Run build again to verify
   - If ✓ resolved: proceed to next
   - If ✗ same error after 3 attempts: STOP, report
4. **Report** — resolved vs. remaining errors

## Minimal Fix Principle

> Choose minimal diffs over refactoring.

Each fix must:
- Change only what resolves the error
- Not introduce new patterns
- Not refactor surrounding code

## Stop Conditions

Stop immediately and report to user if:
- A fix introduces **more errors than it resolves**
- Same error persists after **3 attempts**
- Fix requires **structural changes** (extract module, change API signature)
- Missing dependency needs **installation**

## Common Fix Patterns

| Error | Approach |
|-------|---------|
| Missing module | Verify package is installed; check import path |
| Type mismatch | Compare type definitions; add type assertion if safe |
| Circular import | Analyze import graph; extract shared type to separate module |
| Unimplemented interface | Add missing methods with minimal implementation |
| Undefined identifier | Check scope; check for missing import |

## After Completion

```
Build Fix Summary
─────────────────
Resolved: 8 errors
Remaining: 2 (require structural changes — see below)

Remaining errors:
1. src/api/router.ts:45 — circular dependency api ↔ auth
   Action needed: extract shared types to src/types/auth.ts
```
