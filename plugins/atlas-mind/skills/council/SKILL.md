---
name: council
description: Convoca o conselho — deliberação estruturada onde várias personas do Atlas dão pareceres independentes, criticam-se em revisão cruzada anonimizada e sintetizam pontos positivos, negativos, viabilidade e uma recomendação. Use quando o usuário disser "convoca/chama o conselho" ou diante de uma decisão importante que merece vários ângulos.
cpe:
  source: karpathy-llm-council
  original_url: https://github.com/karpathy/llm-council
  source_commit: 92e1fccb
  license: none
  integrated_at: 2026-06-23
  adaptation: Conceito de deliberação em 3 estágios adaptado para personas nativas do Atlas (subagents). Nenhum código copiado.
---

# Council — convocar o conselho

Conceito adaptado do **llm-council** (Andrej Karpathy): em vez de consultar
vários provedores de LLM, o Atlas convoca várias **personas** para deliberar.
Nativo, single-model, sem reinventar infraestrutura.

## Quando convocar

- O usuário pede: "convoca o conselho sobre X", "chama o conselho".
- Uma decisão importante com trade-offs reais (produto, negócio, arquitetura, vida).
- Quando ele quer pontos positivos, negativos e viabilidade — não uma opinião só.

## Composição (3 a 5 conselheiros)

Escolha as personas que o tema exige — mais conselheiros não é melhor:

| Tema | Conselheiros sugeridos |
|---|---|
| Sempre | `thinking-partner` (o crítico que pressiona) |
| Negócio, mercado, lançamento | `business-strategist` |
| Decisão técnica, arquitetura | `architect`, `planner` |
| Visão, priorização | `ceo` (quando existir) |

## O processo (3 estágios)

### Estágio 1 — Pareceres independentes
Cada conselheiro responde à questão **sozinho**, sem ver os outros (subagent
isolado). Isso evita ancoragem e pensamento de manada. Cada parecer traz
**fontes reais** (skill `research`).

### Estágio 2 — Revisão cruzada (anonimizada)
Apresente os pareceres rotulados como **"Parecer A, B, C"**, sem o nome da
persona. A anonimização é obrigatória — é o que impede um conselheiro de
defender o próprio parecer ou puxar saco do outro. Cada um (ou o presidente)
aponta: onde concordam, onde divergem, qual argumento se sustenta sob pressão.

### Estágio 3 — Síntese do presidente
O presidente compila tudo **sempre nesta forma**:

- **Pontos positivos** — com qual parecer/fonte sustenta cada um.
- **Pontos negativos / riscos** — sem suavizar.
- **Viabilidade** — honesta, dado o contexto real do usuário (lê a memória).
- **Recomendação única** — e o **maior risco** nomeado explicitamente.

## Disciplina

- **Lê a memória primeiro** (skill `memory`) — a deliberação é para o caso real
  do usuário, não genérica.
- **Nunca inventa consenso.** Se o conselho divergiu, a divergência aparece na
  síntese — esconder discordância é o pior resultado.
- **Anonimização no estágio 2 é inegociável** — é o antídoto contra bajulação,
  herdado direto do design do llm-council.
- O presidente recomenda **uma** coisa; a decisão final é do usuário.

## Crédito

Conceito de deliberação em 3 estágios (pareceres → revisão cruzada anonimizada →
síntese do presidente) adaptado de [github.com/karpathy/llm-council](https://github.com/karpathy/llm-council).
