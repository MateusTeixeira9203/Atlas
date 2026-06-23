---
name: epic-review
description: Run a structured review of an epic's implementation before validate/publish. Invokes code-reviewer and security-reviewer agents on all changed files, checks tests, and produces a gate report.
cpe:
  source: ecc
  original_path: commands/epic-review.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from ECC; triggers Atlas review agents
  status: stub
---

# /epic-review

Comprehensive review gate for an epic before validation.

## Usage

```
/epic-review <issue-number>
/epic-review <path/to/epic.md>
```

## Process

1. **Identify changed files** — `git diff main...HEAD --name-only`
2. **Run code-reviewer agent** on all changed `.ts`/`.py`/`.go` files
3. **Run security-reviewer agent** on:
   - New API endpoints
   - Auth-related changes
   - Input handling changes
4. **Check test coverage** — invoke `/test-coverage`
5. **Build check** — must pass
6. **Consolidate findings**

## Review Gate

```
Epic Review: #42 — "Add OAuth2 authentication"
───────────────────────────────────────────────
Files reviewed: 12

code-reviewer:
  ✓ No CRITICAL findings
  ⚠ HIGH: src/auth/oauth.ts:45 — missing error handling on token refresh
  ⚠ HIGH: src/api/callback.ts:23 — potential timing attack on state validation

security-reviewer:
  ✓ No hardcoded secrets
  ✓ Auth middleware applied correctly
  ⚠ HIGH: OAuth state parameter not cryptographically random

Test Coverage:
  ✓ 83% overall (target: 80%)

Build: ✓

Verdict: BLOCKED — 3 HIGH findings must be resolved
         Run /epic-review again after fixing
```

## Pass Criteria

All of the following must be true:
- No CRITICAL findings from any reviewer
- No HIGH security findings
- Build passing
- Tests passing with ≥80% coverage
