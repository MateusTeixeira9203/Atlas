---
name: react-review
description: Quick React/Next.js code review. Runs tsc and eslint on changed files, then applies the typescript-reviewer agent checklist. Covers security, type safety, async patterns, and React-specific issues.
cpe:
  source: ecc
  original_path: commands/react-review.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — references Atlas typescript-reviewer agent
  status: stub
---

# /react-review

Quick React/Next.js code review.

## Process

```bash
git diff -- '*.ts' '*.tsx'
npx tsc --noEmit
npx eslint . --ext .ts,.tsx
```

## Review Checklist (typescript-reviewer agent)

**CRITICAL:**
- [ ] `dangerouslySetInnerHTML` with user data
- [ ] `eval()` / `new Function()` with external input
- [ ] Hardcoded secrets

**HIGH — React:**
- [ ] Incomplete `useEffect` deps array
- [ ] Direct state mutation (`state.items.push(x)`)
- [ ] Missing error boundaries around async components
- [ ] `key` prop is array index (causes re-render issues)
- [ ] Server/client boundary leak (server code in client component)

**HIGH — Type Safety:**
- [ ] `any` type used without justification
- [ ] Non-null assertion `!` without prior guard

**HIGH — Async:**
- [ ] Unhandled promise rejections
- [ ] `forEach` with `async` callback

**MEDIUM:**
- [ ] `var` usage (use `const`/`let`)
- [ ] Loose equality `==` (use `===`)
- [ ] Missing explicit return types on public functions

## Output

```
React Review
─────────────
Files: 4 changed

CRITICAL: none
HIGH:
  src/components/UserList.tsx:34 — key prop is array index
  src/hooks/useData.ts:12 — unhandled promise rejection
MEDIUM: none

Verdict: ⚠️ WARN — 2 HIGH findings (non-blocking for draft PR)
```
