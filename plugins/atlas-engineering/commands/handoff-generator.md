---
name: handoff-generator
description: Gera handoff de sessão — resume o que foi feito, arquivos alterados, próximos passos, dívidas técnicas e como testar. Usar ao final de toda sessão de desenvolvimento.
cpe:
  source: cpe-personal
  integrated_at: 2026-06-22
  adaptation: Atlas-authored — template de handoff para continuidade entre sessões
---

# /handoff-generator

Gera o documento de handoff da sessão atual. Deve ser executado ao final de cada sessão de desenvolvimento antes de encerrar.

## Como Invocar

```
/handoff-generator                          # gera handoff da sessão atual
/handoff-generator --save                   # salva em .claude/handoffs/YYYY-MM-DD-HH.md
/handoff-generator "foco em autenticação"   # adiciona contexto ao resumo
```

## O que Gerar

Execute os passos abaixo para montar o handoff:

### 1. Coletar contexto da sessão

```bash
# Arquivos alterados (incluindo não commitados)
git diff --name-only HEAD
git diff --name-only --cached

# Commits desta sessão (últimas 6h ou desde o início da sessão)
git log --oneline --since="6 hours ago"

# Status atual
git status --short
```

### 2. Analisar o que foi feito

Olhar os diffs e entender:
- Qual feature/bug foi trabalhado?
- Qual o estado atual (completo, parcial, bloqueado)?
- O que foi deixado intencionalmente para depois?

### 3. Formato do Handoff

```markdown
# Handoff — [Data e hora]

## O que foi feito

[2-5 bullets descrevendo o trabalho da sessão, do mais importante ao menos]

- Implementou [feature] em [arquivo principal]
- Corrigiu [bug] que causava [sintoma]
- Refatorou [componente] para [motivo]

## Estado atual

**Status:** Completo | Parcial | Bloqueado

[1-2 frases sobre onde o trabalho está agora e se está funcional]

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `app/dashboard/page.tsx` | Adicionou lazy loading de projetos |
| `lib/actions/project.ts` | Server Action de criação com validação Zod |
| `components/project-card.tsx` | Novo componente, Client Component |

## Próximos passos (próxima sessão)

Ordenados por prioridade:

1. **[CRÍTICO]** [O que PRECISA ser feito antes de qualquer outra coisa]
2. **[ALTO]** [O que deve ser feito na próxima sessão]
3. **[MÉDIO]** [O que pode esperar uma sessão]
4. **[LOW]** [Melhorias futuras, não urgentes]

## Como testar o que foi feito

```bash
# Ambiente
npm run dev

# Fluxo principal
1. Acessar [rota]
2. [Ação do usuário]
3. Verificar [comportamento esperado]

# Edge cases para testar
- [ ] [Cenário 1]
- [ ] [Cenário 2]
```

## Dívidas técnicas registradas

- [ ] [Dívida 1] — [arquivo:linha] — [quando resolver]
- [ ] [Dívida 2] — tolerável por ora porque [razão]

## Contexto para a próxima sessão

[Informações que a próxima sessão precisa para não perder tempo:]
- [Decisão de design tomada e o motivo]
- [Problema encontrado e abordagem atual]
- [Dependência externa que estava pendente]
- [Variável de ambiente ou configuração necessária]

## Comandos úteis para retomar

```bash
# Retomar exatamente onde parou
[comando ou sequência de ações]

# Verificar estado do banco (se relevante)
[query ou migration pendente]
```
```

### 4. Salvar o handoff

Se `--save` foi passado, salvar em:
```
.claude/handoffs/YYYY-MM-DD-HH.md
```

Criar o diretório se não existir. Usar a data/hora atual no nome do arquivo.

### 5. Resumo no chat

Após gerar o handoff, exibir apenas:
- O que foi feito (3 bullets máximo)
- Próximo passo mais crítico
- Se há algo bloqueado que precisa de atenção

## Regras

- Nunca inventar o que foi feito — basear apenas no diff e nos arquivos alterados
- Próximos passos devem ser específicos, não genéricos ("implementar auth" não; "adicionar middleware de auth em `/app/dashboard/`" sim)
- Se o trabalho está bloqueado, especificar exatamente o que bloqueia
- Dívidas técnicas: só registrar o que foi conscientemente deixado para trás — não todo TODO do código
- Manter o handoff curto o suficiente para ser lido em 2 minutos
