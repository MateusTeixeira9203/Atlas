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

Antes de debater, planejar ou recomendar, **leia a memória pessoal relevante**
(localização na seção abaixo) — para não repetir o que já foi concluído e para
cruzar com o histórico do usuário:

- `discussions/` — debates e conclusões anteriores
- `readings/` — livros já lidos
- `projects/` — estado de ideias e projetos

## As duas camadas (escopo)

```
PESSOAL (global)   → $ATLAS_HOME/memory/      → carregada SEMPRE, em todo projeto
PROJETO (local)    → <projeto>/.atlas/memory/ → só naquele projeto
```

`ATLAS_HOME` é uma variável de ambiente que aponta para o repositório do Atlas —
o lar do cérebro. Ao trabalhar **dentro de outro projeto** (ex.: odonto.ia):

1. Resolva `ATLAS_HOME` (ex.: `echo $ATLAS_HOME`).
2. Leia a memória **pessoal** de `$ATLAS_HOME/memory/` — é a mesma em todo projeto.
3. Leia a memória **do projeto** de `./.atlas/memory/`, se existir — local àquele projeto.

Quando `ATLAS_HOME` não está definido, você já está no próprio repo do Atlas: a
memória pessoal é o `memory/` local. A memória de um projeto **nunca** vaza para
outro — vivem em pastas separadas, por design.

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
