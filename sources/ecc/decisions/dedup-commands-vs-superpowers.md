# Dedup: ECC Commands vs Superpowers Skills — Fase 5

**Data:** 2026-06-22
**Decisão:** Quais commands ECC NÃO integrar por sobreposição com superpowers

## Superpowers skills instaladas (referência)

As 14 skills do superpowers em `~/.claude/skills/`:
`code-review`, `writing-plans`, `tdd`, `debug`, `worktrees`,
`git-operations`, `feature-breakdown`, `technical-specs`,
`architecture-review`, `security-review`, `performance-review`,
`documentation`, `testing-strategy`, `refactoring`

## Commands ECC excluídos (DEDUP)

| Command ECC | Overlap | Decisão |
|-------------|---------|---------|
| `code-review.md` | superpowers `code-review` — mesma finalidade | SKIP — dedup direto |
| `plan.md` | superpowers `writing-plans` — mesmo workflow genérico | SKIP — manter `prp-plan` (mais rico, 6 fases) |
| `evolve.md` | sistema de evolução ECC-específico | SKIP — acoplado ao ECC harness |
| `auto-update.md` | update system ECC-específico | SKIP — acoplado ao ECC |
| `hookify*.md` | sistema de hooks ECC-específico | SKIP — 4 commands |
| `instinct-*.md` | sistema instinct ECC-específico | SKIP — 3 commands |
| `gan-*.md` | pipeline GAN muito específico | SKIP — 3 commands |
| `learn*.md` | learning system ECC-específico | SKIP — 2 commands |
| `ecc-guide.md` | guia do ECC (não do Atlas) | SKIP — ECC-specific |
| `santa-loop.md` | comando sazonal/fun | SKIP — sem valor funcional |
| `marketing-campaign.md` | fora do escopo de engenharia | SKIP |
| `jira.md` | requer integração Jira | SKIP — dependência externa |
| `pm2.md` | PM2-specific | SKIP — dependência específica |
| `aside.md` | sistema aside ECC-específico | SKIP |
| `cost-report.md` | monitoring ECC-específico | SKIP |
| `skill-create.md` | skill management ECC-específico | SKIP — Atlas tem próprio sistema |
| `skill-health.md` | skill health ECC-específico | SKIP |
| `sessions.md` | session management ECC-específico | SKIP — Atlas usa checkpoint |
| `save-session.md` | ECC session system | SKIP — Atlas usa checkpoint |
| `resume-session.md` | ECC session system | SKIP — Atlas usa checkpoint |
| `update-codemaps.md` | codemaps ECC-específico | SKIP |
| `prune.md` | prune system ECC-específico | SKIP |
| `promote.md` | promote system ECC-específico | SKIP |
| `projects.md` | projects system ECC-específico | SKIP |
| `setup-pm.md` | setup ECC-específico | SKIP |
| `project-init.md` | init ECC-específico | SKIP |
| `model-route.md` | model routing ECC-específico | SKIP |
| `multi-plan.md` | similar ao orch-*, usar orch-* | SKIP — redundante com orchestration commands |
| `multi-execute.md` | idem | SKIP |
| `multi-workflow.md` | idem | SKIP |
| `multi-backend.md` | idem | SKIP |
| `multi-frontend.md` | idem | SKIP |
| `harness-audit.md` | harness ECC-específico | SKIP |
| `loop-start.md` | loop system ECC-específico | SKIP — Atlas usa loop-operator agent |
| `loop-status.md` | idem | SKIP |
| `feature-dev.md` | redundante com orch-add-feature | SKIP |
| `plan-prd.md` | similar ao prp-plan fase 0 | SKIP — coberto pelo prp-plan |
| `prp-prd.md` | PRD creation | SKIP — fora do escopo da Fase 5 (Templates, Fase 7) |
| `fastapi-review.md` | útil mas redundante com python-review + fastapi-patterns skill | SKIP — coberto |
| `flutter-review.md` | útil mas fora do foco principal | SKIP — candidato à Fase 7 |
| `flutter-build.md` | idem | SKIP |
| `flutter-test.md` | idem | SKIP |
| `cpp-review.md` | fora do foco principal | SKIP — candidato |
| `cpp-build.md` | idem | SKIP |
| `cpp-test.md` | idem | SKIP |
| `gradle-build.md` | coberto pelo kotlin-build | SKIP — redundante |
| `vue-review.md` | menor prioridade vs react-review | SKIP — candidato |

## Commands Integrados (37 total)

### atlas-engineering/commands/ (28)
Epic (7): epic-claim, epic-decompose, epic-publish, epic-review, epic-sync, epic-unblock, epic-validate
Quality (5): checkpoint, security-scan, quality-gate, test-coverage, build-fix
PR/docs (3): pr, review-pr, update-docs
Refactor (1): refactor-clean
Build/test by language (8): go-build, go-test, rust-build, rust-test, kotlin-build, kotlin-test, react-build, react-test
Review by language (4): python-review, go-review, rust-review, react-review

### atlas-workflows/commands/ (9)
PRP workflow (4): prp-plan, prp-implement, prp-commit, prp-pr
Orchestration (3): orch-build-mvp, orch-add-feature, orch-fix-defect

## Justificativa

Critério de dedup: se um command do ECC tem finalidade idêntica ou muito similar a uma skill do superpowers
já instalada, e não adiciona estrutura/profundidade significativa → SKIP.

O `prp-plan` foi mantido em vez de `plan.md` porque o PRP (6 fases) é substancialmente mais rico e
estruturado que a skill `writing-plans` do superpowers.

Os commands de orquestração (orch-*) foram mantidos mesmo sem equivalente direto no superpowers,
pois representam workflows de nível superior que coordenam múltiplos agentes Atlas.
