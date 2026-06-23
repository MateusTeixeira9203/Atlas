---
name: epic-unblock
description: Diagnose and resolve blockers on a claimed epic. Analyzes stalled tasks, suggests resolution strategies, updates the coordination log, and resumes the work plan.
cpe:
  source: ecc
  original_path: commands/epic-unblock.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted from ECC; standalone blocker resolution workflow
  status: stub
---

# /epic-unblock

Diagnose and resolve blockers on a stalled epic.

## Usage

```
/epic-unblock <issue-number>
/epic-unblock <issue-number> --task T3      — Target a specific task
```

## Process

1. **Load epic workspace** from `.claude/epics/<number>.md`

2. **Identify blocked tasks**:
   - Tasks not progressed in more than 1 session
   - Tasks marked `[blocked]` or with `⚠` in notes
   - Tasks with unresolved dependencies

3. **Diagnose blocker type**:

   | Type | Symptoms | Resolution |
   |------|----------|-----------|
   | Technical | Build failing, tests broken | `/build-fix` or specific fix |
   | Dependency | Waiting on another task/team | Re-sequence or parallelize |
   | Scope | Task is larger than estimated | Re-decompose with `/epic-decompose` |
   | External | Waiting on API key, access, approval | Document wait; work on other tasks |
   | Knowledge | Unfamiliar domain | Consult `architect` agent first |

4. **Propose resolution**:
   - For technical: attempt resolution or provide diagnosis
   - For scope: offer re-decomposition plan
   - For dependency: suggest parallel tasks to work on
   - For external: document and suggest next unblocked task

5. **Update coordination log**:
   ```
   2026-06-22 | UNBLOCKED | T3: resolved by re-sequencing after T5
   ```

6. **Resume** — provide next concrete action

## Output

```
Epic Unblock: #42, Task T3 — "Implement OAuthService"
──────────────────────────────────────────────────────
Blocker type: Technical
Diagnosis: Missing type definitions for GitHub OAuth token response

Resolution:
1. Install @types/passport-github2
2. Create src/types/oauth.ts with GithubProfile type
3. Update OAuthService to use typed response

Next action: start with step 1
```
