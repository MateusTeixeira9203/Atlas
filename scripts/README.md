# scripts/ — CLI do Atlas

CLI única `cpe` (Node.js ESM) que orquestra todo o ciclo de vida. Wrappers
finos por SO (`install.ps1`, `install.sh`) apenas localizam o node e chamam
`cpe.mjs`.

## Contrato de comandos (implementado na Fase 8)

| Comando | Ação |
|---|---|
| `cpe install` | Detecta SO + Claude Code, backup, registra marketplace, instala plugins |
| `cpe uninstall` | Remove plugins e marketplace, restaura backup |
| `cpe update` | Atualiza o Atlas e relata incompatibilidades |
| `cpe sources update` | Roda o Update Engine (relatório, nunca aplica) |
| `cpe research` | Roda o Research Engine (relatório) |
| `cpe doctor` | Diagnóstico: valida manifests, plugins, proveniência órfã |

## Convenções

- **Dry-run por padrão**; efetiva só com `--apply`.
- **Backup sempre** antes de tocar em `~/.claude`.
- **Zero caminho absoluto**; raiz via `import.meta.url`, home via `os.homedir()`.
