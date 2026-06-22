---
name: react-build
description: Diagnose and fix React/Next.js build errors. Runs tsc, eslint, and the project build command. Handles TypeScript errors, missing imports, and bundle size issues.
cpe:
  source: ecc
  original_path: commands/react-build.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /react-build

Diagnose and fix React/Next.js build errors.

## Diagnostics

```bash
npx tsc --noEmit                 # type errors
npx eslint . --ext .ts,.tsx      # lint errors
npm run build                    # full build
npx next build                   # Next.js specific
```

## Common Errors

| Error | Fix |
|-------|-----|
| `Cannot find module` | Check import path; verify file exists; update tsconfig paths |
| Type error on component prop | Add proper prop type or fix the type |
| `useEffect` dependencies warning | Add all used variables to deps array |
| `Page` cannot be found | Check file/directory name matches route |
| `Hydration failed` | Ensure server and client render the same HTML |
| Bundle too large | Code-split with `dynamic(() => import(...))` |

## Next.js Specifics

```bash
# Analyze bundle
ANALYZE=true npm run build

# Check server/client split
npx next build --debug
```

Server components cannot use:
- `useState`, `useEffect`, `useContext`
- Browser APIs (window, document)

Client components add `'use client'` directive.

## Auto-Fix

```bash
npx eslint . --fix --ext .ts,.tsx   # fix auto-fixable lint issues
```

## Report

```
React Build Fix
────────────────
TypeScript: 3 errors fixed
ESLint: 8 warnings (2 auto-fixed)
Build: ✓ passing
Bundle: 185KB gzipped ✓ (under 200KB threshold)
```
