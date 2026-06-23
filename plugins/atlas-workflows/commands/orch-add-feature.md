---
name: orch-add-feature
description: Orchestrated feature addition to an existing codebase. Uses goal-planner to decompose the feature, planner agent to create the implementation plan, implements with validation at each step, and runs a review swarm before PR.
cpe:
  source: ecc
  original_path: commands/orch-add-feature.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — invokes Atlas agents
  status: stub
---

# /orch-add-feature

Orchestrated workflow for adding a feature to an existing codebase.

## Usage

```
/orch-add-feature "<feature description>"
/orch-add-feature path/to/feature.md
```

## Workflow

```
1. goal-planner  → decompose feature into tasks + dependency graph
2. planner       → create detailed implementation plan
3. [approval]    → user confirms plan
4. implement     → task by task, test after each
5. swarm-review  → code + security review in parallel
6. /pr           → create PR
```

## Step 1 — Goal Planning

Invoke `goal-planner` agent:
- Validate the feature is well-defined
- Create A* task graph with dependencies
- Identify risks

**Approval gate:** user confirms scope.

## Step 2 — Implementation Planning

Invoke `planner` agent to create:
- Exact file paths to create/modify
- Implementation sequence minimizing context switching
- Validation check per task
- Testing strategy

## Step 3 — Approved Confirmation

Present plan → wait for "proceed" or modification.

## Step 4 — Implementation

For each task:
- Implement minimal code
- Run validation check
- Commit task with `feat` prefix
- Run tests (must not regress)

## Step 5 — Swarm Review

Invoke `swarm-coordinator`:
- `code-reviewer` on all changed files
- `security-reviewer` on security-sensitive changes
- Fix all CRITICAL and HIGH findings

## Step 6 — PR

Run `/pr` with auto-generated description from plan.

## Aliases

This command is equivalent to: `/epic-claim` + `/epic-decompose` + `/epic-review` + `/pr`

Use this when you don't need the full epic coordination state (no GitHub issue tracking).
