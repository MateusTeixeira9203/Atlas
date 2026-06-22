# Arquitetura do Claude Professional Environment (CPE)

> Documento canônico da **Fase 1 — Arquitetura**.
> Status: aprovado em 2026-06-22. Este documento governa as fases seguintes.

---

## 1. Visão

O CPE é uma **distribuição pessoal do ambiente de desenvolvimento para Claude Code**:
um conjunto coeso e versionado de skills, agentes, comandos, workflows e
inteligência de design, reutilizável em qualquer projeto e instalável em
qualquer máquina com um único comando.

O CPE **complementa** o Claude Code; nunca o modifica. A Anthropic continua
atualizando o Claude Code normalmente, e o CPE pode ser instalado, atualizado
ou removido sem afetar essa instalação.

---

## 2. Princípio organizador

> **O CPE é um repositório que _é_ um marketplace oficial do Claude Code.**

A integração acontece pelo mecanismo nativo `claude plugin` (marketplace +
plugins). Isso resolve quatro exigências de uma só vez:

| Exigência | Como o marketplace nativo atende |
|---|---|
| Nunca sobrescrever o Claude Code | Plugins são aditivos; o CLI gerencia o registro |
| Reversível | `claude plugin uninstall` + `marketplace remove` |
| Portátil | `git clone` + `install` em qualquer SO |
| À prova de futuro | A Anthropic mantém o contrato do plugin, não nós |

### 2.1 Três planos de responsabilidade

O CPE separa três coisas que normalmente se misturam:

| Plano | O que é | Local | Versionado |
|---|---|---|---|
| **Fontes** | proveniência + cache dos upstreams | `sources/` | manifesto sim, cache não |
| **Conteúdo** | o que o Claude Code carrega | `plugins/` | sim |
| **Estado** | cache, backups, logs, relatórios | `state_dir` (fora do repo) | não |

O **estado mutável vive fora do repositório** (em `~/.cpe-state` por padrão).
Isso mantém o git limpo e — decisivo neste ambiente — evita o churn de
sincronização do OneDrive sobre dados voláteis e pesados.

---

## 3. Estrutura de diretórios

```
cpe/                                    ← raiz = marketplace
├── .claude-plugin/
│   └── marketplace.json                ← lista os plugins do CPE
├── plugins/                            ← unidades que o Claude Code carrega
│   ├── cpe-core/                       ← convenções, meta-comandos, guarda-design
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/  skills/  agents/  hooks/
│   ├── cpe-engineering/                ← Karpathy · Ruflo · ECC
│   ├── cpe-design/                     ← Open Design · Anthropic Frontend
│   └── cpe-workflows/                  ← Ruflo
├── sources/                            ← rastreabilidade (NÃO carregado pelo CC)
│   ├── manifest.yaml                   ← registro dos upstreams
│   └── <source-id>/
│       ├── integrated.yaml             ← o que foi extraído, com metadados
│       └── decisions/                  ← relatórios de dedup justificados
├── engines/
│   ├── update/                         ← Update Engine (clean architecture)
│   └── research/                       ← Research Engine
├── scripts/
│   ├── cpe.mjs                         ← CLI única (install/uninstall/update/doctor)
│   ├── install.ps1   install.sh        ← wrappers finos (localizam o node)
├── config/
│   ├── config.yaml                     ← config central, zero caminho absoluto
│   └── watchlist.yaml                  ← alvos do Research Engine
├── docs/                               ← documentação (PT-BR), 1 por módulo
├── templates/   examples/
├── CREDITS.md                          ← atribuição consolidada (gerada)
└── README.md
```

### 3.1 Por que plugins por domínio, e não por tipo

Um plugin do Claude Code é um **bundle coeso** (skills + commands + agents +
hooks juntos). Agrupar por domínio (`cpe-engineering`) é mais útil e permite
instalação seletiva, em vez de separar um `skills/` gigante de um `agents/`
gigante. O modelo mental do projeto (skills / agents / commands / design …)
sobrevive como **taxonomia de classificação** dentro de `sources/`, não como
estrutura de pastas de entrega.

---

## 4. Modelo Sources — rastreabilidade

### 4.1 Filosofia

Não copiar integralmente. Não modificar o original. Preservar autoria,
licença e rastreabilidade. Permitir atualização independente de cada fonte.

### 4.2 Pipeline de integração

```
Source → Análise → Classificação → Extração → Normalização → Integração → Documentação → Rastreabilidade
```

Cada recurso é classificado em uma destas categorias:
`skill · prompt · workflow · agent · command · design-rule · template · tool · utility · documentation`.

### 4.3 Registro de proveniência

`sources/manifest.yaml` declara as fontes. Cada recurso extraído é registrado
em `sources/<id>/integrated.yaml` — esta é a **fonte da verdade** para gerar o
`CREDITS.md` e para o Update Engine diffar:

```yaml
- id: karpathy-systematic-debugging
  classified_as: skill
  target_plugin: cpe-engineering
  original_path: skills/systematic-debugging.md
  source_commit: abc123
  normalized: true
  adaptation_note: "renomeado para padrão cpe-*; conteúdo preservado"
  integrated_at: 2026-06-22
```

### 4.4 Duplicações

Nunca remover automaticamente. Comparar, gerar relatório em
`sources/<id>/decisions/`, justificar a escolha e registrar a decisão. Toda
eliminação de redundância é documentada.

> **Caso conhecido:** o Superpowers (`obra/superpowers`) já está parcialmente
> instalado em `~/.claude/skills` neste ambiente. O `cpe-*` não deve
> reempacotá-lo cegamente — o relatório de dedup da Fase 3 decide o que
> absorver e o que apenas referenciar.

---

## 5. Fluxos operacionais

Todos via CLI oficial `claude plugin`, sempre com backup antes e dry-run por padrão.

### 5.1 Install
1. Detecta SO e `claude --version`.
2. Backup de `~/.claude/settings.json` e da config de plugins em `state_dir/backups/`.
3. `claude plugin marketplace add <repo>`.
4. `claude plugin install cpe-core@cpe` (e demais plugins).
5. Valida (`claude plugin validate`) e emite relatório.

### 5.2 Update do CPE
`git pull` → `claude plugin update` → relatório de incompatibilidades. Nunca automático.

### 5.3 Update das fontes
O Update Engine compara o upstream com `integrated.yaml`, identifica recursos
novos / removidos / incompatíveis, gera relatório e **sugere** — nunca aplica.

### 5.4 Uninstall
`claude plugin uninstall` + `marketplace remove` + restauração do backup. Limpo
e totalmente reversível.

---

## 6. Decisões técnicas

| Decisão | Escolha | Razão |
|---|---|---|
| Linguagem de instalador/engines | **Node.js (ESM `.mjs`)** | Garantido presente (Claude Code roda sobre Node), multiplataforma, symlink/JSON nativos, chama o CLI `claude` |
| Wrappers de SO | `install.ps1` / `install.sh` finos | Só localizam o node e chamam `scripts/cpe.mjs` |
| Config humana | **YAML** | Legível; JSON só onde o Claude Code exige (`marketplace.json`, `plugin.json`) |
| Caminhos | **Zero absolutos** | Raiz via `import.meta.url`; home via `os.homedir()` |
| Idioma | docs **PT-BR**, identificadores **EN** | Interopera com upstreams e com o Claude |
| Arquitetura dos engines | **Clean Architecture** | `domain/` · `application/` · `adapters/` — portas mockáveis, testável |

### 6.1 Engines em Clean Architecture

```
engines/<engine>/
├── domain/        ← entidades: Source, Resource, Provenance (sem dependências)
├── application/   ← casos de uso: IntegrateSource, DetectUpdates, ScoutEcosystem
└── adapters/      ← ClaudeCli, Git, FileSystem, ReportRenderer (implementam portas)
```

Cada caso de uso orquestra portas; os adaptadores são injetados. Isso torna os
engines testáveis sem rede nem filesystem real.

---

## 7. Riscos e mitigações

| Risco | Sev. | Mitigação |
|---|---|---|
| OneDrive sobre dados voláteis | 🟡 | Estado mutável fora do repo (`state_dir`), longe do OneDrive |
| Caminhos com espaço / acento | 🟡 | APIs de path sempre; nunca concatenação de string. Raiz relocada para `C:\Users\mateu\cpe` |
| Dedup com Superpowers já instalado | 🟡 | Relatório de dedup na Fase 3, decisão registrada |
| Suporte a marketplace local | 🟡 | Confirmar na Fase 2; plano B é repo git local apontado pelo CLI |
| Licenças heterogêneas dos upstreams | 🟡 | Detectar e registrar licença antes de extrair (Fase 2) |

---

## 8. Mapa Fase → entregável

| Fase | Entregável que constrói sobre esta arquitetura |
|---|---|
| 1 — Arquitetura | **Este documento + esqueleto + schemas** ✅ |
| 2 — Integração | Integrador (pipeline Sources), preenche `manifest`/`integrated` |
| 3 — Skills | Extração e curadoria de skills nos plugins `cpe-*` + dedup |
| 4 — Agentes | Agentes nos plugins, com proveniência |
| 5 — Commands | Comandos e estrutura (ECC) |
| 6 — Design Intelligence | `cpe-design` completo: tokens, regras, guarda anti-genérico |
| 7 — Templates | `templates/` versionados |
| 8 — Automation Engine | `scripts/cpe.mjs` install/uninstall/update/doctor |
| 9 — Research Engine | `engines/research` + relatórios da watchlist |
| 10 — Update Engine | `engines/update` + diff de fontes |
| 11 — Documentação | docs por módulo + CREDITS gerado |
| 12 — Auditoria | revisão completa de proveniência, licenças e qualidade |

---

## 9. Convenções de qualidade

Todo código do CPE segue Clean Architecture, SOLID, DRY, KISS e Clean Code,
com documentação obrigatória por módulo. Identificadores em inglês,
documentação para humanos em PT-BR. Nada de caminhos absolutos. Nada é aplicado
ao ambiente do usuário sem confirmação explícita.
