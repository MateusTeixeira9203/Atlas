---
name: go-build
description: Diagnose and fix Go build errors. Runs go build, go vet, staticcheck, and golangci-lint. Fixes errors one at a time in dependency order. Invokes go-reviewer agent for type/interface issues.
cpe:
  source: ecc
  original_path: commands/go-build.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; invokes CPE go-reviewer agent
---

# /go-build

Diagnose and fix Go build errors systematically.

## Process

```bash
# 1. Diagnostics
go build ./...
go vet ./...
staticcheck ./...
golangci-lint run
go mod verify && go mod tidy
```

Parse errors, group by file in dependency order (upstream errors first).

## Fix Strategy

For each error: read → diagnose → fix minimal → verify.

| Error | Fix |
|-------|-----|
| Undefined identifier | Check import or define the symbol |
| Type mismatch | Adjust type or add conversion |
| Missing return | Add return with zero value + error |
| Unimplemented interface | Add missing methods |
| Import cycle | Extract shared type to separate package |
| Unused variable | Remove or use with `_` |

## Stop Conditions

- Same error after 3 attempts
- Fix introduces new errors
- Requires architectural change

## Verification

```bash
go build ./...   # must succeed
go vet ./...     # must pass
go test ./...    # should not regress
```

## Report

```
Go Build Fix
─────────────
Resolved: 5 errors
Remaining: 1 (import cycle — needs architectural fix)

import cycle: pkg/api → pkg/auth → pkg/api
Resolution: extract AuthConfig to pkg/config
```
