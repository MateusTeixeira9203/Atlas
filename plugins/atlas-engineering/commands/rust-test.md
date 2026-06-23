---
name: rust-test
description: Run Rust tests with cargo test, analyze failures, measure coverage with cargo tarpaulin, and generate missing tests. Targets 80%+ coverage. Includes benchmark support with criterion.
cpe:
  source: ecc
  original_path: commands/rust-test.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# /rust-test

Run Rust tests, analyze failures, and improve coverage.

## Process

```bash
# All tests
cargo test -- --nocapture

# Coverage
cargo tarpaulin --out Html --output-dir coverage/

# Benchmarks
cargo bench
```

## Test Categories

```rust
// Unit test (in same file as code)
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_discount() {
        assert_eq!(calculate_discount(150), 15);
    }

    #[test]
    #[should_panic(expected = "negative")]
    fn test_negative_amount() {
        calculate_discount(-1);
    }
}

// Integration test (tests/ directory)
// tests/integration_test.rs
#[test]
fn test_full_auth_flow() { ... }

// Property-based (proptest)
proptest! {
    #[test]
    fn never_panics(x: i64) {
        let _ = calculate_discount(x);  // must not panic
    }
}
```

## On Failure

1. Read the test and the code it tests
2. Check: is the assertion wrong or the implementation wrong?
3. For `should_panic` failures: check the panic message matches
4. Fix implementation; re-run; verify
5. Never skip or `#[ignore]` without documented reason

## Report

```
Rust Test Summary
──────────────────
Tests: 34 passing, 0 failing, 1 ignored
Coverage: 79% — below threshold
Uncovered: src/auth/refresh.rs — 4 functions untested
```
