---
name: go-review
description: Quick Go code review. Runs go vet, staticcheck, and golangci-lint on changed files, then applies the go-reviewer agent checklist. APPROVE/WARN/BLOCK verdict.
cpe:
  source: ecc
  original_path: commands/go-review.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — references CPE go-reviewer agent
  status: stub
---

# /go-review

Quick Go code review with static analysis + agent checklist.

## Process

```bash
git diff -- '*.go'
go vet ./...
staticcheck ./...
golangci-lint run
```

## Review Checklist (go-reviewer agent)

**CRITICAL:**
- [ ] Goroutine leak
- [ ] Data race on shared state
- [ ] Unchecked error returns
- [ ] SQL injection via string concat
- [ ] `os/exec` with user input

**HIGH:**
- [ ] Error not wrapped with context (`fmt.Errorf("op: %w", err)`)
- [ ] `context.Background()` replacing an incoming context
- [ ] Fat interfaces (> 5 methods)
- [ ] Panic in library code (return `error` instead)

**MEDIUM:**
- [ ] `defer` inside loop
- [ ] Named returns without meaningful use
- [ ] Constructor returning concrete type instead of interface

## Output

```
Go Review
──────────
Files: 2 changed

CRITICAL: none
HIGH:
  pkg/auth/service.go:34 — error not wrapped with context
MEDIUM: none

Verdict: ⚠️ WARN — 1 HIGH finding
```
