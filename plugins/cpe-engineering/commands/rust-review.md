---
name: rust-review
description: Quick Rust code review. Runs cargo clippy on changed files, then applies the rust-reviewer agent checklist. APPROVE/WARN/BLOCK verdict. Flags unsafe blocks without SAFETY comments.
cpe:
  source: ecc
  original_path: commands/rust-review.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — references CPE rust-reviewer agent
  status: stub
---

# /rust-review

Quick Rust code review with clippy + agent checklist.

## Process

```bash
git diff -- '*.rs'
cargo clippy -- -D warnings
cargo audit
```

## Review Checklist (rust-reviewer agent)

**CRITICAL:**
- [ ] `unsafe` block without `// SAFETY:` comment
- [ ] `transmute` usage
- [ ] Integer overflow in release mode (unchecked arithmetic)
- [ ] Panic in library code (use `Result` instead)

**HIGH:**
- [ ] `.unwrap()` / `.expect()` in production code paths
- [ ] Unnecessary `clone()` where borrow would suffice
- [ ] Blocking call inside `async fn` (thread::sleep, etc.)
- [ ] Mutex held across `.await` (potential deadlock)

**MEDIUM:**
- [ ] Manual loops instead of iterator adapters
- [ ] Missing `#[derive(Debug)]` on public types
- [ ] `Arc` used where ownership transfer would work

## Output

```
Rust Review
────────────
Files: 3 changed

CRITICAL:
  src/memory/pool.rs:78 — unsafe block without SAFETY comment
HIGH:
  src/api/handler.rs:45 — .unwrap() on Option in request handler
MEDIUM: none

Verdict: 🛑 BLOCK — 1 CRITICAL, 1 HIGH
```
