---
name: test-coverage
description: Analyze test coverage, identify gaps below 80%, and generate tests for uncovered branches. Supports Jest/Vitest (JS), pytest (Python), Cargo (Rust), JaCoCo (Java), and Go native tooling.
cpe:
  source: ecc
  original_path: commands/test-coverage.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; framework detection simplified
---

# /test-coverage

Analyze coverage, find gaps, generate tests to reach 80%+ coverage.

## Framework Detection

| Indicator file | Tool |
|----------------|------|
| `jest.config.*` | `npx jest --coverage` |
| `vitest.config.*` | `npx vitest run --coverage` |
| `pytest.ini` / `pyproject.toml` | `pytest --cov=src --cov-report=term-missing` |
| `Cargo.toml` | `cargo tarpaulin` |
| `pom.xml` | `mvn test jacoco:report` |
| `go.mod` | `go test ./... -cover` |

## Process

### Step 1 — Measure Current Coverage

Run the appropriate tool, capture:
- Overall coverage %
- Per-file coverage %
- Uncovered lines/branches

### Step 2 — Identify Gaps

Prioritize files below 80% that contain:
1. Functions with complex branching (high cyclomatic complexity)
2. Error handlers
3. Widely-used utility functions
4. API handlers / route controllers
5. Business logic (not glue code)

### Step 3 — Generate Tests

For each gap, generate tests in this order:

```
1. Primary workflow — valid inputs, expected output
2. Failure scenarios — invalid inputs, error paths
3. Boundary conditions — null, empty, 0, MAX
4. Branch coverage — each conditional path
```

```typescript
// Example: covering a function that has 0% coverage
describe('calculateDiscount', () => {
    // 1. Primary workflow
    it('applies 10% to orders over 100', () => {
        expect(calculateDiscount(150)).toBe(15);
    });
    // 2. Failure scenario
    it('throws on negative amount', () => {
        expect(() => calculateDiscount(-1)).toThrow();
    });
    // 3. Boundary
    it('no discount at exactly 100', () => {
        expect(calculateDiscount(100)).toBe(0);
    });
});
```

### Step 4 — Verify

Re-run coverage after adding tests. Report before/after:

```
Coverage Report
───────────────────────────────────────────
File                      Before    After   Delta
src/auth/service.ts       45%       84%     +39%
src/utils/format.ts       62%       91%     +29%
─────────────────────────────────────────────────
Overall                   71%       83%     +12%
Target (80%) achieved: ✓
```

## Notes

- Don't test implementation details — test behavior
- Don't write tests just to hit 80% — test real edge cases
- Dead code that skews metrics should be removed, not tested
