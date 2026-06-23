---
name: reading
description: Fluxo de leitura e destilação de livros/PDFs em notas estruturadas com citações de página. Use ao ler um PDF longo, produzir notas de um livro ou preparar material para debate. PDFs ficam fora do repo; só as notas são versionadas.
cpe:
  source: cpe-personal
  integrated_at: 2026-06-23
  adaptation: Atlas-authored — fonte única do fluxo de leitura do Atlas
---

# Reading — destilar livros em notas

A fonte única do fluxo de leitura do Atlas. Parte de um limite físico: **um
livro inteiro não cabe no contexto**. Ler é destilar progressivamente para a
memória, não engolir o PDF de uma vez.

## O fluxo

```
PDF (local, fora do repo)
  → Read em blocos de páginas, capítulo a capítulo
  → destilar cada parte em notas
  → memory/readings/<livro>.md  (atualizar, não duplicar)
  → debater a partir das notas + reler trechos sob demanda
```

## Formato da nota de leitura

```markdown
---
name: <livro-slug>
description: <tese central do livro em uma linha>
type: reading
created: YYYY-MM-DD
---

## Tese central
<uma frase>

## Argumentos
1. <argumento> — p.<página>

## Citações-chave
> "<citação>" — p.<página>

## Tensões e pontos fracos
<onde o argumento falha ou é contestado>

## Conexões
<liga com [[outro-livro]] já lido>
```

## Regras

- **PDFs não entram no repositório** (binários grandes, direito autoral). Só as
  notas destiladas são versionadas.
- **Nunca invente** citação nem número de página — se não localizou no texto, diga.
- Distinga o que o autor afirma do que é interpretação.
- Para contexto do autor ou recepção crítica, use a skill `research`.
