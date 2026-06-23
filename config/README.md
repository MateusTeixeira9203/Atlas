# config/ — Configuração

| Arquivo | Papel |
|---|---|
| `config.yaml` | Configuração central do Atlas. **Zero caminhos absolutos.** |
| `watchlist.yaml` | Alvos monitorados pelo Research Engine |

Regra de ouro: tudo é resolvido em runtime (raiz via `import.meta.url`, home via
`os.homedir()`), garantindo funcionamento idêntico em Windows, Linux e macOS.

O **estado mutável** (cache, backups, logs, relatórios) vive em `state_dir`
(default `~/.cpe-state`) — **fora** do repositório e fora do OneDrive.
