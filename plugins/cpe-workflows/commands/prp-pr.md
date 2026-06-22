---
name: prp-pr
description: Create a PR for a completed PRP implementation. Generates a PR description from the plan's acceptance criteria and task list. Validates all tasks are complete and all criteria are met before creating the PR.
cpe:
  source: ecc
  original_path: commands/prp-pr.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /prp-pr

Create a PR for a completed PRP implementation.

## Usage

```
/prp-pr <plan-name>
```

## Prerequisites

- All tasks in the plan are `[x]` (completed)
- Build passing
- Tests passing

## Process

1. **Load plan** from `.claude/plans/<plan-name>.md`

2. **Validate completeness**:
   - All tasks checked
   - Acceptance checklist verified
   - Build and tests passing

3. **Generate PR description** from the plan:

```markdown
## Summary
<from plan objective>

## Changes
<from completed tasks list>

## Acceptance Criteria
- [x] Criterion 1 — verified in src/auth/service.ts
- [x] Criterion 2 — verified by E2E test
- [⚠] Criterion 3 — requires manual verification

## Testing
<from plan testing strategy>

## Plan Reference
.claude/plans/<plan-name>.md
```

4. **Run** `/pr` to create the PR with the generated description

5. **Archive plan**: move to `.claude/plans/archive/<plan-name>-DONE.md`

## Validation Gate

Stops if:
- Any task unchecked (`[ ]`)
- Build failing
- Tests failing
- Any acceptance criterion marked as unverified without explanation
