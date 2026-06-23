---
name: orch-build-mvp
description: Orchestrate MVP development from a design/spec document. Extracts scope, builds thin vertical slices end-to-end, runs code and security review on each slice, and commits separately. Invokes swarm-coordinator and goal-planner agents.
cpe:
  source: ecc
  original_path: commands/orch-build-mvp.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; invokes Atlas agents instead of ECC-specific tooling
---

# /orch-build-mvp

Orchestrate MVP development from a specification document.

## Usage

```
/orch-build-mvp <path/to/design.md>
/orch-build-mvp <path/to/feature.prd.md>
```

## Process

### Stage 1 — Specification Analysis

Invoke `goal-planner` agent on the spec document:
- Extract MVP scope (what is and is NOT in scope)
- Identify locked decisions (constraints not up for debate)
- Organize features as **thin vertical slices** (end-to-end first)
- Present decomposition to user for approval

**Approval gate:** wait for user to confirm or modify the slice breakdown.

### Stage 2 — First Vertical Slice

Build the thinnest possible end-to-end path first:
- Backend handler
- Data layer
- Frontend display (if applicable)
- Basic test

This proves the architecture works before adding complexity.

### Stage 3 — Iterative Slices

For each subsequent slice:
1. Implement the slice
2. Run `code-reviewer` agent on changed files
3. Run `security-reviewer` agent on security-sensitive changes
4. Fix any CRITICAL or HIGH findings before proceeding
5. Commit: `git commit -m "slice: <slice-name>"`
6. Verify nothing broke (build + tests)

### Stage 4 — Integration

After all slices:
1. Full test suite
2. Full `security-scan`
3. Integration test for the complete feature flow
4. Final commit with complete feature

### Stage 5 — Review

Invoke `swarm-coordinator` to run parallel review:
- `code-reviewer` → code quality
- `security-reviewer` → security
- (optional) `performance-optimizer` → if performance is a concern

## Output

```
Orch Build MVP: "OAuth2 Authentication"
─────────────────────────────────────────
Slices:
  ✓ Slice 1: DB schema + migration
  ✓ Slice 2: OAuthService + token exchange
  ✓ Slice 3: Backend callback route
  ✓ Slice 4: Frontend login button
  ✓ Slice 5: E2E integration

Final: 12 commits, 847 lines added, 0 security findings
```
