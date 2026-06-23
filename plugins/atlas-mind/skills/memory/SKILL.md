---
name: memory
description: Protocolo de memória do Atlas — ler antes de agir, decidir o que persistir, escopo local vs pessoal e promoção consciente. Use ao iniciar uma discussão com histórico, ao concluir algo que vale lembrar, ou ao decidir se um aprendizado sobe para a memória pessoal.
cpe:
  source: cpe-personal
  integrated_at: 2026-06-23
  adaptation: Atlas-authored — fonte única do protocolo operacional de memória
---

# Memory — o protocolo de continuidade

Como o Atlas lê e escreve memória de forma que não vire bagunça. O **formato**
dos arquivos e a estrutura de pastas estão em [`memory/README.md`](../../../../memory/README.md);
aqui está o **protocolo operacional**.

## Ler antes de agir

Antes de debater, planejar ou recomendar, **leia a memória relevante** — para
não repetir o que já foi concluído e para cruzar com o histórico do usuário:

- `memory/discussions/` — debates e conclusões anteriores
- `memory/readings/` — livros já lidos
- `memory/projects/` — estado de ideias e projetos

## As duas camadas (escopo)

```
PESSOAL (global)   → memory/ no repo do Atlas → carregada SEMPRE
PROJETO (local)    → dentro de cada projeto   → só naquele projeto
```

A memória de um projeto **nunca** vaza para outro — está fisicamente noutro repo.

## Decidir o que persistir

Salve o que tem **valor durável**, não todo detalhe de conversa:

- Uma conclusão a que se chegou (e o porquê).
- Uma decisão e suas alternativas descartadas.
- Um fato sobre o usuário que muda recomendações futuras.

Não salve: troca trivial, rascunho, ou o que já está num arquivo existente
(atualize-o em vez de duplicar).

## A regra de promoção

Conhecimento de projeto é **local por padrão**. Só sobe para a memória pessoal
o que é genuinamente seu e durável — e **sempre por decisão consciente**:

> Antes de promover, pergunte: *"isto é uma preferência pessoal sua que vale
> para todos os projetos? Quer que eu suba para a memória global?"*

## Nunca

- Misturar memória de projetos diferentes.
- Salvar segredos, chaves ou dados sensíveis.
- Promover algo de projeto para o global sem confirmar com o usuário.
