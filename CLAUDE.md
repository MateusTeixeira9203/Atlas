# CLAUDE.md — Atlas

Este é o repositório do Atlas — uma distribuição pessoal de skills, agents, commands
e design intelligence para Claude Code. Ao trabalhar neste repo, siga as regras abaixo.

---

## Identidade do projeto

O Atlas **é** um marketplace do Claude Code. O repositório está registrado via
`claude plugin marketplace add`, e seus plugins são carregados pelo Claude Code
nativamente. Este não é um projeto de aplicação — é infraestrutura para o Claude.

---

## Regras absolutas

### Nunca
- Sobrescrever arquivos de `~/.claude` sem backup explícito
- Executar `cpe install --apply` sem confirmação do usuário
- Modificar `sources/manifest.yaml` sem justificativa documentada
- Alterar `pinned_commit` sem registrar a mudança no `integrated.yaml`
- Criar recursos sem frontmatter `cpe:` completo
- Remover recursos sem documentar a decisão em `sources/<fonte>/decisions/`

### Sempre
- Rodar `node scripts/cpe.mjs doctor` após mudanças em `plugins/` ou `sources/`
- Rodar `node scripts/cpe.mjs report` após mudanças para manter CREDITS.md atualizado
- Usar `js-yaml` (já disponível) para qualquer parsing de YAML — nunca regex
- Preservar a hierarquia: `manifest.yaml` → `integrated.yaml` → arquivo Atlas
- Manter `cpe_path` sincronizado com a localização real do arquivo

---

## Estrutura que importa

```
plugins/<plugin>/
  .claude-plugin/plugin.json   ← registra skills/agents/commands do plugin
  skills/<nome>/SKILL.md       ← frontmatter cpe: obrigatório
  agents/<nome>/AGENT.md       ← frontmatter cpe: obrigatório
  commands/<nome>.md           ← frontmatter cpe: obrigatório

sources/
  manifest.yaml                ← fonte da verdade para fontes upstream
  <fonte>/integrated.yaml      ← rastreabilidade de cada recurso

scripts/
  cpe.mjs                      ← CLI principal; nunca invocar sub-módulos diretamente
```

---

## CLI disponível

```bash
node scripts/cpe.mjs status              # estado geral
node scripts/cpe.mjs analyze <fonte>     # recursos de uma fonte
node scripts/cpe.mjs doctor              # validação completa
node scripts/cpe.mjs report              # regenera CREDITS.md
node scripts/cpe.mjs research [fonte]    # atualizações upstream
node scripts/cpe.mjs update [fonte]      # stubs substituíveis
node scripts/cpe.mjs install             # dry-run (sem --apply)
```

---

## Adicionando recursos

Ao adicionar um novo SKILL.md, AGENT.md ou command:

1. Criar o arquivo com frontmatter `cpe:` completo:
```yaml
cpe:
  source: <source-id>
  original_path: <caminho no upstream>
  original_url: https://github.com/...
  source_commit: <8 chars>
  license: MIT
  integrated_at: <data YYYY-MM-DD>
  adaptation: <o que foi modificado>
```

2. Registrar em `sources/<fonte>/integrated.yaml`:
```yaml
- id: <fonte>-<tipo>-<nome>
  type: skill|agent|command
  status: integrated|stub|planned
  target_plugin: atlas-engineering|atlas-design|atlas-workflows|atlas-core
  cpe_path: plugins/<plugin>/skills/<nome>/SKILL.md
  ...
  integrated_at: <data>
```

3. Verificar: `node scripts/cpe.mjs doctor`

---

## Adicionando fontes

Ver `docs/contributing.md` para o processo completo.

Resumo: registrar em `manifest.yaml` → criar `integrated.yaml` → integrar recursos → validar com `doctor`.

---

## Estado atual (2026-06-23)

- **10 fases concluídas** (de 12)
- **86/106 recursos** integrados (81%)
- **32 stubs** aguardando substituição (detectados por `cpe update ecc`)
- **Fase 11** (documentação) — em andamento
- **Fase 12** (auditoria) — pendente

Stubs substituíveis estão em `UPDATE_REPORT.md`. Todos têm conteúdo real disponível
no commit pinado do ECC (`71d22d0a`).

---

## Fluxo de trabalho para esta sessão

Se o usuário pedir para continuar desenvolvendo o Atlas:

1. Verificar em qual fase estamos: `node scripts/cpe.mjs status`
2. Executar `node scripts/cpe.mjs doctor` para ver o estado atual
3. Trabalhar em uma fase por vez — sempre aguardar aprovação antes de avançar
4. Após cada fase: commitar, apresentar resumo, aguardar "sim" ou "s"

---

## Convenções de código

- **Node.js ESM** (`.mjs`) para todos os scripts
- **js-yaml** para YAML — não usar regex
- **Zero caminhos absolutos** — usar `import.meta.url` e `os.homedir()`
- **Dry-run por padrão** — efetiva apenas com `--apply`
- **Backups sempre** antes de tocar em `~/.claude`
- Identificadores em **inglês**, documentação em **PT-BR**
