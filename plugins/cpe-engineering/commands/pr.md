---
name: pr
description: Create a GitHub pull request from the current feature branch. Validates branch state, pushes if needed, discovers PR templates, generates a description from commits, and reports CI status. Requires GitHub CLI (gh).
cpe:
  source: ecc
  original_path: commands/pr.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; standard gh CLI flow
---

# /pr

Create a GitHub PR from the current feature branch.

## Usage

```
/pr              — Create PR targeting main
/pr main         — Specify base branch explicitly
/pr --draft      — Create as draft PR
```

## Six-Phase Process

### Phase 1 — Validation

```bash
git branch --show-current        # must NOT be main/master
git status --short               # must be clean
git log origin/main..HEAD        # must have commits ahead
gh pr list --head $(git branch --show-current)  # must not exist
```

Stops if: on main, dirty working tree, no commits ahead, or PR already exists.

### Phase 2 — Discovery

```bash
# Find PR template
ls .github/PULL_REQUEST_TEMPLATE/ 2>/dev/null || ls .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null

# Analyze commits
git log origin/main..HEAD --pretty=format:"%s"

# Check for related plans
ls .claude/plans/ 2>/dev/null
```

Categorize changes: features, fixes, refactors, tests, docs.

### Phase 3 — Push

```bash
git push origin $(git branch --show-current)
# If diverged:
git pull --rebase origin main
git push origin $(git branch --show-current)
```

Stops on rebase conflicts — resolve manually.

### Phase 4 — Create

Using template if found, or default format:

```markdown
## Summary
<bullets from commit messages>

## Changes
<file change categories>

## Testing
<what was tested, how>

## Related
<linked plans from .claude/plans/>
```

```bash
gh pr create --base main --title "<title>" --body "<body>"
```

Warns if PR has >20 files changed.

### Phase 5 — Verify

```bash
gh pr view --json number,url,state
gh pr checks         # CI status
```

### Phase 6 — Output

```
PR Created: #42
URL: https://github.com/org/repo/pull/42
Branch: feature/auth → main
Changes: +847 -123 across 8 files
CI: 3 checks running
```

## Safety

- Uses `--force-with-lease` (never `--force`)
- Warns on large PRs (>20 files)
- Requires `gh auth status` — run `gh auth login` if needed
