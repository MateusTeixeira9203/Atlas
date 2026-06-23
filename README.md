# Claude Professional Environment (CPE)

Distribuição pessoal e modular do ambiente de desenvolvimento para **Claude Code** —
skills, agentes, comandos, workflows e design intelligence curados de 6 repositórios
base, reutilizáveis em qualquer projeto, instaláveis com um único comando.

> O CPE **complementa** o Claude Code; nunca o modifica. É registrado como
> marketplace nativo via `claude plugin marketplace add`.

---

## O que está incluído

| Plugin | Skills | Agents | Commands | Foco |
|---|---|---|---|---|
| `cpe-engineering` | 8 | 13 | 16 | Backend, segurança, linguagens |
| `cpe-design` | 5 | 3 | 4 | UI/UX, tokens, polish, animação |
| `cpe-workflows` | 1 | 2 | 2 | Orquestração multi-agente, PRP |
| `cpe-core` | — | — | 1 | `/scaffold` — gerador de templates |

**Templates:** 4 (3 decks HTML + 1 perfil de agentes)  
**Fontes upstream:** 6 (ECC, Open Design, Ruflo, Karpathy, Superpowers, Anthropic)  
**Progresso:** 86/106 recursos integrados (81%); 32 stubs aguardando substituição

---

## Instalação

```bash
# 1. Clonar
git clone https://github.com/<seu-usuario>/cpe.git ~/cpe
cd ~/cpe

# 2. Instalar dependências do CLI
npm install

# 3. Verificar pré-requisitos (dry-run)
node scripts/cpe.mjs install

# 4. Registrar o CPE como marketplace (efetiva)
node scripts/cpe.mjs install --apply
```

Após o registro, o Claude Code detecta os plugins automaticamente.  
Reversível: `node scripts/cpe.mjs install --apply` pode ser desfeito removendo o marketplace.

---

## CLI `cpe`

```
node scripts/cpe.mjs <comando> [opções]
```

| Comando | O que faz |
|---|---|
| `status` | Estado de integração de todas as 6 fontes |
| `analyze <source>` | Lista recursos de uma fonte (integrated/stub/planned) |
| `report` | Gera `CREDITS.md` + `INTEGRATION_REPORT.md` |
| `doctor` | Valida proveniência, `cpe_path`, frontmatter, orphans |
| `research [source]` | Detecta novos commits upstream vs. commit pinado |
| `update [source]` | Detecta stubs substituíveis por conteúdo real |
| `install [--apply]` | Registra CPE como marketplace (dry-run sem `--apply`) |

```bash
# Exemplos
node scripts/cpe.mjs status
node scripts/cpe.mjs analyze ecc --verbose
node scripts/cpe.mjs research --json
node scripts/cpe.mjs update ecc
node scripts/cpe.mjs doctor
```

---

## Uso diário no Claude Code

Após instalado, as skills/agents/commands ficam disponíveis automaticamente em qualquer sessão Claude Code.

**Skills** — ativadas por trigger phrases:
```
"review this code"        → code-reviewer agent
"design brief: dark SaaS" → /design-brief command → DESIGN.md
"create a quarterly deck" → /scaffold → retro-quarterly-review
"set up gsap animation"   → gsap-core skill
```

**Agents** — invocados para tarefas específicas:
```
/code-review      → code-reviewer + security-reviewer
/design-review    → ux-reviewer + design-polish
```

**Commands** — slash commands disponíveis:
```
/checkpoint create    → salva estado do projeto
/security-scan        → 5 áreas de segurança, security grade
/pr                   → criação de PR com validação
/design-brief "..."   → gera DESIGN.md
/polish               → remove AI tells, normaliza tokens
/scaffold             → gera deck HTML ou agent-profiles.yaml
```

---

## Estrutura do Repositório

```
cpe/
├── .claude-plugin/marketplace.json   ← CPE IS um marketplace Claude Code
├── plugins/
│   ├── cpe-core/                     ← /scaffold
│   ├── cpe-engineering/              ← skills, agents, commands de engenharia
│   ├── cpe-design/                   ← design intelligence
│   └── cpe-workflows/               ← orquestração multi-agente
├── sources/
│   ├── manifest.yaml                 ← 6 fontes upstream com commits pinados
│   └── <fonte>/integrated.yaml       ← rastreabilidade por recurso
├── templates/
│   ├── decks/                        ← html-deck-framework, kami, retro-quarterly
│   └── workflows/                    ← agent-profiles (dev/safe/ci)
├── scripts/
│   ├── cpe.mjs                       ← CLI principal
│   ├── integrate.mjs                 ← parser YAML (js-yaml), cmdStatus/Analyze
│   ├── report-engine.mjs             ← CREDITS.md + INTEGRATION_REPORT.md
│   ├── doctor.mjs                    ← validação de proveniência
│   ├── research-engine.mjs           ← detecção de atualizações upstream
│   └── update-engine.mjs             ← detecção de stubs substituíveis
├── docs/
│   ├── architecture.md               ← design canônico do CPE
│   ├── usage.md                      ← instalação e uso detalhado
│   ├── plugins.md                    ← referência completa dos plugins
│   └── contributing.md               ← como adicionar fontes e recursos
├── CLAUDE.md                         ← instruções para Claude Code
└── CREDITS.md                        ← atribuição gerada (cpe report)
```

---

## Créditos

O CPE cura recursos de projetos open source com licenças explícitas.
Nenhum conteúdo é copiado integralmente sem atribuição. Ver [CREDITS.md](CREDITS.md).

| Fonte | Autor | Licença |
|---|---|---|
| ECC (Everything Claude Code) | affaan-m | MIT |
| Open Design | nexu-io | Apache-2.0 |
| Ruflo | ruvnet | MIT |
| Andrej Karpathy Skills | multica-ai | (sem licença — uso educacional) |
| Superpowers | Jesse Vincent (obra) | MIT |
| Anthropic Frontend Design | Anthropic | Apache-2.0 |
