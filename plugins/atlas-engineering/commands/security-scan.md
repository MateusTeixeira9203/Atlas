---
name: security-scan
description: Scan the project for security vulnerabilities across secrets, permissions, hooks, MCP servers, and agent prompts. Reports findings by severity with remediation steps. Use before any deployment or PR merge.
cpe:
  source: ecc
  original_path: commands/security-scan.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: adapted to be standalone (removed ECC AgentShield dependency); uses standard static analysis tools
---

# /security-scan

Scan for security vulnerabilities across the project. Use before deployment or PR merge.

## Usage

```
/security-scan [path]                    — Scan current or specified path
/security-scan --min-severity high       — Only report high/critical
/security-scan --format markdown         — Output in markdown (for PRs)
```

## Scan Areas

### 1. Secrets Detection (CRITICAL)
```bash
# Detect hardcoded credentials
grep -rn "password\s*=\s*['\"]" --include="*.{ts,js,py,go,java,env}"
grep -rn "api_key\s*=\s*['\"]" .
grep -rn "secret\s*=\s*['\"]" .

# Check .env files are not committed
git status --short | grep "\.env"
git log --all --full-history -- "**/.env" "**/*.key" "**/*.pem"
```

### 2. Dependency Vulnerabilities (HIGH)
```bash
npm audit --audit-level=high      # Node.js
pip-audit                         # Python
cargo audit                       # Rust
./gradlew dependencyCheckAnalyze  # Java
go list -m all | nancy sleuth     # Go
```

### 3. Code Vulnerabilities (via agent)
Invoke `security-reviewer` agent on changed files:
- SQL injection patterns
- XSS vectors
- Path traversal
- Auth bypasses
- Unsafe deserialization

### 4. Configuration Security
```bash
# Check file permissions
find . -name "*.key" -o -name "*.pem" | xargs ls -la
# Check .gitignore covers sensitive files
cat .gitignore | grep -E "\.env|\.key|\.pem|credentials"
```

### 5. CLAUDE.md / Agent Prompt Security
- Missing input validation instructions
- No guardrails against prompt injection
- Overly broad tool permissions

## Output Format

```
Security Scan Report — 2026-06-22
──────────────────────────────────
Grade: B (2 HIGH, 0 CRITICAL)

CRITICAL (0)
  — none found

HIGH (2)
  src/config/db.ts:12 — hardcoded database password
    Fix: move to process.env.DB_PASSWORD
  package.json — lodash@4.17.15 has known CVE-2021-23337
    Fix: npm update lodash

MEDIUM (3)
  src/api/user.ts:89 — missing rate limiting on /api/users
  ...

Remediation Priority:
1. Rotate any exposed credentials immediately
2. Update vulnerable dependencies
3. Add rate limiting to public endpoints
```

## CI Integration

```yaml
# .github/workflows/security.yml
- name: Security Scan
  run: |
    npm audit --audit-level=high
    npx semgrep --config=auto src/
```
