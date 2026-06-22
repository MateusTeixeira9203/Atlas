---
name: rust-build
description: Diagnose and fix Rust compilation errors. Runs cargo build, cargo clippy, and cargo audit. Fixes errors in dependency order. Special handling for borrow checker, lifetime, and unsafe block errors.
cpe:
  source: ecc
  original_path: commands/rust-build.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /rust-build

Diagnose and fix Rust compilation errors systematically.

## Diagnostics

```bash
cargo build 2>&1
cargo clippy -- -D warnings 2>&1
cargo audit                     # CVE check
```

## Common Errors and Fixes

| Error | Fix |
|-------|-----|
| `cannot borrow as mutable` | Change `&` to `&mut`, or restructure ownership |
| `use of moved value` | Clone before move, or restructure to borrow |
| `lifetime` mismatch | Add explicit lifetime annotations or restructure |
| `trait not implemented` | Implement trait or derive it |
| `type mismatch` | Add `.into()`, explicit cast, or adjust types |
| Missing `async` | Add `async` to function signature |
| Blocking in async | Replace with `tokio::time::sleep`, `tokio::fs::*`, etc. |

## Unsafe Block Errors

Every `unsafe` block must have a `// SAFETY:` comment explaining the invariants. If the comment is missing or incorrect, add it rather than removing the unsafe.

## Clippy Fixes

```bash
# Auto-fix many clippy warnings
cargo clippy --fix -- -D warnings
```

For manual clippy fixes:
- `clippy::redundant_clone` → remove unnecessary `.clone()`
- `clippy::needless_pass_by_value` → change to borrow `&T`
- `clippy::unwrap_used` → replace with `?` or proper error handling

## Stop Conditions

- Borrow checker errors requiring ownership redesign
- Lifetime errors in public API (needs API design change)
- Same error after 3 attempts

## Report

```
Rust Build Fix
──────────────
Resolved: 4 errors, 7 clippy warnings
Remaining: 1 (lifetime in public API — needs design review)
```
