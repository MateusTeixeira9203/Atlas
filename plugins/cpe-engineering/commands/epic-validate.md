---
name: epic-validate
description: Validate that all acceptance criteria in a claimed epic are met. Checks task completion, runs tests, verifies builds, and produces a pass/fail validation report before epic-publish.
cpe:
  source: ecc
  original_path: commands/epic-validate.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from ECC; standalone validation workflow
  status: stub
---

# /epic-validate

Validate that a claimed epic meets all acceptance criteria before publishing.

## Usage

```
/epic-validate <issue-number>
/epic-validate <path/to/epic.md>
```

## Process

### 1. Load Acceptance Criteria

Read from `.claude/epics/<number>.md`:
- Task checklist: all items must be `- [x]`
- Acceptance criteria section: verify each criterion
- Definition of Done

### 2. Run Verification Suite

```bash
npm test              # or language equivalent
npm run build         # must succeed
npm run type-check    # must pass
```

### 3. Validate Criteria

For each acceptance criterion:
- Read the relevant code/test
- Verify the criterion is demonstrably met
- Flag any criterion that cannot be confirmed from code alone (requires manual verification)

### 4. Report

```
Epic Validation Report: #42 — "Add OAuth2 authentication"
──────────────────────────────────────────────────────────

Task Checklist: 7/7 complete ✓

Acceptance Criteria:
  ✓ Users can sign in with GitHub OAuth
  ✓ Existing email/password auth still works
  ✓ OAuth tokens stored securely (encrypted at rest)
  ⚠ Mobile compatibility — requires manual verification

Build: ✓ passing
Tests: 52 passing, 0 failing
Coverage: 83% (target: 80%) ✓

Verdict: READY for /epic-publish (1 criterion needs manual check)
```

## Fail Conditions

Validation FAILS (do not publish) if:
- Any task unchecked
- Build failing
- Tests failing
- Coverage below 80%
- Any CRITICAL acceptance criterion unverified

## Next Step

On pass: `/epic-publish <number>`
On fail: fix the failing items, re-run `/epic-validate`
