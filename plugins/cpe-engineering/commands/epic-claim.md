---
name: epic-claim
description: Claim an epic issue as the authoritative work unit for the current session. Marks the epic as in-progress, updates coordination state, and creates an audit trail. Use at the start of any epic-scoped work session.
cpe:
  source: ecc
  original_path: commands/epic-claim.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from GitHub coordination script to standalone git/markdown workflow
---

# /epic-claim

Claim an epic as the current work unit. Establishes ownership and coordination state.

## Usage

```
/epic-claim <issue-number>          — Claim a GitHub issue as epic
/epic-claim <path/to/epic.md>       — Claim a local epic file
```

## Process

### 1. Retrieve Epic

If GitHub issue:
```bash
gh issue view <issue-number> --json title,body,labels,assignees
```

If local file: read the file directly.

### 2. Extract Coordination Block

Parse the epic for:
- Title and objective
- Acceptance criteria
- Task checklist (- [ ] items)
- Dependencies on other epics/issues

### 3. Update State

```bash
# Mark as claimed in local coordination file
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | CLAIMED | epic: <number> | by: <user>" \
  >> .claude/epics/coordination.log

# Create epic workspace file
mkdir -p .claude/epics
cat > .claude/epics/<number>.md << EOF
# Epic: <title>
claimed_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
status: in_progress
issue: <number>

## Tasks
<extracted task checklist>
EOF
```

### 4. Audit Trail

If GitHub: add comment to issue:
```bash
gh issue comment <issue-number> \
  --body "🔒 Claimed by $(git config user.name) on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

## Output

```
Epic Claimed: #42 — "Add OAuth2 authentication"
─────────────────────────────────────────────
Tasks found: 7
Status: in_progress
Workspace: .claude/epics/42.md

Next: /epic-decompose 42
```

## Coordination

After claiming, use:
- `/epic-decompose <number>` — break into implementation tasks
- `/epic-validate <number>` — validate acceptance criteria
- `/epic-publish <number>` — mark as complete and publish
