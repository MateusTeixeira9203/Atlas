# Memory — a memória pessoal do Atlas

> Esta pasta é a **camada pessoal (global)** da memória do Atlas — quem você é,
> seu jeito de pensar, livros, princípios e preferências. É carregada **sempre**,
> em qualquer projeto. A memória **de projeto** vive dentro de cada projeto, não
> aqui. Ver `docs/atlas-architecture.md` §4.1.

---

## Estrutura

```
memory/
  decisions/    ← decisões pessoais e de arquitetura transversais (ADRs)
  discussions/  ← pensamentos, debates, conclusões
  readings/     ← notas destiladas de livros (NÃO os PDFs)
  projects/     ← visão geral de ideias e projetos
  references/   ← pesquisas com fontes reais (URL + citação)
  MEMORY.md     ← índice: uma linha por memória
```

---

## Formato de cada memória

Um **fato/decisão por arquivo**, em kebab-case, com frontmatter:

```markdown
---
name: <slug-curto>
description: <resumo de uma linha — usado para decidir relevância>
type: discussion | decision | reading | project | reference
created: YYYY-MM-DD
---

<o conteúdo. Linka memórias relacionadas com [[outro-slug]].>
```

Depois de criar, adicione **uma linha** em `MEMORY.md` apontando para o arquivo.

---

## Regras

- **Local por padrão.** Conhecimento específico de um projeto fica no projeto.
  Só sobe para cá o que é **pessoal e durável** — e sempre por decisão consciente
  (o Atlas pergunta antes de promover).
- **Sem PDFs nem binários.** Versiona-se só notas destiladas. O GitHub guarda
  conhecimento, não arquivos brutos.
- **Sem segredo.** Nada de chaves, tokens ou dados sensíveis.
- **Um fato por arquivo.** Memórias atômicas envelhecem melhor e viram dataset limpo.
- **Antes de criar, procure** um arquivo que já cubra o tema — atualize em vez de duplicar.
- **Consistência é dataset.** A estrutura disciplinada de hoje é o que torna
  possível, no futuro, apontar para esta pasta e treinar um modelo pessoal.
