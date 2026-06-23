---
name: orch-fix-defect
description: Orchestrated defect fix workflow. Diagnoses the root cause, writes a failing test that catches it, fixes the implementation, verifies the fix doesn't regress, and creates a PR. Enforces Red-before-Green.
cpe:
  source: ecc
  original_path: commands/orch-fix-defect.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — invokes Atlas agents
  status: stub
---

# /orch-fix-defect

Orchestrated bug fix with TDD enforcement.

## Usage

```
/orch-fix-defect "<bug description>"
/orch-fix-defect <issue-number>         — From a GitHub issue
```

## Workflow

```
1. Diagnose  → locate root cause in code
2. RED       → write failing test that catches the bug
3. GREEN     → fix the implementation
4. VERIFY    → all tests pass, regression check
5. Review    → security-reviewer if security-related
6. /pr       → create fix PR
```

## Step 1 — Diagnose

1. Reproduce the bug if reproducible
2. Read the stack trace / error message
3. Trace execution: from entry point to failure point
4. Identify root cause (the actual broken invariant)
5. Document findings

## Step 2 — Write Failing Test (RED)

```
tdd-guide agent: write a test that catches the exact bug
```

The test must:
- Fail with the current code (proving it captures the bug)
- Be at the right abstraction level (unit if isolated, integration if cross-module)
- Be named clearly: `test_<what_should_happen>_<when_condition>`

## Step 3 — Fix (GREEN)

Apply the minimal fix that makes the test pass. No additional refactoring — that's a separate PR.

## Step 4 — Verify

```bash
npm test         # must pass including new test
npm run build    # must succeed
```

Check for regressions in related functionality.

## Step 5 — Review (if security-related)

If the bug involves auth, input validation, or data exposure: invoke `security-reviewer`.

## Step 6 — PR

```
fix(<scope>): <what was broken and how it was fixed>

Closes: #<issue-number>
Root cause: <one line>
Fix: <one line>
Test: <test file:line>
```
