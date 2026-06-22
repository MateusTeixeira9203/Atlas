---
name: go-test
description: Run Go tests, analyze failures, fix them, and report coverage. Targets 80%+ coverage. Follows TDD principles — fix test failures before adding new tests.
cpe:
  source: ecc
  original_path: commands/go-test.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /go-test

Run Go tests, analyze failures, and improve coverage.

## Usage

```
/go-test              — Run all tests with coverage
/go-test ./pkg/auth/  — Target a specific package
```

## Process

```bash
# Run with coverage
go test ./... -v -cover -coverprofile=coverage.out
go tool cover -func=coverage.out | tail -1  # total coverage

# Show uncovered lines
go tool cover -html=coverage.out -o coverage.html
```

## On Failure

For each failing test:
1. Read the test and the function it tests
2. Determine: is the test wrong or the implementation wrong?
3. Fix the implementation if behavior is wrong, fix the test if expectation is wrong
4. Re-run to verify
5. Proceed only when test passes

## Coverage Gaps

If coverage < 80%:
- Find uncovered functions with `go tool cover`
- Prioritize: exported functions, error paths, boundary conditions
- Generate tests following TDD patterns

## Benchmarks (optional)

```bash
go test -bench=. -benchmem ./...
```

Report: operations/sec, memory/op, allocs/op. Flag regressions vs. baseline.

## Report

```
Go Test Summary
───────────────
Tests: 47 passing, 0 failing
Coverage: 84% (target: 80%) ✓
Slowest: TestOAuthFlow — 450ms
```
