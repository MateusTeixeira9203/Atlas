---
name: kotlin-build
description: Diagnose and fix Kotlin/Android build errors. Runs Gradle build, ktlint, and detekt. Handles common Kotlin errors including null safety violations, coroutine context issues, and Gradle configuration problems.
cpe:
  source: ecc
  original_path: commands/kotlin-build.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# /kotlin-build

Diagnose and fix Kotlin/Android build errors.

## Diagnostics

```bash
./gradlew build 2>&1
./gradlew ktlintCheck 2>&1
./gradlew detekt 2>&1
```

## Common Errors and Fixes

| Error | Fix |
|-------|-----|
| `NullPointerException` at compile | Use `?.` safe call or `!!` with guard |
| `Unresolved reference` | Check import; add dependency to build.gradle |
| `Type mismatch` | Use explicit cast or `.toString()` / `.toLong()` etc. |
| `Suspend function called from non-suspend` | Add `suspend` to caller or use `runBlocking` |
| `Gradle sync failed` | Check `build.gradle` versions; run `./gradlew --refresh-dependencies` |
| `Context required` | Pass Context through function params (don't store in singletons) |

## Gradle-Specific

```bash
# Clean build (when cache might be stale)
./gradlew clean build

# Check dependency resolution
./gradlew dependencies --configuration implementation

# Fix version conflicts
# In build.gradle: resolutionStrategy { force 'group:artifact:version' }
```

## Ktlint Auto-Fix

```bash
./gradlew ktlintFormat
```

## Report

```
Kotlin Build Fix
─────────────────
Resolved: 6 errors, 3 ktlint warnings
Remaining: 1 (Gradle version conflict — see below)

Conflict: kotlin-stdlib 1.8.0 vs 1.9.0
Fix: add to build.gradle:
  configurations.all { resolutionStrategy { force "org.jetbrains.kotlin:kotlin-stdlib:1.9.0" } }
```
