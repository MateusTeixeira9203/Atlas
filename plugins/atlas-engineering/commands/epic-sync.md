---
name: epic-sync
description: Sync the local epic workspace with its upstream GitHub issue. Refreshes task checklist, updates status from labels, and resolves conflicts between local progress and remote changes.
cpe:
  source: ecc
  original_path: commands/epic-sync.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: simplified from ECC GitHub coordination script
  status: stub
---

# /epic-sync

Sync local epic workspace with the upstream GitHub issue.

## Usage

```
/epic-sync <issue-number>
```

## Process

1. **Fetch current issue state**:
   ```bash
   gh issue view <number> --json title,body,labels,state,assignees
   ```

2. **Compare with local workspace** at `.claude/epics/<number>.md`:
   - Task checklist: reconcile checked/unchecked items
   - Labels: update local status (blocked, in_review, etc.)
   - Assignees: update coordination log

3. **Detect conflicts**:
   - Item checked locally but unchecked remotely → flag for resolution
   - Issue closed remotely but local work in progress → alert

4. **Merge (non-conflicting changes)**:
   - Apply remote updates to local workspace
   - Preserve local progress that isn't reflected remotely

5. **Update remote** (if local has progress not reflected in issue):
   ```bash
   gh issue edit <number> --body "<updated body with checked tasks>"
   ```

6. **Report**:
   ```
   Epic Sync: #42
   ──────────────
   Tasks: 4/7 checked (local) ↔ 3/7 checked (remote)
   Conflicts: 1 (T3: checked locally, unchecked remotely)
   Labels: added "in_review"
   
   Action needed: resolve T3 conflict
   ```

## Use When

- Returning to an epic after a break
- Collaborating with another developer on the same epic
- Remote issue was updated by a reviewer
