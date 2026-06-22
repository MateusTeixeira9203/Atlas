# Decisão de Dedup: Superpowers × CPE

**Data:** 2026-06-22
**Fase:** 2 — Integração
**Status:** DECISÃO TOMADA

---

## Situação

O repositório `superpowers` (obra/superpowers, MIT) contém **14 skills** que são
o núcleo de um framework de desenvolvimento agentic amplamente adotado.

**Fato crítico:** Essas 14 skills já estão instaladas nativamente em
`~/.claude/skills/` no ambiente atual do usuário, possivelmente via o
mecanismo de marketplace do Claude Code ou instalação manual.

Skills já instaladas (confirmadas em `~/.claude/skills/`):
- brainstorming
- dispatching-parallel-agents
- executing-plans
- finishing-a-development-branch
- receiving-code-review
- requesting-code-review
- subagent-driven-development
- systematic-debugging
- test-driven-development
- using-git-worktrees
- using-superpowers
- verification-before-completion
- writing-plans
- writing-skills

---

## Opções avaliadas

### Opção A — Absorver (reempacotar dentro de cpe-engineering)
**Resultado:** Rejeitado.
- Criaria conflito de definição com a instalação existente.
- Claude Code carregaria a mesma skill duas vezes com ids diferentes.
- Violaria o princípio "nunca sobrescrever" do CPE.
- Custo de manutenção duplicado ao atualizar o superpowers.

### Opção B — Ignorar (não registrar)
**Resultado:** Rejeitado.
- Perderia rastreabilidade: o Update Engine não saberia monitorar o superpowers.
- Futuras atualizações do upstream passariam despercebidas.

### Opção C — Referenciar como dependência ✅ (ESCOLHIDA)
**Resultado:** Aprovado.
- Registrar todas as 14 skills em `integrated.yaml` com status `reference`.
- O instalador do CPE (Fase 8) verifica se o superpowers está instalado.
- Se não estiver: instala via `claude plugin install` como pré-requisito.
- Update Engine monitora o superpowers separadamente.
- Zero conflito, zero duplicação, rastreabilidade completa.

---

## Decisão

> **O CPE trata o superpowers como dependência implícita, não como fonte
> de extração. Nenhuma das 14 skills é reempacotada dentro dos plugins `cpe-*`.**

O instalador incluirá verificação:
```
if superpowers not installed → claude plugin install superpowers@marketplace
```

A documentação do `cpe-engineering/README.md` listará o superpowers como
pré-requisito com link para o repositório original.

---

## Impacto em fases futuras

- **Fase 3 (Skills):** ao comparar skills do ECC com o superpowers, qualquer
  skill do ECC que seja equivalente a uma do superpowers DEVE ser marcada como
  `dedup: true` e não integrada.
- **Fase 8 (Instalador):** adicionar check de prerequisito.
- **Fase 10 (Update Engine):** monitorar releases do superpowers separadamente.
