# Decisão de Dedup: ECC × Superpowers

**Data:** 2026-06-22
**Fase:** 2 — Integração
**Status:** CRITÉRIOS ESTABELECIDOS (execução na Fase 3)

---

## Situação

O ECC contém **271 skills** e o superpowers contém **14 skills** que são
dependência implícita do Atlas (ver `sources/superpowers/decisions/dedup-report.md`).

Pode haver sobreposição funcional entre skills do ECC e skills do superpowers,
pois ambos focam em engenharia de software e fluxos de desenvolvimento.

---

## Critérios de Dedup (a aplicar na Fase 3)

Uma skill do ECC é marcada como `dedup: true` e **não é integrada** se:

1. **Nome idêntico ou quase-idêntico** ao de uma skill do superpowers.
   - Exemplos suspeitos: variantes de `systematic-debugging`, `code-review`,
     `writing-plans`, `test-driven-development`.

2. **Propósito funcional idêntico**, mesmo com nome diferente.
   - Critério: ao ler os dois SKILL.md lado a lado, um humano usaria
     apenas um deles para a mesma tarefa.

3. **Superpowers é mais canônico** (é a origem do padrão de skill no Claude Code).
   - Em caso de dúvida entre skill ECC e skill superpowers: preferir superpowers.

---

## Critérios para integrar skill do ECC mesmo com sobreposição parcial

1. A skill do ECC cobre um **domínio não atendido** pelo superpowers.
   - Exemplo: skills de linguagem específica (rust, go, kotlin) — superpowers
     não tem essas.

2. A skill do ECC tem **profundidade complementar** (não substituta).
   - Exemplo: `tdd-guide` do ECC pode complementar `test-driven-development`
     do superpowers com guias específicos por linguagem.

---

## Processo na Fase 3

Para cada skill do ECC:
1. Verificar se equivalente existe no superpowers.
2. Se sim → marcar `dedup: true` + registrar comparação neste arquivo.
3. Se não → integrar em `atlas-engineering/skills/`.

Resultado esperado: das 271 skills do ECC, ~10-20 terão dedup com superpowers.
As demais (~250) são candidatas à integração curada.

---

## Dedup suspeitas (pré-análise baseada em nomes)

| Skill ECC (hipotética) | Skill superpowers equivalente |
|---|---|
| debug / debugging | systematic-debugging |
| code-review / review | requesting-code-review |
| tdd / test-driven | test-driven-development |
| plan / planning | writing-plans |
| worktree / git-worktree | using-git-worktrees |

**Ação:** confirmar na Fase 3 lendo o conteúdo real de cada skill.
