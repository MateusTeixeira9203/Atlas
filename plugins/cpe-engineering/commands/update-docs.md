---
name: update-docs
description: Update documentation after code changes. Scans changed files, identifies outdated docs (README, API docs, CHANGELOG), and generates updated content. Never deletes existing docs without confirmation.
cpe:
  source: ecc
  original_path: commands/update-docs.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# /update-docs

Update documentation to match recent code changes.

## Usage

```
/update-docs              — Scan and update all docs
/update-docs README.md    — Target a specific doc
/update-docs --changelog  — Update CHANGELOG only
```

## Process

### 1. Identify Changes

```bash
git diff main...HEAD --name-only
```

Categorize changed files: new features, API changes, config changes, removed functionality.

### 2. Find Affected Docs

For each code change, find the doc it affects:
- New endpoint → API docs / OpenAPI spec
- Changed config → README or config guide
- New feature → README features section
- Removed feature → README + CHANGELOG
- Changed CLI flags → README usage section

### 3. Update

For each outdated doc:
- Read current doc content
- Identify outdated sections
- Generate updated content
- Show diff to user before writing

### 4. CHANGELOG

If `--changelog` or significant changes detected:

```markdown
## [Unreleased]

### Added
- OAuth2 authentication via GitHub (#42)

### Changed
- Auth token storage now encrypted at rest

### Fixed
- Session timeout was not respected on mobile
```

### 5. API Docs

If OpenAPI spec exists (`openapi.yaml` / `swagger.json`):
- Update endpoint definitions for new/changed routes
- Add request/response schemas
- Update examples

## Safety

- Never delete sections without confirmation
- Show unified diff before writing
- One file at a time, confirm each
