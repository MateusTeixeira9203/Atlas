# CPE — Guia de Uso

## Pré-requisitos

- **Claude Code** instalado e configurado
- **Node.js ≥ 18** (geralmente já presente onde Claude Code está instalado)
- **Git**

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/cpe.git ~/cpe
cd ~/cpe
```

> **Windows:** use `C:\Users\<nome>\cpe` para evitar conflitos com OneDrive e caminhos com espaço.

### 2. Instalar dependências

```bash
npm install
# Instala apenas js-yaml (única dependência)
```

### 3. Verificar ambiente (dry-run)

```bash
node scripts/cpe.mjs install
```

Mostra o que seria feito sem alterar nada. Saída esperada:
```
=== CPE Install [DRY-RUN] ===

  ✔ Node.js 20.x.x ✔
  ✔ marketplace.json found
  ✔ ~/.claude exists (Claude Code detected)

  Ações:
  · Backup: ~/.claude/settings.json → ~/.cpe-state/settings.backup.<timestamp>.json
  · Registrar marketplace: cpe (file:///home/<user>/cpe)

  [DRY-RUN] Nenhuma mudança aplicada.
  Execute com --apply para registrar o CPE:

    node scripts/cpe.mjs install --apply
```

### 4. Registrar (efetiva)

```bash
node scripts/cpe.mjs install --apply
```

O CPE faz backup de `~/.claude/settings.json` automaticamente antes de qualquer mudança. O backup fica em `~/.cpe-state/settings.backup.<timestamp>.json`.

### 5. Verificar instalação

```bash
node scripts/cpe.mjs status
```

---

## CLI `cpe` — Referência

### `cpe status`

Exibe estado de integração de todas as 6 fontes upstream.

```bash
node scripts/cpe.mjs status
node scripts/cpe.mjs status --verbose   # lista cada recurso individualmente
```

Saída:
```
=== CPE Integration Status ===

  [✔] ecc                      integrated=38  stub=32  planned=1  commit=71d22d0a
  [✔] open-design              integrated=11  stub=0   planned=2  commit=1cb7eae4
  ...

  Totais: integrated=54  stub=32  planned=6
```

### `cpe analyze <source-id>`

Lista todos os recursos de uma fonte, agrupados por status.

```bash
node scripts/cpe.mjs analyze ecc
node scripts/cpe.mjs analyze open-design --verbose   # inclui notas de adaptação
```

IDs de fonte disponíveis: `ecc`, `open-design`, `ruflo`, `karpathy`, `superpowers`, `anthropic-frontend`

### `cpe report`

Gera dois arquivos de documentação na raiz do repositório:

- **`CREDITS.md`** — tabela de atribuição por fonte + lista de recursos integrados
- **`INTEGRATION_REPORT.md`** — dashboard de progresso com stubs e planejados

```bash
node scripts/cpe.mjs report
node scripts/cpe.mjs report --verbose   # inclui notas de adaptação
```

### `cpe doctor`

Valida a integridade de toda a proveniência do CPE:

- Campos obrigatórios no `manifest.yaml`
- `cpe_path` existente para cada recurso integrado
- Frontmatter `cpe:` presente em todos os arquivos
- Detecção de orphans (arquivos em `plugins/` sem registro)

```bash
node scripts/cpe.mjs doctor
node scripts/cpe.mjs doctor --verbose   # inclui lista de recursos OK
```

Exit code: `0` se sem erros, `1` se houver erros.

### `cpe research [source-id]`

Compara o `pinned_commit` de cada fonte com o HEAD atual no GitHub. Detecta quando uma fonte upstream foi atualizada.

```bash
node scripts/cpe.mjs research             # verifica todas as fontes
node scripts/cpe.mjs research ecc         # verifica apenas ECC
node scripts/cpe.mjs research --verbose   # mostra arquivos alterados
node scripts/cpe.mjs research --json      # saída JSON para scripts
```

Salva resultado em `~/.cpe-state/research-<data>.json`.

**GitHub Token (opcional):** define `GITHUB_TOKEN` no ambiente para aumentar o limite de 60 para 5000 requests/hora:
```bash
export GITHUB_TOKEN=ghp_...
node scripts/cpe.mjs research
```

### `cpe update [source-id]`

Detecta quais stubs têm conteúdo real disponível no upstream. Verifica via HEAD em `raw.githubusercontent.com` (sem rate limit).

```bash
node scripts/cpe.mjs update              # verifica todas as fontes
node scripts/cpe.mjs update ecc          # verifica apenas ECC
node scripts/cpe.mjs update --verbose    # mostra URLs upstream + target paths
```

Gera `UPDATE_REPORT.md` e `~/.cpe-state/update-report-<data>.json`.

---

## Uso no Claude Code (dia a dia)

### Skills

Skills são ativadas automaticamente quando você usa trigger phrases relacionadas:

| Skill | Triggers |
|---|---|
| `code-reviewer` (agent) | "review this code", "what issues do you see" |
| `security-reviewer` (agent) | "security review", "check for vulnerabilities" |
| `design-brief` | "create design brief", "set visual direction" |
| `impeccable-design-polish` | "polish this", "remove AI feel" |
| `gsap-core` | "gsap animation", "animate this" |
| `design-system-tokens` | "design tokens", "set up CSS variables" |
| `orchestration-guide` | "coordinate agents", "multi-agent" |

### Comandos

Comandos slash invocados manualmente:

```
/checkpoint create [nome]   → salva estado do projeto
/checkpoint verify          → compara estado atual com checkpoint
/security-scan              → auditoria de segurança em 5 áreas
/pr                         → cria PR com validação completa
/build-fix                  → detecta e corrige erros de build
/epic-claim                 → reivindica epic issue como unidade de trabalho
/design-brief "brief"       → gera DESIGN.md + brief-preview.html
/design-review              → auditoria visual + UX, BLOCK/WARN/APPROVE
/design-system-create       → gera tokens.css + 5 componentes
/polish                     → pass final de design, commits por categoria
/scaffold                   → gerador interativo de templates
/prp-plan                   → gera plano PRP de 6 fases
/orch-build-mvp             → orquestração de MVP via swarm-coordinator
```

### Agents

Invocados para tarefas específicas via Agent tool:

| Agent | Modelo | Responsabilidade |
|---|---|---|
| `code-reviewer` | Sonnet | Review CRITICAL→LOW com verdict |
| `security-reviewer` | Sonnet | OWASP Top 10, achados críticos |
| `architect` | Opus | ADR, design de sistemas |
| `tdd-guide` | Sonnet | Red-Green-Refactor, eval-driven |
| `loop-operator` | Sonnet | Loops autônomos, escalation triggers |
| `spec-miner` | Sonnet | Extração de specs de comportamento |
| `swarm-coordinator` | Opus | Fan-out/fan-in de agentes |
| `goal-planner` | Opus | Natural language → task graph |
| `ui-architect` | Opus | Hierarquia de componentes, token system |
| `ux-reviewer` | Sonnet | WCAG 2.1 AA, Nielsen heuristics |
| `design-polish` | Sonnet | AI tells, tokens, spacing, motion |

---

## Atualização do CPE

```bash
cd ~/cpe
git pull
npm install   # se package.json mudou
node scripts/cpe.mjs status   # verificar estado após atualização
```

---

## Remoção

```bash
# Remover o registro do marketplace em ~/.claude/settings.json
# (editar manualmente removendo a entrada do CPE)

# Restaurar backup se necessário
cp ~/.cpe-state/settings.backup.<timestamp>.json ~/.claude/settings.json
```

O CPE nunca modifica arquivos do Claude Code — apenas registra o marketplace.
Remover o registro é suficiente para desinstalar completamente.
