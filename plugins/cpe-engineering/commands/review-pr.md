---
name: review-pr
description: Review a GitHub pull request. Fetches the diff, runs code-reviewer and security-reviewer agents, and outputs a structured review with verdict (APPROVE/REQUEST_CHANGES). Optionally posts the review to GitHub.
cpe:
  source: ecc
  original_path: commands/review-pr.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — references CPE review agents
  status: stub
---

# /review-pr

Review a GitHub pull request with structured analysis.

## Usage

```
/review-pr <PR-number>              — Review a PR
/review-pr <PR-number> --post       — Review and post to GitHub
/review-pr <PR-number> --security   — Security-focused review only
```

## Process

```bash
# Fetch PR diff
gh pr diff <number>
gh pr view <number> --json title,body,files,commits
```

Then:
1. Run `code-reviewer` agent on all changed files
2. Run `security-reviewer` agent on security-sensitive files
3. Consolidate findings
4. Produce structured review

## Output Format

```
PR Review: #42 — "Add OAuth2 authentication"
─────────────────────────────────────────────
Files: 12 changed (+847 -123)

SECURITY FINDINGS
  CRITICAL: none
  HIGH: src/auth/oauth.ts:45 — OAuth state not validated

CODE QUALITY
  HIGH: src/api/callback.ts:23 — missing error handling
  MEDIUM: src/types/oauth.ts:5 — missing JSDoc on public interface

VERDICT: REQUEST_CHANGES
  Required before merge:
  1. Validate OAuth state parameter (CRITICAL security risk)
  2. Add error handling to callback route (HIGH quality issue)
  
  Optional:
  3. Add JSDoc to public OAuth types
```

## Post to GitHub

With `--post`:
```bash
gh pr review <number> --request-changes --body "<review text>"
# or
gh pr review <number> --approve --body "<review text>"
```

## Verdict Rules

| Verdict | Condition |
|---------|-----------|
| APPROVE | No CRITICAL or HIGH findings |
| REQUEST_CHANGES | Any CRITICAL or HIGH finding |
| COMMENT | MEDIUM/LOW findings only — comment without blocking |
