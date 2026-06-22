---
name: python-review
description: Quick Python code review. Runs ruff, mypy, and bandit on changed files, then applies the python-reviewer agent checklist. Outputs a tiered report and a APPROVE/WARN/BLOCK verdict.
cpe:
  source: ecc
  original_path: commands/python-review.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; references CPE python-reviewer agent
---

# /python-review

Quick Python code review with static analysis + agent checklist.

## Process

```bash
# 1. Identify changed files
git diff -- '*.py'

# 2. Static analysis
ruff check .
mypy .
bandit -r src/ -ll   # -ll = medium+ severity only
```

## Review Checklist

Invoke `python-reviewer` agent on each changed file:

**CRITICAL:**
- [ ] `eval()` / `exec()` with user input
- [ ] String-concatenated SQL queries
- [ ] `pickle.loads()` / `yaml.load()` without SafeLoader
- [ ] `subprocess(shell=True)` with user input
- [ ] Hardcoded credentials

**HIGH:**
- [ ] Bare `except:` swallowing all errors
- [ ] Mutable default arguments
- [ ] Missing type annotations on public functions
- [ ] Django N+1 queries

**MEDIUM:**
- [ ] Functions > 50 lines
- [ ] Magic numbers without constants
- [ ] `print()` instead of `logging`

## Output

```
Python Review
─────────────
Files: 3 changed

CRITICAL: none
HIGH:
  src/auth/service.py:45 — bare except: swallowing all errors
  src/db/queries.py:23 — unparameterized SQL query
MEDIUM:
  src/utils/format.py:12 — missing type annotation

Verdict: 🛑 BLOCK — 2 HIGH findings
```

## Verdict Rules

- ✅ **Approve** — no CRITICAL or HIGH
- ⚠️ **Warn** — MEDIUM only
- 🛑 **Block** — any CRITICAL or HIGH
