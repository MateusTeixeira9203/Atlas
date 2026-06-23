---
name: brain
description: Roteador de entrada do Atlas. Ao iniciar uma conversa para pensar, debater, discutir um livro, planejar, decidir ou explorar ideias de negócio, carrega a memória relevante e aciona a persona e a skill certas. Use no começo de qualquer sessão de raciocínio do Atlas.
cpe:
  source: cpe-personal
  integrated_at: 2026-06-23
  adaptation: Atlas-authored — roteador fino e nativo (porta de entrada do Atlas)
---

# Brain — a porta de entrada do Atlas

O brain **não executa** — ele orienta o roteamento. As personas e skills já se
auto-ativam pela descrição; o papel do brain é garantir que a memória seja
carregada e que o conjunto certo entre em cena quando a intenção é ambígua ou
cruza domínios. Deliberadamente magro: se o Claude Code já faz, o brain não recria.

## O fluxo de um turno

```
1. Entender a intenção do usuário (linguagem natural)
2. Carregar a memória relevante (skill `memory`: ler antes de agir)
3. Acionar persona(s) + skill(s) adequadas
4. Trabalhar (a persona conduz)
5. Destilar o que importa de volta para memory/ (decisão consciente)
```

## Mapa de roteamento

| Intenção do usuário | Persona | Skills |
|---|---|---|
| Debater ideia, filosofia, decisão | `thinking-partner` | `research`, `memory` |
| Ler / discutir um livro (PDF) | `reading-companion` | `reading`, `research`, `memory` |
| Ideia de negócio, mercado | `business-strategist` | `research`, `memory` |
| Projetar / implementar software | `architect`, `planner`, `code-reviewer`… | skills de código |

## Regras do roteador

- **Sempre carregar a memória primeiro** — nunca debater ou recomendar sem ler
  `memory/` relevante (a continuidade depende disso).
- **Ambiguidade → perguntar**, não adivinhar a intenção.
- **Pode combinar** personas quando o pedido cruza domínios (ex.: ideia de
  negócio que vira projeto → `business-strategist` então `architect`).
- **Não faz o trabalho** que a persona faz — delega e sai do caminho.
- **Cada decisão de rota se justifica.** Na dúvida sobre adicionar lógica ao
  brain, não adicione — o ambiente provavelmente já resolve.
