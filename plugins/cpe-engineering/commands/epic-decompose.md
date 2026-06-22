---
name: epic-decompose
description: Break a claimed epic into ordered implementation tasks with dependencies. Extracts the task checklist from the epic, assesses complexity, sequences tasks, and writes a phase plan to .claude/epics/<number>.md.
cpe:
  source: ecc
  original_path: commands/epic-decompose.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from GitHub coordination script to standalone markdown workflow
---

# /epic-decompose

Break a claimed epic into ordered implementation tasks.

## Usage

```
/epic-decompose <issue-number>       — Decompose a GitHub issue epic
/epic-decompose <path/to/epic.md>    — Decompose a local epic file
```

## Prerequisites

Epic must be claimed via `/epic-claim` first.

## Process

### 1. Load Epic

Read `.claude/epics/<number>.md` or the GitHub issue.

### 2. Extract Tasks

Parse `- [ ]` checklist items from the epic body.

### 3. Analyze Dependencies

For each task, determine:
- What must be done before this task (dependencies)
- What this task enables (dependents)
- Complexity estimate (S/M/L/XL)
- Risk level (LOW/MEDIUM/HIGH)

### 4. Generate Phase Plan

```markdown
# Epic #42 Decomposition: "Add OAuth2 authentication"

## Phase 1 — Foundation (no dependencies)
- [ ] T1: Create GitHub OAuth app → complexity: S, risk: LOW
- [ ] T2: DB migration: provider_tokens table → complexity: S, risk: LOW

## Phase 2 — Core (depends on Phase 1)
- [ ] T3: Implement OAuthService → complexity: M, risk: MEDIUM
  deps: T1, T2

## Phase 3 — Integration (depends on Phase 2)
- [ ] T4: Backend /auth/github/callback route → complexity: M, risk: MEDIUM
  deps: T3
- [ ] T5: Frontend OAuth button → complexity: S, risk: LOW
  deps: T3

## Phase 4 — Verification (depends on Phase 3)
- [ ] T6: E2E test: full OAuth flow → complexity: S, risk: LOW
  deps: T4, T5
- [ ] T7: Update auth documentation → complexity: S, risk: LOW
  deps: T4

## Critical Path
T1 → T2 → T3 → T4 → T6 (4 phases, minimum 4 iterations)

## Parallelizable
Phase 3: T4 and T5 can run simultaneously
```

### 5. Save and Confirm

Write the phase plan to `.claude/epics/<number>.md`. Present to user for confirmation before implementation begins.

## Next Steps

After confirmation:
- Work through phases in order
- Use `/checkpoint create` after each phase
- Use `/epic-validate <number>` when all tasks are checked off
