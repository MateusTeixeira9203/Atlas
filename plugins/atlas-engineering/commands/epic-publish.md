---
name: epic-publish
description: Mark a validated epic as complete. Creates the final PR, updates the issue/coordination log, adds a completion comment, and archives the epic workspace. Requires epic-validate to pass first.
cpe:
  source: ecc
  original_path: commands/epic-publish.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from ECC; standalone workflow
  status: stub
---

# /epic-publish

Mark a validated epic as complete and publish the result.

## Usage

```
/epic-publish <issue-number>
```

## Prerequisites

`/epic-validate <number>` must pass before publishing.

## Process

1. **Confirm validation** — read `.claude/epics/<number>.md`, verify status is `validated`
2. **Create PR** — run `/pr` to create the final PR for the epic branch
3. **Update coordination log**:
   ```bash
   echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | PUBLISHED | epic: <number>" \
     >> .claude/epics/coordination.log
   ```
4. **GitHub update** (if issue-backed):
   ```bash
   gh issue comment <number> --body "✅ Epic complete. PR: <pr-url>"
   gh issue close <number>
   ```
5. **Archive workspace**:
   ```bash
   mv .claude/epics/<number>.md .claude/epics/archive/<number>-$(date +%Y%m%d).md
   ```

## Output

```
Epic Published: #42 — "Add OAuth2 authentication"
──────────────────────────────────────────────────
PR: #87 — https://github.com/org/repo/pull/87
Issue: closed
Workspace: archived to .claude/epics/archive/42-20260622.md

Done.
```
