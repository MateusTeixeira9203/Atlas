# Atlas — Contribuindo (Adicionando Fontes e Recursos)

Este documento descreve como adicionar uma nova fonte upstream ou integrar
novos recursos no Atlas, seguindo os mesmos princípios usados nas Fases 2-10.

---

## Princípios inegociáveis

1. **Nunca copiar integralmente** sem atribuição explícita
2. **Nunca sobrescrever** arquivos do Claude Code
3. **Proveniência em cada arquivo** — frontmatter `cpe:` obrigatório
4. **Dedup documentado** — toda decisão de incluir/excluir registrada em `decisions/`
5. **Nunca aplicar automaticamente** — engines só reportam

---

## Adicionando uma nova fonte upstream

### 1. Registrar em `sources/manifest.yaml`

```yaml
sources:
  - id: nova-fonte
    name: Nome Legível
    repository: https://github.com/owner/repo
    author: owner
    responsible_for: [skills, commands]
    pinned_commit: <sha-completo-de-40-chars>
    pinned_date: 2026-MM-DD
    license: MIT        # ou Apache-2.0, ou "none", etc.
    license_note: "Contexto legal da licença"
    last_sync: 2026-MM-DD
    integrated_yaml: sources/nova-fonte/integrated.yaml
```

> `pinned_commit` deve ser o SHA completo de 40 caracteres — não o abreviado.

### 2. Criar `sources/nova-fonte/integrated.yaml`

```yaml
source_id: nova-fonte
schema_version: 1
license: MIT
integrated_at: 2026-MM-DD

resources: []   # preenchido à medida que recursos são integrados
```

### 3. Verificar com `cpe doctor`

```bash
node scripts/cpe.mjs doctor
# Deve mostrar aviso sobre recursos não registrados — esperado inicialmente
```

---

## Integrando um recurso (skill, agent ou command)

### 1. Analisar o recurso upstream

```bash
node scripts/cpe.mjs analyze nova-fonte   # se já registrado
```

Ou ler diretamente:
```bash
curl -s "https://raw.githubusercontent.com/owner/repo/<sha>/path/to/file.md"
```

### 2. Checar deduplicação

Antes de integrar, verificar se existe recurso equivalente já no Atlas:
- Skills: buscar em `plugins/*/skills/`
- Agents: buscar em `plugins/*/agents/`
- Commands: buscar em `plugins/*/commands/`

Se houver duplicata, registrar a decisão em `sources/<fonte>/decisions/`:

```markdown
# decisions/dedup-<nome>.md

## Recurso: <nome>

### Situação
<descrição do conflito>

### Decisão
INCLUIR | EXCLUIR | RENOMEAR

### Justificativa
<por que essa decisão>

### Fonte mantida
<qual versão foi preferida e por quê>
```

### 3. Criar o arquivo Atlas

**Skill** → `plugins/<plugin>/skills/<nome>/SKILL.md`  
**Agent** → `plugins/<plugin>/agents/<nome>/AGENT.md`  
**Command** → `plugins/<plugin>/commands/<nome>.md`

Todo arquivo Atlas começa com o frontmatter de proveniência:

```yaml
---
name: <nome-do-recurso>
description: <descrição em 1 linha>
# Para agents: adicionar model, tools
cpe:
  source: <source-id>
  original_path: <caminho no repo upstream>
  original_url: https://github.com/owner/repo/tree/<sha>/path
  source_commit: <8 chars do SHA>
  license: MIT
  integrated_at: 2026-MM-DD
  adaptation: <o que foi alterado, se algo foi>
---
```

**Para recursos sintetizados (Atlas-authored):**

```yaml
cpe:
  source: cpe
  synthesis_sources:
    - fonte-a (license-a, commit abcd1234)
    - fonte-b (license-b, commit efgh5678)
  integrated_at: 2026-MM-DD
  adaptation: Atlas-authored synthesis
```

### 4. Registrar em `integrated.yaml`

Adicionar à lista `resources` da fonte:

```yaml
- id: <source-id>-<tipo>-<nome>
  type: skill           # skill | agent | command | template | document
  status: integrated    # integrated | stub | planned
  target_plugin: atlas-engineering
  cpe_path: plugins/atlas-engineering/skills/<nome>/SKILL.md
  original_path: skills/<nome>/SKILL.md
  original_url: https://github.com/owner/repo/tree/<sha>/skills/<nome>
  source_commit: <8 chars>
  integrated_at: 2026-MM-DD
  adaptation: <nota de adaptação>
```

**Status `stub`:** conteúdo foi criado mas é incompleto (ex: baseado em sumário).  
**Status `planned`:** intenção registrada, não integrado ainda.

### 5. Validar

```bash
node scripts/cpe.mjs doctor   # deve mostrar o novo recurso como OK
node scripts/cpe.mjs report   # atualiza CREDITS.md e INTEGRATION_REPORT.md
```

---

## Escolhendo o plugin certo

| Tipo de conteúdo | Plugin |
|---|---|
| Skills de engenharia (linguagens, arquitetura, segurança, testes) | `atlas-engineering` |
| Agents de revisão de código / arquitetura | `atlas-engineering` |
| Commands de CI/CD, git, qualidade | `atlas-engineering` |
| Skills de design, tokens, animação | `atlas-design` |
| Agents de UX/UI review | `atlas-design` |
| Commands de design workflow | `atlas-design` |
| Skills/agents de orquestração multi-agente | `atlas-workflows` |
| Commands de workflow e planejamento | `atlas-workflows` |
| Commands de meta-utilidades, templates | `atlas-core` |

---

## Atualizando um stub para integrado

Quando `cpe update` identifica um stub substituível:

1. Baixar conteúdo upstream:
```bash
curl -s "<url-do-cpe-update --verbose>" > /tmp/upstream.md
```

2. Revisar conteúdo: verificar qualidade, relevância, licença

3. Normalizar frontmatter Atlas (adicionar `cpe:` no topo)

4. Salvar no `cpe_path` sugerido

5. Atualizar `status: stub → integrated` em `integrated.yaml`

6. Executar `cpe doctor` para confirmar

7. Executar `cpe report` para atualizar CREDITS.md

---

## Convenções de nomenclatura

- **IDs em `integrated.yaml`:** `<source-id>-<tipo>-<nome-do-recurso>` (ex: `ecc-agent-code-reviewer`)
- **Diretórios de skills/agents:** `<nome-kebab-case>/`
- **Arquivos de command:** `<nome-kebab-case>.md`
- **Nomes em `SKILL.md/AGENT.md`:** `<nome-kebab-case>` (igual ao diretório)

---

## Checklists rápidos

### Novo recurso ✓
- [ ] Frontmatter `cpe:` presente e completo
- [ ] Registrado em `integrated.yaml` com `cpe_path`
- [ ] `cpe doctor` sem novos erros
- [ ] Dedup verificado (sem duplicata silenciosa)
- [ ] Se duplicata: `decisions/` atualizado

### Nova fonte ✓
- [ ] Entrada em `manifest.yaml` com `pinned_commit` completo (40 chars)
- [ ] `integrated.yaml` criado em `sources/<id>/`
- [ ] Licença verificada e registrada
- [ ] `cpe status` mostra a nova fonte
