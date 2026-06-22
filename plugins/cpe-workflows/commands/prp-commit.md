---
name: prp-commit
description: Create a structured commit for a completed PRP task or phase. Generates a conventional commit message from the plan task, runs pre-commit checks, and updates the plan file to mark tasks complete.
cpe:
  source: ecc
  original_path: commands/prp-commit.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /prp-commit

Create a structured commit for a completed PRP task.

## Usage

```
/prp-commit <plan-name> <task-id>     — Commit for a specific task
/prp-commit <plan-name>               — Commit for last completed task
```

## Process

1. **Identify completed task** from `.claude/plans/<plan-name>.md`

2. **Run pre-commit checks**:
   ```bash
   npm run type-check && npm test
   ```
   Do not commit if checks fail.

3. **Stage changes**:
   ```bash
   git add <files changed by this task>
   ```
   Never `git add -A` — stage only relevant files.

4. **Generate commit message** (conventional commit format):
   ```
   <type>(<scope>): <task description>
   
   Task: <task-id> from plan <plan-name>
   Validation: <validation result>
   ```
   
   Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

5. **Commit**:
   ```bash
   git commit -m "<generated message>"
   ```

6. **Update plan**: mark task `[x]` in `.claude/plans/<plan-name>.md`

## Example

```
feat(auth): implement OAuthService with GitHub provider

Task: T3 from plan oauth-authentication
Validation: 12 unit tests passing, token exchange flow verified
```
