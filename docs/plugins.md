# CPE — Referência de Plugins

Referência completa dos 4 plugins do CPE: skills, agents e commands disponíveis.

---

## `cpe-core`

Convenções CPE, meta-comandos e gerador de templates.

### Commands

| Command | Uso |
|---|---|
| `/scaffold` | Gera artefatos de projeto a partir de templates CPE |

**`/scaffold`** — interativo ou direto:
```
/scaffold                      # lista templates disponíveis
/scaffold kami                 # deck Kami Paper direto
/scaffold retro-quarterly      # deck Retro Quarterly Review
/scaffold agent-profiles       # gera .claude/agent-profiles.yaml
```

---

## `cpe-engineering`

Skills, agents e commands de engenharia de software. Curado de ECC (MIT) e Karpathy.

### Skills (8)

| Skill | Fonte | Descrição |
|---|---|---|
| `karpathy-guidelines` | Karpathy | Diretrizes de codificação: precisão, minimalismo, leitura de código |
| `deployment-patterns` | ECC | CI/CD, blue-green, canary, rollback |
| `golang-patterns` | ECC | Idiomas Go: errors, goroutines, channels, testing |
| `hexagonal-architecture` | ECC | Ports & Adapters, dependency inversion |
| `github-ops` | ECC | GitHub flow, branch strategy, PR conventions |
| `django-celery` | ECC (stub) | Tasks Celery, idempotência, Beat, chain/chord |
| `benchmark` | ECC (stub) | Lighthouse, k6, timing de build |
| `dotnet-patterns` | ECC (stub) | Records, async/await, DI, Result pattern |
| `defi-amm-security` | ECC (stub) | Reentrancy/CEI, oracle TWAP, Slither/Echidna |

> Stubs: conteúdo CPE-normalizado aguardando substituição por conteúdo verbatim.

### Agents (13)

| Agent | Modelo | Função |
|---|---|---|
| `code-reviewer` | Sonnet | Review tiered CRITICAL→LOW, verdict APPROVE/WARN/BLOCK |
| `architect` | Opus | ADR template, system design checklist, red flags |
| `security-reviewer` | Sonnet | OWASP Top 10, tabela de padrões críticos |
| `spec-miner` | Sonnet | Extração de specs de comportamento, openspec/ |
| `tdd-guide` | Sonnet | Red-Green-Refactor, 80%+ coverage, eval-driven |
| `loop-operator` | Sonnet | Loops autônomos, escalation triggers, scope reduction |
| `python-reviewer` | Sonnet | PEP 8, type hints, async patterns, pytest |
| `typescript-reviewer` | Sonnet | Tipos estritos, React, bundle size |
| `go-reviewer` | Sonnet | Idiomas Go, error handling, concorrência (stub) |
| `kotlin-reviewer` | Sonnet | Coroutines, null safety, Android (stub) |
| `java-reviewer` | Sonnet | OOP, Spring, JVM performance (stub) |
| `rust-reviewer` | Sonnet | Ownership, borrowing, async (stub) |
| `refactor-cleaner` | Sonnet | Limpeza de dívida técnica, nomes e estrutura |
| `performance-optimizer` | Sonnet | Profiling, bottlenecks, caching |

### Commands (16)

| Command | Função |
|---|---|
| `/epic-claim` | Reivindica epic issue como unidade de trabalho |
| `/epic-decompose` | Decompõe epic em tarefas atômicas |
| `/checkpoint create\|verify\|list` | Salva/compara estado do projeto |
| `/security-scan` | Auditoria em 5 áreas, security grade |
| `/pr` | Criação de PR com 6 fases de validação |
| `/build-fix` | Detecta sistema de build, corrige em ordem de dependência |
| `/quality-gate` | Bloqueia merge se qualidade abaixo do limiar |
| `/test-coverage` | Gera relatório de cobertura e sugere testes ausentes |
| `/refactor-clean` | Aplica limpeza de código com critérios explícitos |
| `/python-review` | Review especializado Python via python-reviewer |
| `/go-build` | Build Go com detecção de erros |

---

## `cpe-design`

Design intelligence: tokens, visual review, acessibilidade, polish. Curado de Open Design (Apache-2.0) e Anthropic Frontend Design.

### Skills (5)

| Skill | Fonte | Descrição |
|---|---|---|
| `frontend-design` | Anthropic (oficial) | Regras de UI generation: hierarquia, tipografia, tokens, dark mode |
| `design-brief` | Open Design | 8 dimensões de brief → DESIGN.md com vocabulário fechado |
| `impeccable-design-polish` | Open Design / pbakaus | Remove AI tells, audita e refina interfaces geradas |
| `gsap-core` | Open Design (MIT) | GSAP API: to/from/timeline/stagger, prefers-reduced-motion |
| `design-system-tokens` | CPE-synthesis | Vocabulário canônico: color, typography, spacing, radius, shadow, motion |

#### `design-brief` — 8 dimensões

| Dimensão | Exemplos |
|---|---|
| palette | `dark`, `ocean-dark`, `warm-light`, `neutral` |
| accent | `blue-500`, `cyan-400`, `violet-500`, `emerald-500` |
| body | `inter`, `geist`, `dm-sans`, `source-sans` |
| display | `cal-sans`, `plus-jakarta-sans`, `outfit`, `sora` |
| layout | `centered`, `sidebar`, `dashboard`, `card-grid` |
| mood | `professional`, `playful`, `minimal`, `bold` |
| density | `spacious`, `balanced`, `compact` |
| constraints | `mobile-first`, `reduced-motion`, `print-safe` |

#### `impeccable-design-polish` — AI tells removidos

- Purple-blue gradients sem razão de produto
- Generic card grid (tudo é card)
- Border-radius > 16px na maioria dos elementos
- "Powerful", "Seamless" — linguagem de marketing vazia
- Botões gradient onde flat seria mais limpo
- Orbs/blobs flutuantes no hero
- Padding uniforme em todas as seções

### Agents (3)

| Agent | Modelo | Função |
|---|---|---|
| `ui-architect` | Opus | Hierarquia de componentes, layout strategy, token system, UI-ADR |
| `ux-reviewer` | Sonnet | WCAG 2.1 AA, Nielsen heuristics. BLOCK em violações AA |
| `design-polish` | Sonnet | AI tells, token consistency, spacing 4px grid, motion |

### Commands (4)

| Command | Entrada | Saída |
|---|---|---|
| `/design-brief "..."` | Brief NL ou I-Lang | `DESIGN.md` + `brief-preview.html` |
| `/design-review` | Diretório ou arquivo | Relatório BLOCK/WARN/APPROVE |
| `/design-system-create` | `DESIGN.md` existente | `tokens.css` + 5 componentes + style guide |
| `/polish` | Diretório alvo | AI tells removidos, commits por categoria |

---

## `cpe-workflows`

Orquestração multi-agente, PRP e workflow automation. Curado de Ruflo (MIT).

### Skills (1)

| Skill | Fonte | Descrição |
|---|---|---|
| `orchestration-guide` | Ruflo | Memory-first, topologias (pipeline/fan-out/supervisor), 3-tier model routing, anti-drift, SendMessage |

#### Resumo do `orchestration-guide`

**Memory-first protocol:**
1. Buscar memória antes de qualquer tarefa
2. Inicializar coordenação (1 mensagem)
3. Executar imediatamente — não esperar

**3 topologias:**
- **Pipeline** (A→B→C) — processamento sequencial
- **Fan-out/Fan-in** — 1 coordinator + N workers paralelos (max 5)
- **Supervisor/Worker** — fila de subtarefas distribuída

**Three-tier model routing:**
- Haiku → tarefas simples (~$0.0002)
- Sonnet → trabalho padrão (~$0.003)
- Opus → raciocínio complexo (~$0.015)

### Agents (2)

| Agent | Modelo | Função |
|---|---|---|
| `swarm-coordinator` | Opus | Decompõe → distribui → executa → coleta → sintetiza (max 5 agentes) |
| `goal-planner` | Opus | Linguagem natural → task graph A* com dependências |

### Commands (2)

| Command | Função |
|---|---|
| `/prp-plan` | 6 fases: DETECT → PARSE → EXPLORE → RESEARCH → DESIGN → GENERATE. Output: `.claude/plans/<feature>.md` |
| `/orch-build-mvp` | Invoca goal-planner + swarm-coordinator. Approval gate após decomposição |

---

## Templates

Templates localizados em `templates/` — gerados via `/scaffold`.

### `templates/decks/`

| Template | Estilo | Formato |
|---|---|---|
| `html-deck-framework` | Skeleton neutro | 1920×1080, CSS vars, keyboard nav, PDF print |
| `kami-paper-deck` | Parchment editorial | Parchment `#f5f4ed`, ink-blue, Charter serif, no-bold |
| `retro-quarterly-review` | Bold quarterly review | 3 slides, navy+laranja, wipe transitions |

### `templates/workflows/`

| Template | Formato | Conteúdo |
|---|---|---|
| `agent-profiles` | `.claude/agent-profiles.yaml` | Perfis dev / safe / ci com model routing e security rules |
