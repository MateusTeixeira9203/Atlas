---
name: prp-plan
description: Product Requirements Protocol — comprehensive implementation planning. Takes a PRD, feature description, or markdown spec through 6 phases (detect, parse, explore, research, design, architect) and produces a plan document that enables single-pass implementation.
cpe:
  source: ecc
  original_path: commands/prp-plan.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: content preserved; adapted from ECC PRP workflow
---

# /prp-plan

Comprehensive implementation planning via the Product Requirements Protocol (6 phases).

## Usage

```
/prp-plan                           — Free-form description (interactive)
/prp-plan path/to/feature.prd.md    — From a PRD file
/prp-plan path/to/design.md         — From a design document
```

## Six Phases

### Phase 0 — DETECT

Identify input type:
- PRD file (`.prd.md`) → extract requirements and acceptance criteria
- Design document → extract implementation scope
- Free-form text → identify core deliverables and extract user stories
- Phase continuation → resume from last completed phase

### Phase 1 — PARSE

Extract:
- User stories (As a `<role>`, I want `<action>` so that `<benefit>`)
- Acceptance criteria (measurable, verifiable)
- Complexity estimate: Small (< 1 day) / Medium (1-3 days) / Large (3-7 days) / XL (> 1 week)

**Ambiguity Gate:** halt if core deliverables or success criteria are unclear. Ask one clarifying question.

### Phase 2 — EXPLORE

Search the codebase systematically across 8 categories:
1. Similar implementations (what already exists)
2. Naming conventions in use
3. Error handling patterns
4. Logging patterns
5. Types and interfaces
6. Test patterns
7. Configuration patterns
8. External dependencies

Trace 5 execution paths: entry points, data flow, state changes, API contracts, reusable patterns.

### Phase 3 — RESEARCH

For unfamiliar libraries, APIs, or technologies:
- Read official docs
- Find usage examples in the codebase
- Note version constraints

### Phase 4 — DESIGN

For UI changes: document before/after with UX transformation diagram.
For API changes: document request/response schemas.
For data changes: document schema migration.

### Phase 5 — ARCHITECT

Define:
- Implementation strategy (chosen approach + alternatives considered)
- Explicit scope boundaries
- Out-of-scope items (what this plan does NOT cover)
- Risk matrix

### Phase 6 — GENERATE

Produce plan document at `.claude/plans/<feature-name>.md`:

```markdown
# Plan: <Feature Name>

## Mandatory Reading
- src/auth/service.ts — existing auth patterns
- src/types/user.ts — User type definition

## Pattern Examples (from codebase)
<actual code snippets with file:line references>

## Implementation Tasks
1. [ ] Task 1 — <description>
   Validation: <how to verify>
   
2. [ ] Task 2 — <description>
   Validation: <how to verify>

## Testing Strategy
- Unit: ...
- Integration: ...
- E2E: ...

## Acceptance Checklist
- [ ] Criterion 1
- [ ] Criterion 2
```

**Goal:** plan is complete enough that another developer could implement it without asking further questions.
