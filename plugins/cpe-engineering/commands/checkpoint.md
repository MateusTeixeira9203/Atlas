---
name: checkpoint
description: Create, verify, or list workflow checkpoints. Saves git state with verification results to .claude/checkpoints.log. Use after completing each major phase of work.
cpe:
  source: ecc
  original_path: commands/checkpoint.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: simplified — removed ECC-specific hooks; uses standard git
---

# /checkpoint

Create, verify, or list workflow checkpoints with verification state.

## Usage

```
/checkpoint create [name]   — Save current state with verification
/checkpoint verify [name]   — Compare current state to a saved checkpoint
/checkpoint list            — Show all saved checkpoints
/checkpoint clear           — Remove all but the 5 most recent
```

## Create Checkpoint

1. Run verification: `npm test` (or language equivalent)
2. Record coverage if available
3. Create git commit or stash: `git stash push -m "checkpoint: <name>"`
4. Log to `.claude/checkpoints.log`:
   ```
   2026-06-22T14:30:00Z | checkpoint: after-auth-layer | sha: abc1234 | tests: 47 passed
   ```

## Verify Checkpoint

Compare current state to a named checkpoint:
- Files modified/added since checkpoint
- Test results delta (passes, failures)
- Coverage delta (if available)
- Build status

Output:
```
Checkpoint: after-auth-layer (2026-06-22 14:30)
─────────────────────────────────────────────
Files changed:  +3 modified, +1 added
Tests:          47 → 52 (5 new passing)
Coverage:       78% → 82% (+4%)
Build:          ✓ passing
```

## List Checkpoints

```
NAME                  DATE        SHA       STATUS
after-auth-layer      2026-06-22  abc1234   current
initial-scaffold      2026-06-21  def5678   3 days ago
```

## Typical Workflow

```
/checkpoint create initial-scaffold
  → implement feature phase 1
/checkpoint create after-core-logic
  → implement feature phase 2
/checkpoint verify after-core-logic
  → review progress
/checkpoint create before-pr
  → open PR
```
