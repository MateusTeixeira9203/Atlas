---
name: prp-implement
description: Execute a PRP plan produced by /prp-plan. Reads the plan from .claude/plans/, implements tasks one at a time with validation after each, and runs the test suite on completion. Requires an approved plan first.
cpe:
  source: ecc
  original_path: commands/prp-implement.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /prp-implement

Execute a PRP plan produced by `/prp-plan`.

## Usage

```
/prp-implement <plan-name>     — Execute a named plan
/prp-implement                 — List available plans and choose
```

## Prerequisites

- A plan file exists at `.claude/plans/<plan-name>.md`
- Plan has been reviewed and approved by the user
- Tests are passing before implementation starts

## Process

### 1. Load Plan

Read `.claude/plans/<plan-name>.md`. Confirm the plan is approved (ask if unclear).

### 2. Implement Task by Task

For each task in the plan:
1. Read the mandatory reading files
2. Study the pattern examples
3. Implement the minimal code that satisfies the task
4. Run the validation check for that task
5. Mark task `[x]` in the plan
6. Commit: `git commit -m "task: <task-description>"`
7. Proceed to next task

### 3. Confirmation Gates

Pause and ask for confirmation before:
- Deleting files
- Changing public APIs
- Modifying database schemas
- Any task marked HIGH risk

### 4. Final Verification

```bash
npm test          # all tests must pass
npm run build     # must succeed
npm run type-check
```

### 5. Acceptance Checklist

Review the acceptance checklist from the plan. Mark each criterion as met or flag for manual verification.

## Task Format in Plan

```markdown
1. [x] Create provider_tokens table migration
   Validation: migration runs clean, table exists in schema
   
2. [ ] Implement OAuthService
   Validation: unit tests pass for token exchange flow
```

## Error Handling

If a task fails validation:
1. Diagnose the issue
2. Fix it before moving to the next task
3. If fix requires changing a previous task's output: note the change, re-validate that task
4. Never proceed with failing validation
